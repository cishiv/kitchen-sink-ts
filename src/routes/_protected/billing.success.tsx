/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'

import { Link, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { CheckCircle } from 'lucide-react'
import type { JSX } from 'react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const searchParamsSchema = z.object({
  checkout_id: z.string().optional(),
})

export const Route = createFileRoute('/_protected/billing/success')({
  component: BillingSuccessPage,
  validateSearch: searchParamsSchema,
})

function BillingSuccessPage(): JSX.Element {
  const { data: session } = authClient.useSession()
  const { checkout_id } = Route.useSearch()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 hover:text-gray-700"
            >
              Kitchen Sink
            </Link>
            <span className="text-gray-400">•</span>
            <span className="text-lg font-medium text-gray-600">
              Payment Success
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/billing">Billing</Link>
            </Button>
            <span className="text-sm text-gray-600">
              {session?.user?.email}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">
                Payment Successful!
              </CardTitle>
              <CardDescription className="text-lg">
                Thank you for your purchase. Your subscription is now active.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {checkout_id && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Transaction ID:</strong> {checkout_id}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">What's next?</h3>
                <ul className="text-left space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>You'll receive a confirmation email shortly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Your subscription features are now available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Manage your subscription in the billing section</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild className="flex-1">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/billing">View Billing</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Need help? Contact our{' '}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:underline"
              >
                support team
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
