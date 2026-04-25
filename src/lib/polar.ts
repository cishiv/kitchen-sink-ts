import { Polar } from '@polar-sh/sdk'

let cached: Polar | null = null

const requireEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) throw new Error(`${key} is not set`)
  return value
}

const getPolar = (): Polar => {
  if (cached) return cached
  const server = process.env.POLAR_SERVER as 'sandbox' | 'production' | undefined
  cached = new Polar({
    accessToken: requireEnv('POLAR_ACCESS_TOKEN'),
    server: server ?? 'sandbox',
  })
  return cached
}

export const api = new Proxy({} as Polar, {
  get: (_, prop, receiver) => Reflect.get(getPolar(), prop, receiver),
})
