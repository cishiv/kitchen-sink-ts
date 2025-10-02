/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { createFileRoute } from '@tanstack/react-router'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import type { AuthContext } from '@/middleware/auth-middleware'
import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'
import { authMiddleware } from '@/middleware/auth-middleware'
import { api } from '@/lib/polar'

const updateSubscriptionSchema = z.object({
  cancelAtPeriodEnd: z.boolean(),
})

export const Route = createFileRoute('/api/billing/subscription')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({
        context,
        request,
      }: {
        context: AuthContext
        request: Request
      }) => {
        try {
          const { user } = context
          const body = await request.json()
          const { cancelAtPeriodEnd } = updateSubscriptionSchema.parse(body)

          // Find the user's active subscription
          const [userSubscription] = await db
            .select()
            .from(subscriptions)
            .where(and(eq(subscriptions.userId, user.id)))
            .limit(1)

          if (!userSubscription) {
            return new Response(
              JSON.stringify({
                error: 'No subscription found',
              }),
              {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
              },
            )
          }

          // Update the subscription via Polar API
          const result = await api.subscriptions.update({
            id: userSubscription.polarSubscriptionId,
            subscriptionUpdate: {
              cancelAtPeriodEnd,
            },
          })

          const message = cancelAtPeriodEnd
            ? 'Subscription canceled successfully. You will retain access until the end of your billing period.'
            : 'Subscription reinstated successfully. Your subscription will continue at the end of the current billing period.'

          console.log(
            `✅ ${cancelAtPeriodEnd ? 'Canceled' : 'Reinstated'} subscription: ${userSubscription.polarSubscriptionId}`,
          )

          return new Response(
            JSON.stringify({
              success: true,
              subscription: result,
              message,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        } catch (error) {
          console.error('Error updating subscription:', error)

          // Handle specific Polar SDK errors
          if (error instanceof Error) {
            return new Response(
              JSON.stringify({
                error: 'Failed to update subscription',
                details: error.message,
              }),
              {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
              },
            )
          }

          return new Response(
            JSON.stringify({
              error: 'Failed to update subscription',
            }),
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
