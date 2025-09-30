/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// routes/api/checkout.ts
import { Checkout } from '@polar-sh/tanstack-start'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/billing/checkout')({
  server: {
    handlers: {
      GET: Checkout({
        accessToken: process.env.POLAR_ACCESS_TOKEN,
        successUrl: process.env.POLAR_SUCCESS_URL,
        server:
          (process.env.POLAR_MODE as 'sandbox' | 'production') || 'sandbox', // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
        theme: (process.env.POLAR_THEME as 'dark' | 'light') || 'dark', // Enforces the theme - System-preferred theme will be set if left omitted
      }),
    },
  },
})
