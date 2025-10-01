/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'

import { Link, createFileRoute } from '@tanstack/react-router'
import type { JSX } from 'react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { ProductsGrid } from '@/components/ProductsGrid'
import { UserSubscriptionView } from '@/components/UserSubscription'

export const Route = createFileRoute('/_protected/billing')({
  component: BillingPage,
})

function BillingPage(): JSX.Element {
  const { data: session } = authClient.useSession()

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Billing & Subscriptions
          </h1>
          <p className="text-gray-600">
            Manage your subscription and billing information.
          </p>
        </div>

        <div className="space-y-8">
          {session?.user?.email && (
            <UserSubscriptionView userEmail={session.user.email} />
          )}

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Available Plans
            </h2>
            <ProductsGrid />
          </div>
        </div>
      </main>
    </div>
  )
}
