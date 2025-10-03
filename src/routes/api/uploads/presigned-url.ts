import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import type { AuthContext } from '@/middleware/auth-middleware'
import { authMiddleware } from '@/middleware/auth-middleware'
import { generatePresignedUploadUrl } from '@/lib/r2'

const requestSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().min(0, 'File size must be non-negative'),
  mimeType: z.string().min(1, 'MIME type is required'),
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
            return new Response(JSON.stringify({ error: error.errors }), {
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
