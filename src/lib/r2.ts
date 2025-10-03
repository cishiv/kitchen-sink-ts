import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Environment variables validation
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME

if (!R2_ACCOUNT_ID) {
  throw new Error('R2_ACCOUNT_ID is not set')
}

if (!R2_ACCESS_KEY_ID) {
  throw new Error('R2_ACCESS_KEY_ID is not set')
}

if (!R2_SECRET_ACCESS_KEY) {
  throw new Error('R2_SECRET_ACCESS_KEY is not set')
}

if (!R2_BUCKET_NAME) {
  throw new Error('R2_BUCKET_NAME is not set')
}

// Create R2 S3 client
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

export type GeneratePresignedUploadUrlParams = {
  fileKey: string
  contentType: string
  expiresIn?: number // in seconds, default 15 minutes
}

export async function generatePresignedUploadUrl(
  params: GeneratePresignedUploadUrlParams,
): Promise<string> {
  const { fileKey, contentType, expiresIn = 900 } = params

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileKey,
    ContentType: contentType,
  })

  const presignedUrl: string = await getSignedUrl(r2Client, command, {
    expiresIn,
  })

  return presignedUrl
}

export type GeneratePresignedDownloadUrlParams = {
  fileKey: string
  fileName?: string // Optional: filename for download
  expiresIn?: number // in seconds, default 1 hour
  inline?: boolean // Optional: if true, display inline instead of download
}

export async function generatePresignedDownloadUrl(
  params: GeneratePresignedDownloadUrlParams,
): Promise<string> {
  const { fileKey, fileName, expiresIn = 3600, inline = false } = params

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileKey,
    ResponseContentDisposition: fileName
      ? inline
        ? `inline; filename="${fileName}"`
        : `attachment; filename="${fileName}"`
      : undefined,
  })

  const presignedUrl: string = await getSignedUrl(r2Client, command, {
    expiresIn,
  })

  return presignedUrl
}

export type DeleteObjectParams = {
  fileKey: string
}

export async function deleteObject(params: DeleteObjectParams): Promise<void> {
  const { fileKey } = params

  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileKey,
  })

  await r2Client.send(command)
}
