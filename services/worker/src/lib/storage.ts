import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/config/env";

const s3 = new S3Client({
  endpoint: `http${env.MINIO_USE_SSL ? "s" : ""}://${env.MINIO_ENDPOINT}:${env.MINIO_PORT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: env.MINIO_ACCESS_KEY!,
    secretAccessKey: env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

const BUCKET = env.MINIO_BUCKET;

export async function uploadFile(key: string, body: Buffer, contentType: string) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

export async function getPresignedUrl(key: string, expiresIn = 3600) {
  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
    { expiresIn },
  );
}
