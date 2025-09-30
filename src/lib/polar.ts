/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// src/polar.ts
import { Polar } from '@polar-sh/sdk'

export const api = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: (process.env.POLAR_SERVER as 'sandbox' | 'production') ?? 'sandbox', // Use this option if you're using the sandbox environment - else use 'production' or omit the parameter
})
