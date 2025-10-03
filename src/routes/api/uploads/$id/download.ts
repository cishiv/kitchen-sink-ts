import { createFileRoute } from '@tanstack/react-router'
import { and, eq } from 'drizzle-orm'
import type { AuthContext } from '@/middleware/auth-middleware'
import { authMiddleware } from '@/middleware/auth-middleware'
import { db } from '@/lib/db'
import { uploads } from '@/lib/db/schema'
import { generatePresignedDownloadUrl } from '@/lib/r2'

export const Route = createFileRoute('/api/uploads/$id/download')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      GET: async ({
        context,
        params,
      }: {
        context: AuthContext
        params: { id: string }
      }) => {
        try {
          const uploadId: number = parseInt(params.id, 10)

          if (isNaN(uploadId)) {
            return new Response(
              JSON.stringify({ error: 'Invalid upload ID' }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )
          }

          // Fetch upload and verify ownership
          const [upload] = await db
            .select()
            .from(uploads)
            .where(
              and(
                eq(uploads.id, uploadId),
                eq(uploads.userId, context.user.id),
              ),
            )

          if (!upload) {
            return new Response(JSON.stringify({ error: 'Upload not found' }), {
              status: 404,
              headers: {
                'Content-Type': 'application/json',
              },
            })
          }

          // Generate presigned download URL (expires in 1 hour)
          const presignedUrl: string = await generatePresignedDownloadUrl({
            fileKey: upload.fileKey,
            fileName: upload.fileName,
            expiresIn: 3600,
            inline: false, // Force download
          })

          return new Response(
            JSON.stringify({
              presignedUrl,
              fileName: upload.fileName,
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
        } catch (error) {
          console.error('Error generating download URL:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to generate download URL' }),
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
