import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@/lib/auth'

export const Route = createFileRoute('/api/user')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          // Validate session
          const session = await auth.api.getSession({
            headers: request.headers,
          })

          if (!session) {
            return new Response('Unauthorized', {
              status: 401,
              statusText: 'Unauthorized',
            })
          }

          return new Response(
            JSON.stringify({
              email: session.user.email,
              name: session.user.name,
              id: session.user.id,
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
