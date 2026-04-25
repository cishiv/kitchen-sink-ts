'use client'

import { useState } from 'react'
import type { JSX } from 'react'
import { Button } from '@/components/ui/button'

interface SubscriptionActionButtonProps {
  subscriptionId: string
  action: 'cancel' | 'reinstate'
}

export function SubscriptionActionButton({
  subscriptionId,
  action,
}: SubscriptionActionButtonProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (): Promise<void> => {
    const cancelAtPeriodEnd = action === 'cancel'
    const confirmMessage = cancelAtPeriodEnd
      ? 'Are you sure you want to cancel your subscription? It will remain active until the end of your current billing period.'
      : 'Are you sure you want to reinstate your subscription? It will continue renewing at the end of your current billing period.'

    if (!confirm(confirmMessage)) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/billing/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cancelAtPeriodEnd }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      alert(
        `Error ${action === 'cancel' ? 'canceling' : 'reinstating'} subscription. Please try again.`,
      )
      console.error(
        `Error ${action === 'cancel' ? 'canceling' : 'reinstating'} subscription:`,
        error,
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (action === 'cancel') {
    return (
      <Button
        variant="destructive"
        onClick={handleAction}
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Canceling...' : 'Cancel Subscription'}
      </Button>
    )
  }

  return (
    <Button
      variant="default"
      onClick={handleAction}
      className="w-full"
      disabled={isLoading}
    >
      {isLoading ? 'Reinstating...' : 'Reinstate Subscription'}
    </Button>
  )
}
