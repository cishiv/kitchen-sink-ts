'use client'

import { useState } from 'react'
import type { JSX } from 'react'
import { Button } from '@/components/ui/button'

interface CancelSubscriptionButtonProps {
  subscriptionId: string
}

export function CancelSubscriptionButton({
  subscriptionId,
}: CancelSubscriptionButtonProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async (): Promise<void> => {
    if (
      !confirm(
        'Are you sure you want to cancel your subscription? It will remain active until the end of your current billing period.',
      )
    ) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/billing/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      })

      if (response.ok) {
        alert(
          'Subscription canceled successfully. It will remain active until the end of your current billing period.',
        )
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`Error canceling subscription: ${error.message}`)
      }
    } catch (error) {
      alert('Error canceling subscription. Please try again.')
      console.error('Error canceling subscription:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleCancel}
      className="w-full"
      disabled={isLoading}
    >
      {isLoading ? 'Canceling...' : 'Cancel Subscription'}
    </Button>
  )
}
