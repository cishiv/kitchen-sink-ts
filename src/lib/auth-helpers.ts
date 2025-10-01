import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import type { Session, User } from 'better-auth/types'
import { auth } from '@/lib/auth'

export type AuthSession = {
  session: Session
  user: User
}

/**
 * Server function to get the current authenticated user
 * Returns the session and user if authenticated, null otherwise
 */
export const getServerAuthUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AuthSession | null> => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    })

    if (!session) {
      return null
    }

    return {
      session: session.session,
      user: session.user,
    }
  },
)

/**
 * Server function to validate authentication and throw redirect if not authenticated
 * Useful for protected routes
 */
export const requireAuth = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AuthSession> => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    return {
      session: session.session,
      user: session.user,
    }
  },
)
