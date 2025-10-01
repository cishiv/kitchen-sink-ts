/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'

import { createServerFn, useServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, CalendarDays, CreditCard } from 'lucide-react'
import { and, eq } from 'drizzle-orm'
import type { JSX } from 'react'
import type { Subscription } from '@/lib/db/schema'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CancelSubscriptionButton } from '@/components/CancelSubscriptionButton'
import { db } from '@/lib/db'
import { subscriptions, users } from '@/lib/db/schema'

type UserSubscriptionData = {
  subscription: Subscription | null
}

// FIXME: I don't quite understand the return type of .handler
// If I explicitly type the responses, it fails. How do I return a "empty" state without null?
// This should also probably be a GET
const getServerUserSubscription = createServerFn({
  method: 'POST',
})
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    // .inputValidator((data: { userEmail: string }) => data)
    // .handler(async ({ data }): Promise<UserSubscriptionData> => {
    console.log(data)
    const userEmail = data

    try {
      const [userSubscription] = await db
        .select({
          subscription: subscriptions,
        })
        .from(subscriptions)
        .innerJoin(users, eq(users.id, subscriptions.userId))
        .where(
          and(eq(users.email, userEmail), eq(subscriptions.status, 'active')),
        )
        .orderBy(subscriptions.createdAt)
        .limit(1)

      if (!userSubscription) {
        return {
          subscription: null,
        } as any
      }

      return {
        subscription: userSubscription as unknown as Subscription,
      } as any
    } catch (error) {
      console.error('Error fetching user subscription:', error)
      return {
        subscription: null,
      } as any
    }
  })

interface UserSubscriptionProps {
  userEmail: string
}

export function UserSubscription({
  userEmail,
}: UserSubscriptionProps): JSX.Element {
  const getUserSubscription = useServerFn(getServerUserSubscription)

  const subscriptionData = useQuery({
    queryKey: ['userSubscription'],
    queryFn: () =>
      getUserSubscription({
        data: userEmail,
      }),
  })

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (subscriptionData.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (subscriptionData.isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">
            Error Loading Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Unable to load subscription information. Please try again later.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!subscriptionData.data.subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            You don&apos;t have an active subscription yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Subscribe to a plan to access premium features.
          </p>
        </CardContent>
      </Card>
    )
  }

  const { subscription } = subscriptionData.data.subscription
  const nextBillingDate = new Date(subscription.currentPeriodEnd)
  const isActive = subscription.status === 'active'
  const willCancelAtPeriodEnd = subscription.cancelAtPeriodEnd

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Subscription
            </CardTitle>
            <CardDescription>{subscription.productName}</CardDescription>
          </div>
          <Badge className={getStatusColor(subscription.status)}>
            {subscription.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {subscription.productDescription && (
          <p className="text-gray-600">{subscription.productDescription}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Plan Details</h4>
            <div className="text-sm text-gray-600">
              <p>
                <strong>Price:</strong> $
                {(subscription.amount / 100).toFixed(2)} /{' '}
                {subscription.recurringInterval}
              </p>
              <p>
                <strong>Currency:</strong> {subscription.currency.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              Billing Information
            </h4>
            <div className="text-sm text-gray-600">
              <p>
                <strong>Next billing:</strong>{' '}
                {nextBillingDate.toLocaleDateString()}
              </p>
              <p>
                <strong>Started:</strong>{' '}
                {new Date(subscription.startedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {willCancelAtPeriodEnd && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Your subscription will be canceled at the end of the current
              billing period ({nextBillingDate.toLocaleDateString()}).
            </p>
          </div>
        )}

        {isActive && !willCancelAtPeriodEnd && (
          <div className="pt-4 border-t">
            <CancelSubscriptionButton
              subscriptionId={subscription.polarSubscriptionId}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
