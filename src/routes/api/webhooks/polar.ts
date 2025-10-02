/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { createFileRoute } from '@tanstack/react-router'
import { Webhooks } from '@polar-sh/tanstack-start'
import { eq } from 'drizzle-orm'
import { subscriptions, users } from '@/lib/db/schema'
import { db } from '@/lib/db'

async function findUserForSubscription(data: any) {
  const customerId = data.customerExternalId || data.externalCustomerId // both fields are usually available
  if (customerId) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, customerId))
      .limit(1)

    if (user) {
      console.log(`✅ Found user by ID: ${customerId}`)
      return user
    }
    console.warn(`⚠️ No user found for ID: ${customerId}`)
  }

  // 2. Fallback: Match by email (for backwards compatibility)
  const customerEmail = data.customer?.email
  if (customerEmail) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, customerEmail))
      .limit(1)

    if (user) {
      console.log(`✅ Found user by email: ${customerEmail}`)
      return user
    }
    console.warn(`⚠️ No user found for email: ${customerEmail}`)
  }

  console.error(
    `❌ No user found for subscription - CustomerID: ${customerId}, Email: ${customerEmail}`,
  )
  return null
}

// Helper function to check if subscription already exists
async function subscriptionExists(polarSubscriptionId: string) {
  const [existing] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.polarSubscriptionId, polarSubscriptionId))
    .limit(1)
  return existing
}

// Helper function for safe date conversion
function safeDate(value: any): Date | null {
  if (!value) return null

  try {
    const date = new Date(value)
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date value: ${value}`)
      return null
    }
    return date
  } catch (error) {
    console.warn(`Error converting date: ${value}`, error)
    return null
  }
}

// Helper function for error handling
async function withErrorHandling(
  eventType: string,
  handler: () => Promise<void>,
) {
  try {
    await handler()
  } catch (error) {
    console.error(`Error in ${eventType}:`, error)
    throw error // Re-throw to ensure webhook fails if critical operations fail
  }
}

export const Route = createFileRoute('/api/webhooks/polar')({
  server: {
    handlers: {
      POST: Webhooks({
        webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
        onPayload: async (payload) => {
          console.log(`📦 Received Polar webhook: ${payload.type}`)
          console.log('Full webhook payload:', JSON.stringify(payload, null, 2))

          // Handle the event
          switch (payload.type) {
            // Checkout has been created
            case 'checkout.created':
              await withErrorHandling('checkout.created', () =>
                handleCheckoutCreated(payload.data),
              )
              break

            // Checkout has been updated - this will be triggered when checkout status goes from confirmed -> succeeded
            case 'checkout.updated':
              await withErrorHandling('checkout.updated', () =>
                handleCheckoutUpdated(payload.data),
              )
              break

            // Subscription has been created
            case 'subscription.created':
              await withErrorHandling('subscription.created', () =>
                handleSubscriptionCreated(payload.data),
              )
              break

            // A catch-all case to handle all subscription webhook events
            case 'subscription.updated':
              await withErrorHandling('subscription.updated', () =>
                handleSubscriptionUpdated(payload.data),
              )
              break

            // Subscription has been activated
            case 'subscription.active':
              await withErrorHandling('subscription.active', () =>
                handleSubscriptionActive(payload.data),
              )
              break

            // Subscription has been revoked/peroid has ended with no renewal
            case 'subscription.revoked':
              await withErrorHandling('subscription.revoked', () =>
                handleSubscriptionRevoked(payload.data),
              )
              break

            // Subscription has been explicitly canceled by the user
            case 'subscription.canceled':
              await withErrorHandling('subscription.canceled', () =>
                handleSubscriptionCanceled(payload.data),
              )
              break

            default:
              console.log(`Unhandled event type ${payload.type}`)
          }
        },
      }),
    },
  },
})

async function handleCheckoutCreated(data: any) {
  console.log(`💳 Checkout created: ${data.id}`)
  console.log('Full checkout created payload:', JSON.stringify(data, null, 2))

  // Log checkout initiation with customer details
  const customerId = data.customerExternalId || data.externalCustomerId
  const customerEmail = data.customer?.email

  console.log(`💳 Checkout details:`, {
    id: data.id,
    customerId,
    customerEmail,
    amount: data.amount,
    currency: data.currency,
    status: data.status,
  })

  // Optional: Verify the user exists in our system
  if (customerId) {
    const user = await findUserForSubscription(data)
    if (!user) {
      console.warn(`⚠️ Checkout created for unknown user: ${customerId}`)
    }
  }
}

// FIXME: Just making it async for consistency, we may have to modify it later to write to the DB
// eslint-disable-next-line @typescript-eslint/require-await
async function handleCheckoutUpdated(data: any) {
  console.log(`💳 Checkout updated: ${data.id}, status: ${data.status}`)
  console.log('Full checkout updated payload:', JSON.stringify(data, null, 2))

  if (data.status === 'succeeded') {
    console.log(`✅ Payment confirmed for checkout: ${data.id}`)
    const customerId = data.customerExternalId || data.externalCustomerId
    console.log(
      `💰 Payment success for user: ${customerId}, amount: ${data.amount / 100} ${
        data.currency
      }`,
    )
  } else if (data.status === 'failed') {
    console.log(`❌ Payment failed for checkout: ${data.id}`)
  }
}

async function handleSubscriptionCreated(data: any) {
  console.log(`🔄 Subscription created: ${data.id}`)
  console.log(
    'Full subscription created payload:',
    JSON.stringify(data, null, 2),
  )

  // Use improved user matching
  const user = await findUserForSubscription(data)
  const customerId = data.customerExternalId || data.externalCustomerId
  const customerEmail = data.customer?.email

  if (!user && customerId) {
    console.error(
      `Creating orphaned subscription for later reconciliation - ID: ${customerId}`,
    )
  } else if (!user) {
    console.error(`No user identification found - no Customer ID or email`)
    return // Can't create subscription without any user info
  }

  // Check idempotency
  const existing = await subscriptionExists(data.id)
  if (existing) {
    console.log(`Subscription ${data.id} already exists, skipping creation`)
    return
  }

  if (!user?.id) {
    console.error(`No user ID found for subscription: ${data.id}`)
    return
  }

  // Create subscription record with proper user linkage
  const [newSubscription] = await db
    .insert(subscriptions)
    .values({
      userId: user.id,
      polarSubscriptionId: data.id,
      polarCustomerId: data.customer.id,
      polarProductId: data.productId,
      polarCheckoutId: data.checkoutId,
      customerEmail: customerEmail || '',
      customerName: data.customer?.name || null,
      customerExternalId: customerId || null, // Store the Customer ID as it was represented on the Polar wh
      productName: data.product?.name || 'Unknown Product',
      productDescription: data.product?.description || null,
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      recurringInterval: data.product.recurringInterval,
      currentPeriodStart: safeDate(data.currentPeriodStart) || new Date(),
      currentPeriodEnd: safeDate(data.currentPeriodEnd) || new Date(),
      cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
      canceledAt: safeDate(data.canceledAt),
      startedAt: safeDate(data.startedAt) || new Date(),
      endsAt: safeDate(data.endsAt),
      endedAt: safeDate(data.endedAt),
      metadata: {
        ...data.metadata,
        customerExternalId: customerId,
        originalEmail: customerEmail,
      },
    })
    .returning()

  console.log(`✅ Created subscription record:`, {
    id: newSubscription.id,
    polarSubscriptionId: newSubscription.polarSubscriptionId,
    userId: newSubscription.userId,
    customerExternalId: newSubscription.customerExternalId,
    status: newSubscription.status,
    orphaned: !user,
  })
}

async function handleSubscriptionActive(data: any) {
  try {
    console.log(
      'Full subscription active payload:',
      JSON.stringify(data, null, 2),
    )
    const customerId = data.customerExternalId || data.externalCustomerId
    const customerEmail = data.customer?.email

    console.log(`✅ Subscription active: ${data.id}`, {
      customerId,
      customerEmail,
      status: data.status,
    })

    await db
      .update(subscriptions)
      .set({
        status: 'active',
        customerExternalId: customerId || null,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.polarSubscriptionId, data.id))

    console.log(`✅ Updated subscription ${data.id} to active status`)
  } catch (error) {
    console.error('Error handling subscription active:', error)
    throw error
  }
}

async function handleSubscriptionUpdated(data: any) {
  try {
    console.log(
      'Full subscription updated payload:',
      JSON.stringify(data, null, 2),
    )
    const customerId = data.customerExternalId || data.externalCustomerId
    const customerEmail = data.customer?.email

    console.log(`🔄 Subscription updated: ${data.id}`, {
      customerId,
      customerEmail,
      status: data.status,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
      amount: data.amount,
    })

    await db
      .update(subscriptions)
      .set({
        status: data.status,
        amount: data.amount,
        currentPeriodStart: safeDate(data.currentPeriodStart) || new Date(),
        currentPeriodEnd: safeDate(data.currentPeriodEnd) || new Date(),
        cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
        canceledAt: safeDate(data.canceledAt),
        cancellationReason: data.customerCancellationReason,
        cancellationComment: data.customerCancellationComment,
        endsAt: safeDate(data.endsAt),
        endedAt: safeDate(data.endedAt),
        customerExternalId: customerId || null,
        metadata: {
          ...(data.metadata || {}),
          customerExternalId: customerId,
          originalEmail: customerEmail,
        },
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.polarSubscriptionId, data.id))

    console.log(`✅ Updated subscription ${data.id} with new data`)
  } catch (error) {
    console.error('Error handling subscription updated:', error)
    throw error
  }
}

async function handleSubscriptionCanceled(data: any) {
  try {
    console.log(
      'Full subscription canceled payload:',
      JSON.stringify(data, null, 2),
    )
    const customerId = data.customerExternalId || data.externalCustomerId
    const customerEmail = data.customer?.email

    console.log(`❌ Subscription canceled: ${data.id}`, {
      customerId,
      customerEmail,
      cancellationReason: data.customerCancellationReason,
      cancellationComment: data.customerCancellationComment,
    })

    await db
      .update(subscriptions)
      .set({
        status: 'canceled',
        canceledAt: new Date(),
        cancellationReason: data.customerCancellationReason,
        cancellationComment: data.customerCancellationComment,
        customerExternalId: customerId || null,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.polarSubscriptionId, data.id))

    console.log(`✅ Marked subscription ${data.id} as canceled`)
  } catch (error) {
    console.error('Error handling subscription canceled:', error)
    throw error
  }
}

async function handleSubscriptionRevoked(data: any) {
  try {
    console.log(
      'Full subscription revoked payload:',
      JSON.stringify(data, null, 2),
    )
    const customerId = data.customerExternalId || data.externalCustomerId
    const customerEmail = data.customer?.email

    console.log(`🚫 Subscription revoked: ${data.id}`, {
      customerId,
      customerEmail,
      status: data.status,
      endsAt: data.endsAt,
      endedAt: data.endedAt,
    })

    await db
      .update(subscriptions)
      .set({
        status: 'revoked',
        endedAt: new Date(),
        customerExternalId: customerId || null,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.polarSubscriptionId, data.id))

    console.log(`✅ Marked subscription ${data.id} as revoked`)
  } catch (error) {
    console.error('Error handling subscription revoked:', error)
    throw error
  }
}
