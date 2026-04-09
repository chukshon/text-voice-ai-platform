/*
  Warnings:

  - You are about to drop the `tts_jobs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "audio_files" DROP CONSTRAINT "audio_files_job_id_fkey";

-- DropForeignKey
ALTER TABLE "tts_jobs" DROP CONSTRAINT "tts_jobs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tts_jobs" DROP CONSTRAINT "tts_jobs_voice_id_fkey";

-- AlterTable
ALTER TABLE "voices" ALTER COLUMN "updated_at" DROP DEFAULT;

-- DropTable
DROP TABLE "tts_jobs";

-- CreateTable
CREATE TABLE "voice_jobs" (
    "id" TEXT NOT NULL,
    "type" "job_type" NOT NULL DEFAULT 'tts',
    "status" "job_status" NOT NULL DEFAULT 'pending',
    "input_text" TEXT,
    "output_file_id" TEXT,
    "error" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "user_id" TEXT NOT NULL,
    "voice_id" TEXT NOT NULL,

    CONSTRAINT "voice_jobs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "voice_jobs" ADD CONSTRAINT "voice_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_jobs" ADD CONSTRAINT "voice_jobs_voice_id_fkey" FOREIGN KEY ("voice_id") REFERENCES "voices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audio_files" ADD CONSTRAINT "audio_files_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "voice_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
