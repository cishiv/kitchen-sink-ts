export type UserSubscription = {
  id: number
  createdAt: Date
  updatedAt: Date
  userId: string
  subscriptionTierId: number | null
  polarSubscriptionId: string
  polarCustomerId: string
  polarProductId: string
  polarCheckoutId: string | null
  customerEmail: string
  customerName: string | null
  customerExternalId: string | null
  productName: string
  productDescription: string | null
  status: string
  amount: number
  currency: string
  recurringInterval: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  canceledAt: Date | null
  cancellationReason: string | null
  startedAt: Date | null
}

export type UserDetails = {
  id: string
  name: string
  email: string
  image: string | null
  createdAt: Date
  updatedAt: Date
}
