-- CreateTable
CREATE TABLE "audio_files" (
    "id" TEXT NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "duration_ms" INTEGER,
    "storage_path" VARCHAR(1024) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "job_id" TEXT NOT NULL,

    CONSTRAINT "audio_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "audio_files" ADD CONSTRAINT "audio_files_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "tts_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
