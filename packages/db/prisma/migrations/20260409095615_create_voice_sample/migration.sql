-- CreateTable
CREATE TABLE "voice_samples" (
    "id" TEXT NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "duration_ms" INTEGER,
    "storage_path" VARCHAR(1024) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "voice_id" TEXT NOT NULL,

    CONSTRAINT "voice_samples_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "voice_samples" ADD CONSTRAINT "voice_samples_voice_id_fkey" FOREIGN KEY ("voice_id") REFERENCES "voices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
