import type { UserSubscription } from '../types'
import type { Subscription } from '../db/schema'

const adaptSubscription = (subscription: Subscription): UserSubscription => {
  return {
    id: subscription.id,
    createdAt: subscription.createdAt,
    updatedAt: subscription.updatedAt,
    userId: subscription.userId,
    subscriptionTierId: subscription.subscriptionTierId,
    polarSubscriptionId: subscription.polarSubscriptionId,
    polarCustomerId: subscription.polarCustomerId,
    polarProductId: subscription.polarProductId,
    polarCheckoutId: subscription.polarCheckoutId,
    customerEmail: subscription.customerEmail,
    customerName: subscription.customerName,
    customerExternalId: subscription.customerExternalId,
    productName: subscription.productName,
    productDescription: subscription.productDescription,
    status: subscription.status,
    amount: subscription.amount,
    currency: subscription.currency,
    recurringInterval: subscription.recurringInterval,
    currentPeriodStart: subscription.currentPeriodStart,
    currentPeriodEnd: subscription.currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    canceledAt: subscription.canceledAt,
    cancellationReason: subscription.cancellationReason,
    startedAt: subscription.startedAt,
  }
}

export default adaptSubscription
