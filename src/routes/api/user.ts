import { createFileRoute } from '@tanstack/react-router'
import type { AuthContext } from '@/middleware/auth-middleware'
import { authMiddleware } from '@/middleware/auth-middleware'

export const Route = createFileRoute('/api/user')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      GET: ({ context }: { context: AuthContext }) => {
        try {
          const { user } = context

          return new Response(
            JSON.stringify({
              email: user.email,
              name: user.name,
              id: user.id,
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
        } catch (error) {
          return new Response('Internal Server Error', {
            status: 500,
          })
        }
      },
    },
  },
})
