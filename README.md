# Text to Voice AI Platform

A full-stack web application for converting text into speech: you sign up, browse or create voices, generate audio, and download it. Under the hood it is a **pnpm monorepo**—a Next.js app talks to **Express** services backed by **PostgreSQL** and **MinIO**.

**On how voice synthesis is scheduled**: the **worker service** accepts TTS requests over HTTP, **persists job state** in the database, then **offloads execution** to a **RabbitMQ** queue so the request path stays fast while Kokoro inference runs **asynchronously**. A **Python FastAPI** service performs the actual **text-to-speech** work; the worker is the **orchestrator** between the queue, Postgres, object storage, and that engine.

---

## Table of contents

1. [What this project does](#what-this-project-does)
2. [Features](#features-in-plain-language)
3. [How the pieces fit together](#how-the-pieces-fit-together)
4. [Worker service and message queues](#worker-service-and-message-queues)
5. [Tech stack](#tech-stack)
6. [Repository layout](#repository-layout)
7. [API routes (backend)](#api-routes-backend)
8. [Frontend routes (Next.js)](#frontend-routes-nextjs)
9. [Prerequisites](#prerequisites)
10. [Getting started](#getting-started)
11. [Environment variables](#environment-variables)
12. [Running services](#running-services)
13. [Infrastructure ports](#infrastructure-ports)
14. [TTS Service](#tts-service)

---

## What this project does

At a high level:

- **Identity**: Users register, log in, and get JWT access tokens (with refresh). They can also create **API keys** (prefix `xi_`) and use those as `Bearer` tokens the same way as a normal JWT—handy for scripts or future automation.
- **Voices**: There is a **public library** of premade voices (seeded in the database) and **per-user voices** you can create, edit, or delete. You can attach **audio samples** to a voice (uploaded to MinIO) for richer metadata and future cloning-style workflows.
- **Text-to-speech**: You submit text, a **voice id**, and an **output format** (`mp3` or `wav`). The **worker** API enforces validation, writes a `**VoiceJob`** row (initially `**pending**`), and **publishes** a **message** to RabbitMQ—classic **request acceptance** decoupled from **work execution**. A **consumer** in the worker process **dequeues** the message, transitions the job to `**processing`**, calls the **TTS microservice**, streams the result to **MinIO**, then marks the job `**completed`** (or `**failed**` with an error string). The UI **polls** job status and, when done, uses a **presigned GET** for playback or download.

So: **text in → queue → asynchronous synthesis → object storage**, with **Postgres as the source of truth** for job lifecycle and **RabbitMQ** buffering **backpressure** when synthesis slows down.

---

## Features

### Authentication and account

- **Register / login** with email and password (passwords are hashed; you never store plain text).
- **JWT access token** plus **refresh token** flow so the web app can silently renew sessions when access tokens expire.
- **Current user** endpoint so the UI can show who is logged in.
- **API keys**: create a named key, list keys, delete a key. Keys are hashed at rest; when you send `Authorization: Bearer xi_...`, the service resolves it to your user and updates `lastUsedAt` when possible.

### Voice library (public catalog)

- **List voices** with optional filters (search, language, gender, category) and pagination—this is the “browse voices like a store shelf” experience.
- **Get one voice** by ID for detail pages.
- Library entries are **public** voices (`isPublic: true`), including premade seed voices tied to Kokoro voice IDs in `metadata`.

### My voices (per user)

- **CRUD** on voices that belong to you: create, list, get by ID, update, delete.
- Voices carry **category** (premade / cloned / custom), **language**, **gender**, **accent**, optional **description**, and **metadata** JSON (for example which Kokoro voice slug to use).

### Voice samples

- **Upload** a sample file for a voice you own (`multipart/form-data`, field `file`).
- **List**, **get**, and **delete** samples. Files land in MinIO; metadata lives in Postgres.

### Text-to-speech jobs

- **Create job**: `voiceId`, `text` (up to 5000 characters in the worker validator), and `outputFormat` (`mp3` or `wav`). The voice must exist and be either **public** or **owned by you**. Creation is **non-blocking** for heavy work: you get a job id quickly while synthesis runs via the **message broker**.
- **List jobs** for the current user with pagination.
- **Get job by ID**: includes job status; when status is `completed`, the response can include **audio file metadata** and a **presigned download URL** for MinIO—**time-limited, unauthenticated access** to a private object without proxying bytes through your API.

### Web application

- **Dashboard** with quick links into the main areas.
- **Voice library** and **My voices** with creation flows and navigation to a **voice detail** route.
- **TTS studio**: pick a voice, type text, choose format, submit, watch status (`pending` → `processing` → `completed` / `failed`), preview audio, download, and a lightweight **history** sidebar for recent runs.
- **Dark / light theme**, **protected routes** (must be logged in for the app shell), and **axios interceptors** that try refresh on `401` before sending you back to login.

---

## How the pieces fit together

```mermaid
flowchart LR
  subgraph browser [Browser]
    Web[Next.js web app]
  end

  subgraph edge [Gateway]
    Traefik[Traefik :80]
  end

  subgraph node [Node services]
    Auth[auth :3001]
    Voice[voice :3002]
    Worker[worker :3003]
  end

  subgraph data [Data layer]
    PG[(PostgreSQL)]
    MinIO[(MinIO)]
    RMQ[(RabbitMQ)]
  end

  subgraph ai [TTS]
    TTS[FastAPI Kokoro :8000]
  end

  Web -->|"/api/..."| Traefik
  Traefik -->|strip /api| Auth
  Traefik --> Voice
  Traefik --> Worker
  Auth --> PG
  Voice --> PG
  Voice --> MinIO
  Worker --> PG
  Worker --> MinIO
  Worker --> RMQ
  Worker -->|HTTP synthesize| TTS
```

**Request path (example):** the browser calls `http://localhost/api/auth/login`. Traefik matches `PathPrefix(/api/auth)`, strips the `/api` prefix, and forwards to the auth service as `/auth/login`.

**TTS path (high level):** `POST /api/tts` hits the worker’s HTTP surface; the handler **persists** state and **enqueues** work. A **background consumer** on the same service **pulls** messages, performs **synthesis** and **upload**, then **commits** outcomes to Postgres. That is **asynchronous processing** with a **broker-backed work queue**—see the next section for vocabulary and semantics.

---

## Worker service and message queues - Problem being solved

Generating speech takes a while and eats CPU. Making every API request wait until Kokoro finishes would pile up work, slow everything down, and let one traffic spike take down the API. This platform avoids that: it saves the job in the database, pushes a small message onto RabbitMQ, and returns right away.

| Concept             | In this codebase                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Message broker**  | **RabbitMQ** (AMQP). Central exchange point between producers and consumers.                                                         |
| **Producer**        | The worker’s **TTS job creation** path: after inserting a `VoiceJob`, it **publishes** a JSON payload to the queue.                  |
| **Consumer**        | The same **worker process** registers an AMQP **consumer** that **prefetches** messages and runs `processTTSJob`.                    |
|                     |                                                                                                                                      |
| **Source of truth** | **PostgreSQL** holds `pending` → `processing` → `completed` / `failed`. The queue is **transient orchestration**, not the audit log. |

---

## Tech stack

| Layer                      | Technology                                                                                                                                                     |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monorepo / package manager | pnpm workspaces                                                                                                                                                |
| Frontend                   | Next.js 16, React 19, Tailwind CSS 4, TanStack Query, React Hook Form, Zod, Axios, Radix / shadcn-style UI, Framer Motion, wavesurfer.js                       |
| API services               | Express 5, Helmet, CORS, Zod validation (`@repo/common`)                                                                                                       |
| Database ORM               | Prisma 7 + PostgreSQL                                                                                                                                          |
| Auth                       | bcrypt, jsonwebtoken (access + refresh), API key hashing                                                                                                       |
| Object storage             | MinIO (S3-compatible), AWS SDK v3 + presigned GETs                                                                                                             |
| Queue / async              | **RabbitMQ** (AMQP via `amqplib`): **durable** queue `tts_jobs`, **persistent** publishes, `**prefetch(1)`** for consumer **QoS**, manual **ack** / **nack\*\* |
| TTS engine service         | Python 3, FastAPI, Kokoro (see `services/tts`)                                                                                                                 |
| Edge routing               | Traefik v3 (file provider + Docker)                                                                                                                            |
| Containers                 | Docker Compose for Postgres, Redis, RabbitMQ, MinIO, Traefik; **TTS** optional via Compose or run locally in `services/tts`                                    |

---

## Repository layout

| Path               | Role                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| `apps/web`         | Next.js frontend                                                                                    |
| `services/auth`    | Users, JWT, API keys                                                                                |
| `services/voice`   | Voices, library, samples, MinIO uploads                                                             |
| `services/worker`  | **TTS job API** (ingress), **AMQP consumer**, **orchestration** (Postgres + MinIO + HTTP to Kokoro) |
| `services/tts`     | FastAPI wrapper around Kokoro (`/v1/synthesize`, `/health`, …)                                      |
| `services/gateway` | Traefik static + dynamic config                                                                     |
| `packages/db`      | Prisma schema, migrations, seed, generated client                                                   |
| `packages/common`  | Shared Zod helpers, errors, logging utilities                                                       |

---

## API routes (backend)

All of these are exposed **through Traefik** under the `**/api` prefix**. The gateway **strips `/api`** before forwarding, so **inside each Express app\*\* the paths start at the segments below.

**Base URL for the SPA:** set `NEXT_PUBLIC_API_URL` to your gateway root including `/api`, e.g. `http://localhost/api`. The axios client then calls paths like `auth/login` and the final URL becomes `http://localhost/api/auth/login`.

### Auth service (`services/auth`) — mounted at `/auth` and `/api-keys` after strip

| Method | Path (after `/api` prefix) | Auth                        | What it does          |
| ------ | -------------------------- | --------------------------- | --------------------- |
| POST   | `/api/auth/register`       | No                          | Create account        |
| POST   | `/api/auth/login`          | No                          | Login; returns tokens |
| POST   | `/api/auth/refresh-token`  | No                          | Refresh access token  |
| GET    | `/api/auth/me`             | Bearer JWT or `xi_` API key | Current user profile  |
| POST   | `/api/api-keys/`           | Bearer                      | Create API key        |
| GET    | `/api/api-keys/`           | Bearer                      | List your API keys    |
| DELETE | `/api/api-keys/delete/:id` | Bearer                      | Delete an API key     |

### Voice service (`services/voice`)

**User voices** — prefix `/api/voices`, all routes require Bearer auth:

| Method | Path              | What it does      |
| ------ | ----------------- | ----------------- |
| POST   | `/api/voices`     | Create a voice    |
| GET    | `/api/voices`     | List your voices  |
| GET    | `/api/voices/:id` | Get your voice    |
| PUT    | `/api/voices/:id` | Update your voice |
| DELETE | `/api/voices/:id` | Delete your voice |

**Samples** — same `/api/voices` prefix, Bearer auth:

| Method | Path                                     | What it does                              |
| ------ | ---------------------------------------- | ----------------------------------------- |
| POST   | `/api/voices/:voiceId/samples`           | Upload sample (`multipart`, field `file`) |
| GET    | `/api/voices/:voiceId/samples`           | List samples                              |
| GET    | `/api/voices/:voiceId/samples/:sampleId` | Get one sample                            |
| DELETE | `/api/voices/:voiceId/samples/:sampleId` | Delete sample                             |

**Public library** — prefix `/api/library`, **no auth** in the route definitions (catalog is open):

| Method | Path               | What it does                                    |
| ------ | ------------------ | ----------------------------------------------- |
| GET    | `/api/library`     | List public voices (query filters + pagination) |
| GET    | `/api/library/:id` | Public voice detail                             |

### Worker service (`services/worker`) — TTS jobs at `/api/tts`

All require Bearer auth:

| Method | Path           | What it does                                             |
| ------ | -------------- | -------------------------------------------------------- |
| POST   | `/api/tts`     | Create TTS job (body: `voiceId`, `text`, `outputFormat`) |
| GET    | `/api/tts`     | List your jobs (paginated query)                         |
| GET    | `/api/tts/:id` | Job detail; presigned URL when completed                 |

### Authorization header

Send:

```http
Authorization: Bearer <access_jwt>
```

or:

```http
Authorization: Bearer xi_<your_api_key>
```

---

## Frontend routes (Next.js)

These are **browser URLs** (default dev server `http://localhost:3000`).

| Route                 | Purpose                                |
| --------------------- | -------------------------------------- |
| `/`                   | landing page                           |
| `/login`, `/register` | Auth screens                           |
| `/dashboard`          | Overview and quick actions (protected) |
| `/voices/library`     | Browse public voices (protected)       |
| `/voices`             | My voices list + create (protected)    |
| `/voices/[voiceId]`   | Voice detail (protected)               |
| `/tts`                | Text-to-speech studio (protected)      |

---

## Prerequisites

- **Node.js** (LTS recommended) and **pnpm** (`packageManager` in root `package.json` pins a version—use compatible pnpm).
- **Docker** and Docker Compose (for Postgres, Redis, RabbitMQ, MinIO, Traefik). The `**pnpm infra`** script does **not** start the TTS container—you run synthesis on **port 8000\*\* separately ([Python](#6-start-the-tts-engine-python-on-your-machine) or `docker compose up -d tts`).
- **Python 3.11+** (recommended) if you run the TTS service on the host instead of in Docker.
- A shell that can run the root scripts (`pnpm infra`, `pnpm dev:`\*, etc.).

---

## Getting started

### 1. Clone and install

```bash
git clone <your-fork-or-repo-url>
cd text-voice-ai-platform
pnpm install
```

### 2. Build shared packages

The services import compiled `@repo/common` and `@repo/db` from `dist`. After install:

```bash
pnpm --filter @repo/common build
pnpm db:generate
pnpm --filter @repo/db build
```

(`pnpm db:generate` runs Prisma codegen; `build` on `@repo/db` compiles the package and copies generated artifacts as configured.)

### 3. Environment file

Copy the sample and fill in real secrets:

```bash
cp .env.sample .env
```

See [Environment variables](#environment-variables) for what each field means. **JWT secrets must be at least 32 characters** where enforced by the Zod schemas.

### 4. Start infrastructure

From the repo root:

```bash
pnpm infra
```

This starts **Postgres, Redis, RabbitMQ, MinIO** (plus a one-shot bucket setup) and **Traefik**. It does **not** start the TTS container—the worker expects a FastAPI process on `**http://localhost:8000`\*\* unless you point `TTS_SERVICE_URL` elsewhere.

### 5. Database migrate and seed

```bash
pnpm db:migrate:dev
pnpm db:seed
```

Seed creates premade voices (Heart, Bella, Adam, Alice, George) with Kokoro slugs in `metadata`.

### 6. Start the TTS engine (Python on your machine)

The worker calls `TTS_SERVICE_URL` (default `http://localhost:8000`). Run FastAPI + Kokoro from `**services/tts**`:

**One-time setup**

```bash
cd services/tts
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

**System libraries** (same idea as `services/tts/Dockerfile`): `espeak-ng`, `ffmpeg`, `libsndfile`. On **macOS** with Homebrew:

```bash
brew install espeak ffmpeg libsndfile
```

On **Linux**, install your distro’s equivalents (e.g. Debian/Ubuntu: `espeak-ng`, `ffmpeg`, `libsndfile1`).

**Every time you develop**

```bash
cd services/tts
source .venv/bin/activate
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

On **Windows** (PowerShell): `.\.venv\Scripts\Activate.ps1` instead of `source .venv/bin/activate`.

Leave this terminal open. The first run may download model weights—give it time.

**Docker alternative** (no local venv):

```bash
docker compose up -d tts
```

Do **not** run both the `tts` container and local `uvicorn` on **8000** at once.

### 7. Start the Node services and web app

You need **four terminals** (or a process manager), all from the repo root:

```bash
pnpm dev:auth
```

```bash
pnpm dev:voice
```

```bash
pnpm dev:worker
```

```bash
pnpm dev:web
```

Traefik’s `dynamic.yml` forwards to `host.docker.internal:3001–3003`, so the Express apps must be listening on those ports on the host.

### 8. Use the app

- Open `**http://localhost:3000**` for the Next.js UI.
- API traffic from the browser should go to `**NEXT_PUBLIC_API_URL**` (for example `http://localhost/api` if Traefik listens on port 80).

---

## Environment variables

The sample file is `.env.sample`. Copy it to **repo-root `.env`** and replace placeholders. Services load `**../../.env**` from their folders; Prisma uses the root `.env` too.

### Example `.env` (local dev, matches default `docker-compose.yml` credentials)

Adjust JWT secrets to long random strings (32+ chars where required). This is a **starting point**, not production-ready secrets:

```bash
DATABASE_URL="postgresql://text-voice-ai-platform:text-voice-ai-platform_dev@localhost:5432/text-voice-ai-platform"

JWT_SECRET="replace-with-a-long-random-string-at-least-32-chars"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_SECRET="replace-with-another-long-random-string-32-chars-min"
JWT_REFRESH_EXPIRES_IN="30d"

AUTH_SERVICE_PORT=3001
VOICE_SERVICE_PORT=3002
WORKER_SERVICE_PORT=3003

FRONTEND_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost/api"

RABBITMQ_URL="amqp://text-voice-ai-platform:text-voice-ai-platform_dev@localhost:5672"

MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="text-voice-ai-platform"
MINIO_SECRET_KEY="text-voice-ai-platform_dev_secret"
MINIO_BUCKET="text-voice-ai-platform-audio"
MINIO_USE_SSL="false"

TTS_SERVICE_URL="http://localhost:8000"
TTS_REQUEST_TIMEOUT_MS=120000
TTS_REQUEST_RETRIES=2
```

| Variable                 | Who needs it                          | Meaning                                                                                                         |
| ------------------------ | ------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`           | Prisma, all services using `@repo/db` | PostgreSQL connection string                                                                                    |
| `JWT_SECRET`             | auth, voice, worker                   | Sign access tokens (min 32 chars in auth schema)                                                                |
| `JWT_EXPIRES_IN`         | auth, voice, worker                   | Access token lifetime string (e.g. `1d`)                                                                        |
| `JWT_REFRESH_SECRET`     | auth                                  | Sign refresh tokens                                                                                             |
| `JWT_REFRESH_EXPIRES_IN` | auth                                  | Refresh token lifetime                                                                                          |
| `AUTH_SERVICE_PORT`      | auth                                  | Default `3001`                                                                                                  |
| `VOICE_SERVICE_PORT`     | voice                                 | Intended `3002` (align with Traefik)                                                                            |
| `WORKER_SERVICE_PORT`    | worker                                | Intended `3003`                                                                                                 |
| `FRONTEND_URL`           | auth, voice, worker                   | Exact origin for CORS (e.g. `http://localhost:3000`)                                                            |
| `NEXT_PUBLIC_API_URL`    | web (build/runtime)                   | Axios base URL, e.g. `http://localhost/api`                                                                     |
| `RABBITMQ_URL`           | worker                                | AMQP URL, e.g. `amqp://text-voice-ai-platform:text-voice-ai-platform_dev@localhost:5672` using Compose defaults |
| `MINIO_*`                | voice, worker                         | Endpoint, port, keys, bucket, SSL flag for S3 SDK                                                               |
| `TTS_SERVICE_URL`        | worker                                | Base URL for FastAPI TTS (e.g. `http://localhost:8000` from host)                                               |
| `TTS_REQUEST_TIMEOUT_MS` | worker                                | HTTP timeout for synthesis                                                                                      |
| `TTS_REQUEST_RETRIES`    | worker                                | Retry count for TTS calls                                                                                       |
| `TTS_SERVICE_PORT`       | documentation / compose               | Container exposes `8000`                                                                                        |

Compose also uses `POSTGRES_*`, `RABBITMQ_USER`, `RABBITMQ_PASSWORD`, etc.—see `docker-compose.yml` for defaults.

---

## Running services

| Command                        | Purpose                                                                                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm infra`                   | Docker Compose up: Postgres, Redis, RabbitMQ, MinIO, Traefik (not TTS—use [§6](#6-start-the-tts-engine-python-on-your-machine) or `docker compose up -d tts`) |
| `pnpm infra:down`              | Tear down Compose stack                                                                                                                                       |
| `pnpm infra:logs`              | Follow Compose logs                                                                                                                                           |
| `pnpm db:migrate:dev`          | Create/apply migrations in dev                                                                                                                                |
| `pnpm db:migrate:deploy`       | Apply migrations (production style)                                                                                                                           |
| `pnpm db:seed`                 | Seed premade voices                                                                                                                                           |
| `pnpm db:studio`               | Prisma Studio                                                                                                                                                 |
| `pnpm dev:auth`                | Auth service                                                                                                                                                  |
| `pnpm dev:voice`               | Voice service                                                                                                                                                 |
| `pnpm dev:worker`              | Worker API + queue consumer                                                                                                                                   |
| `pnpm dev:web`                 | Next.js on port 3000                                                                                                                                          |
| `docker compose up -d tts`     | Run TTS in Docker on `:8000` (skip if using local `uvicorn`)                                                                                                  |
| `pnpm lint` / `pnpm typecheck` | Monorepo checks                                                                                                                                               |

---

## Infrastructure ports

| Port        | Service                               |
| ----------- | ------------------------------------- |
| 80          | Traefik HTTP entry (`web`)            |
| 8080        | Traefik dashboard (per `traefik.yml`) |
| 3000        | Next.js dev                           |
| 3001–3003   | Auth, Voice, Worker (host)            |
| 5432        | PostgreSQL                            |
| 5672        | RabbitMQ AMQP                         |
| 15672       | RabbitMQ management UI                |
|             |                                       |
| 9000 / 9001 | MinIO API / console                   |
| 8000        | TTS FastAPI                           |

---

## TTS Service

The HTTP API is at `**http://localhost:8000**` when you run `**uvicorn**` locally ([6](#6-start-the-tts-engine-python-on-your-machine)) or `**docker compose up -d tts**`.

The **worker** reads `**TTS_SERVICE_URL`** from the **repo root\*\* `.env` (not from `services/tts/`).

### Local Python quick reference

```bash
cd services/tts
source .venv/bin/activate
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

### HTTP endpoints (debugging)

- `GET /health` — liveness
- `GET /v1/voices` — list Kokoro voices
- `POST /v1/synthesize` — JSON body: `text`, `voice_id`, `language`, `output_format` (`wav`|`mp3`), `speed`; returns raw audio bytes

The worker maps each **platform voice** row to a Kokoro id from `metadata.kokoroVoice`, defaulting to `af_heart` if missing.

---

_Happy shipping—may your queues stay short and your waveforms smooth._
