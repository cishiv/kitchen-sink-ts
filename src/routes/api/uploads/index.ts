import { createFileRoute } from '@tanstack/react-router'
import { desc, eq } from 'drizzle-orm'
import type { AuthContext } from '@/middleware/auth-middleware'
import { authMiddleware } from '@/middleware/auth-middleware'
import { db } from '@/lib/db'
import { uploads } from '@/lib/db/schema'

export const Route = createFileRoute('/api/uploads/')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      GET: async ({ context }: { context: AuthContext }) => {
        try {
          // Fetch all uploads for the authenticated user, newest first
          const userUploads = await db
            .select()
            .from(uploads)
            .where(eq(uploads.userId, context.user.id))
            .orderBy(desc(uploads.createdAt))

          return new Response(JSON.stringify(userUploads), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          })
        } catch (error) {
          console.error('Error fetching uploads:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to fetch uploads' }),
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
