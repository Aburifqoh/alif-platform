import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

// Public access URL for files (e.g. https://pub-xxxxxxxxxx.r2.dev)
const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL!;

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function uploadToR2(file: Buffer, filename: string, contentType: string, isPublic: boolean = true) {
  // Public files go into 'public/' prefix, private into 'private/' prefix
  const prefix = isPublic ? 'public/' : 'private/';
  const key = `${prefix}${filename}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await r2.send(command);

  // Return the public URL if it's a public file, otherwise just the key
  if (isPublic && publicUrl) {
    return { url: `${publicUrl}/${key}`, key };
  }
  
  return { key };
}

export async function getPresignedDownloadUrl(key: string, expiresIn: number = 3600) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  
  return await getSignedUrl(r2, command, { expiresIn });
}

export async function deleteFromR2(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  
  await r2.send(command);
}
