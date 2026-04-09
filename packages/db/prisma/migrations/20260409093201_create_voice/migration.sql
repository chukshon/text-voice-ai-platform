-- CreateEnum
CREATE TYPE "voice_category" AS ENUM ('premade', 'cloned', 'custom');

-- CreateEnum
CREATE TYPE "voice_gender" AS ENUM ('male', 'female', 'neutral');

-- CreateTable
CREATE TABLE "voices" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" "voice_category" NOT NULL DEFAULT 'premade',
    "language" VARCHAR(10) NOT NULL DEFAULT 'en',
    "gender" "voice_gender" NOT NULL DEFAULT 'neutral',
    "accent" VARCHAR(100),
    "preview_url" VARCHAR(1024),
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,

    CONSTRAINT "voices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "voices" ADD CONSTRAINT "voices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
