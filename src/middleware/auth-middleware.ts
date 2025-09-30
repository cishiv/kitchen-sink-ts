import { createMiddleware } from '@tanstack/start'
import { auth } from '@/lib/auth'
import { type Session, type User } from 'better-auth/types'

export type AuthContext = {
  user: User
  session: Session
}

/**
 * Middleware to protect API routes and server functions
 * Validates the session and adds user context
 */
export const authMiddleware = createMiddleware().server(
  async ({ next, data }): Promise<AuthContext> => {
    const session = await auth.api.getSession({
      headers: data.request.headers,
    })

    if (!session || !session.user) {
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