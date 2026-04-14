import { createHash, randomBytes } from "node:crypto";

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateApiKey(): { key: string; prefix: string } {
  const raw = randomBytes(16).toString("hex"); // 32 hex chars
  const key = `xi_${raw}`;
  const prefix = key.slice(0, 7); // "xi_xxxx"
  return { key, prefix };
}
