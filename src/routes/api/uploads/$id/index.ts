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

          // Store fileKey for R2 deletion
          const fileKey: string = upload.fileKey

          // Delete from database first (source of truth)
          await db.delete(uploads).where(eq(uploads.id, uploadId))

          // Then delete from R2 (best effort - log if it fails)
          try {
            await deleteObject({ fileKey })
          } catch (r2Error) {
            console.error(
              `Failed to delete R2 object ${fileKey} for upload ${uploadId}:`,
              r2Error,
            )
            // DB record is already deleted, so return success but log the R2 failure
            // Orphaned R2 files can be cleaned up with a maintenance script
          }

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
