import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/lib/db'
import { accounts, sessions, users, verifications } from '@/lib/db/schema'

const createAuth = () =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      usePlural: true,
      schema: {
        verifications,
        users,
        sessions,
        accounts,
      },
    }),
    emailAndPassword: {
      enabled: true,
    },
  })

type Auth = ReturnType<typeof createAuth>

let cached: Auth | null = null

const getAuth = (): Auth => {
  if (cached) return cached
  cached = createAuth()
  return cached
}

export const auth = new Proxy({} as Auth, {
  get: (_, prop, receiver) => Reflect.get(getAuth(), prop, receiver),
})
