import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import type { AuthContext } from '@/middleware/auth-middleware'
import { authMiddleware } from '@/middleware/auth-middleware'
import { generatePresignedUploadUrl } from '@/lib/r2'

// File upload constraints
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Documents
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/json',
  // Office documents
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  // Archives
  'application/zip',
  'application/x-zip-compressed',
]

const requestSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z
    .number()
    .min(1, 'File size must be greater than 0')
    .max(
      MAX_FILE_SIZE,
      `File size must not exceed ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    ),
  mimeType: z
    .string()
    .min(1, 'MIME type is required')
    .refine(
      (mime) => ALLOWED_MIME_TYPES.includes(mime),
      (mime) => ({ message: `MIME type '${mime}' is not allowed` }),
    ),
})

export const Route = createFileRoute('/api/uploads/presigned-url')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({
        context,
        request,
      }: {
        context: AuthContext
        request: Request
      }) => {
        try {
          const body = await request.json()
          const { fileName, fileSize, mimeType } = requestSchema.parse(body)

          // Generate unique file key using user ID and timestamp
          const fileKey = `${context.user.id}/${Date.now()}-${fileName}`

          // Generate presigned upload URL (expires in 15 minutes)
          const presignedUrl: string = await generatePresignedUploadUrl({
            fileKey,
            contentType: mimeType,
            expiresIn: 900,
          })

          return new Response(
            JSON.stringify({
              presignedUrl,
              fileKey,
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
        } catch (error) {
          if (error instanceof z.ZodError) {
            return new Response(JSON.stringify({ error: error.issues }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
              },
            })
          }

          console.error('Error generating presigned URL:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to generate presigned URL' }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
        }
      },
    },
  },
})
