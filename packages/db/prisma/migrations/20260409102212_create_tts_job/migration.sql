-- CreateEnum
CREATE TYPE "job_status" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "job_type" AS ENUM ('tts', 'clone');

-- CreateTable
CREATE TABLE "tts_jobs" (
    "id" TEXT NOT NULL,
    "type" "job_type" NOT NULL DEFAULT 'tts',
    "status" "job_status" NOT NULL DEFAULT 'pending',
    "input_text" TEXT,
    "output_file_id" TEXT,
    "error" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "voice_id" TEXT NOT NULL,

    CONSTRAINT "tts_jobs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tts_jobs" ADD CONSTRAINT "tts_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tts_jobs" ADD CONSTRAINT "tts_jobs_voice_id_fkey" FOREIGN KEY ("voice_id") REFERENCES "voices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
