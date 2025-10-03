/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { createFileRoute } from '@tanstack/react-router'
import { and, eq } from 'drizzle-orm'
import type { AuthContext } from '@/middleware/auth-middleware'
import { authMiddleware } from '@/middleware/auth-middleware'
import { db } from '@/lib/db'
import { uploads } from '@/lib/db/schema'
import { deleteObject } from '@/lib/r2'

export const Route = createFileRoute('/api/uploads/$id/')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      DELETE: async ({
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

          // Delete from R2
          await deleteObject({ fileKey: upload.fileKey })

          // Delete from database
          await db.delete(uploads).where(eq(uploads.id, uploadId))

          return new Response(
            JSON.stringify({ message: 'Upload deleted successfully' }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
        } catch (error) {
          console.error('Error deleting upload:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to delete upload' }),
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
