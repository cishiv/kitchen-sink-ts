/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'

import { createFileRoute } from '@tanstack/react-router'
import type { JSX } from 'react'
import { authClient } from '@/lib/auth-client'
import { ProductsGrid } from '@/components/ProductsGrid'
import { UserSubscriptionView } from '@/components/UserSubscription'

export const Route = createFileRoute('/_protected/billing')({
  component: BillingPage,
})

function BillingPage(): JSX.Element {
  const { data: session } = authClient.useSession()

  return (
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
  )
}
