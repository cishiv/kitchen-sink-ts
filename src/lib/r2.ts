import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

type R2Config = {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
}

const requireEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) throw new Error(`${key} is not set`)
  return value
}

const getR2Config = (): R2Config => ({
  accountId: requireEnv('R2_ACCOUNT_ID'),
  accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
  secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
  bucketName: requireEnv('R2_BUCKET_NAME'),
})

let cachedClient: S3Client | null = null
let cachedBucketName: string | null = null

const getR2Client = (): { client: S3Client; bucketName: string } => {
  if (cachedClient && cachedBucketName) {
    return { client: cachedClient, bucketName: cachedBucketName }
  }
  const config = getR2Config()
  cachedClient = new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })
  cachedBucketName = config.bucketName
  return { client: cachedClient, bucketName: cachedBucketName }
}

export type GeneratePresignedUploadUrlParams = {
  fileKey: string
  contentType: string
  expiresIn?: number
}

export const generatePresignedUploadUrl = async (
  params: GeneratePresignedUploadUrlParams,
): Promise<string> => {
  const { fileKey, contentType, expiresIn = 900 } = params
  const { client, bucketName } = getR2Client()

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    ContentType: contentType,
  })

  return getSignedUrl(client, command, { expiresIn })
}

export type GeneratePresignedDownloadUrlParams = {
  fileKey: string
  fileName?: string
  expiresIn?: number
  inline?: boolean
}

export const generatePresignedDownloadUrl = async (
  params: GeneratePresignedDownloadUrlParams,
): Promise<string> => {
  const { fileKey, fileName, expiresIn = 3600, inline = false } = params
  const { client, bucketName } = getR2Client()

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    ResponseContentDisposition: fileName
      ? inline
        ? `inline; filename="${fileName}"`
        : `attachment; filename="${fileName}"`
      : undefined,
  })

  return getSignedUrl(client, command, { expiresIn })
}

export type DeleteObjectParams = {
  fileKey: string
}

export const deleteObject = async (
  params: DeleteObjectParams,
): Promise<void> => {
  const { fileKey } = params
  const { client, bucketName } = getR2Client()

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  })

  await client.send(command)
}
