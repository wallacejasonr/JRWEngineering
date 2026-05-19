import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
  // Browsers can't compute and send a checksum the SDK signed into the
  // presigned URL, so disable auto-checksums for browser PUT uploads.
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export const S3_BUCKET = process.env.AWS_S3_BUCKET ?? "";

export function isS3Configured(): boolean {
  return Boolean(
    S3_BUCKET &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY
  );
}

export async function presignUpload(
  key: string,
  contentType: string,
  expiresInSeconds = 300
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

export async function presignDownload(
  key: string,
  filename?: string,
  expiresInSeconds = 300
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ...(filename
      ? {
          ResponseContentDisposition: `attachment; filename="${filename.replace(/"/g, "")}"`,
        }
      : {}),
  });
  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

export async function deleteObject(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key })
  );
}

export function buildFileKey(projectId: string, filename: string): string {
  const ts = Date.now();
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `projects/${projectId}/${ts}-${safe}`;
}
