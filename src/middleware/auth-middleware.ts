import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
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
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
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
})
