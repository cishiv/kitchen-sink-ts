import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import type { AuthContext } from '@/middleware/auth-middleware'
import { authMiddleware } from '@/middleware/auth-middleware'
import { complete } from '@/lib/openrouter'

const requestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  model: z.string().optional(),
})

export const Route = createFileRoute('/api/ai/complete')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({ request }: { context: AuthContext; request: Request }) => {
        try {
          const body = await request.json()
          const { prompt, model } = requestSchema.parse(body)

          const { text } = await complete({ prompt, model })

          return new Response(JSON.stringify({ text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          if (error instanceof z.ZodError) {
            return new Response(JSON.stringify({ error: error.issues }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          console.error('Error in /api/ai/complete:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to complete request' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }
      },
    },
  },
})
