import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import type { AuthContext } from '@/middleware/auth-middleware'
import { authMiddleware } from '@/middleware/auth-middleware'
import { db } from '@/lib/db'
import { insertUploadSchema, uploads } from '@/lib/db/schema'

const requestSchema = z.object({
  fileKey: z.string().min(1, 'File key is required'),
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().min(0, 'File size must be non-negative'),
  mimeType: z.string().min(1, 'MIME type is required'),
})

export const Route = createFileRoute('/api/uploads/complete')({
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
          const { fileKey, fileName, fileSize, mimeType } =
            requestSchema.parse(body)

          // Validate with insert schema
          const uploadData = insertUploadSchema.parse({
            userId: context.user.id,
            fileKey,
            fileName,
            fileSize,
            mimeType,
          })

          // Insert upload record
          const [upload] = await db
            .insert(uploads)
            .values(uploadData)
            .returning()

          return new Response(JSON.stringify(upload), {
            status: 201,
            headers: {
              'Content-Type': 'application/json',
            },
          })
        } catch (error) {
          if (error instanceof z.ZodError) {
            return new Response(JSON.stringify({ error: error.errors }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
              },
            })
          }

          console.error('Error completing upload:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to complete upload' }),
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
