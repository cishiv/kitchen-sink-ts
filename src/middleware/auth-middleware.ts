import { createMiddleware } from '@tanstack/react-start'
import type { Session, User } from 'better-auth/types'
import { auth } from '@/lib/auth'

export type AuthContext = {
  user: User
  session: Session
}

/**
 * Middleware to protect API routes and server functions
 * Validates the session and adds user context
 */
export const authMiddleware = createMiddleware().server(
  async ({ next, context, request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      throw new Response('Unauthorized', {
        status: 401,
        statusText: 'Unauthorized',
      })
    }

    return next({
      context: {
        user: session.user,
        session: session.session,
      },
    })
  },
)
