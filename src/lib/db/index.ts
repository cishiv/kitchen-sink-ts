import { drizzle } from 'drizzle-orm/node-postgres'

type DBClient = ReturnType<typeof drizzle>

let cached: DBClient | null = null

const getDb = (): DBClient => {
  if (cached) return cached
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  cached = drizzle(url)
  return cached
}

export const db = new Proxy({} as DBClient, {
  get: (_, prop, receiver) => Reflect.get(getDb(), prop, receiver),
})
