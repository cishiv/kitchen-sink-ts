import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

// SubscriptionTiers table - defines available subscription tiers and their features
export const subscriptionTiers = pgTable('subscription_tiers', {
  // Primary key
  id: serial('id').primaryKey(),

  // Tier name (e.g., "Free", "Pro", "Enterprise")
  name: varchar('name', { length: 100 }).notNull().unique(),

  // Array of feature names available in this tier
  features: text('features').array().notNull().default([]),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const selectSubscriptionTierSchema =
  createSelectSchema(subscriptionTiers)
export const insertSubscriptionTierSchema = createInsertSchema(
  subscriptionTiers,
  {
    name: z.string().min(1, 'Tier name cannot be empty'),
    features: z.array(z.string()).default([]),
  },
)

// Export subscription tier types
export type SubscriptionTier = typeof subscriptionTiers.$inferSelect
export type NewSubscriptionTier = typeof subscriptionTiers.$inferInsert

// Subscriptions table - stores Polar subscription data linked to users
export const subscriptions = pgTable('subscriptions', {
  // Primary key
  id: serial('id').primaryKey(),

  // Foreign key to users table
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),

  // Foreign key to subscription tiers table
  subscriptionTierId: integer('subscription_tier_id').references(
    () => subscriptionTiers.id,
  ),

  // Polar IDs
  polarSubscriptionId: varchar('polar_subscription_id', { length: 255 })
    .notNull()
    .unique(),
  polarCustomerId: varchar('polar_customer_id', { length: 255 }).notNull(),
  polarProductId: varchar('polar_product_id', { length: 255 }).notNull(),
  polarCheckoutId: varchar('polar_checkout_id', { length: 255 }),

  // Customer info (denormalized for quick access)
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerName: varchar('customer_name', { length: 255 }),
  customerExternalId: varchar('customer_external_id', { length: 255 }),

  // Product info
  productName: varchar('product_name', { length: 255 }).notNull(),
  productDescription: text('product_description'),

  // Subscription details
  status: varchar('status', { length: 50 }).notNull(), // active, canceled, past_due, etc.
  amount: integer('amount').notNull(), // in cents
  currency: varchar('currency', { length: 10 }).notNull(),
  recurringInterval: varchar('recurring_interval', { length: 20 }).notNull(), // month, year

  // Billing periods
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),

  // Cancellation info
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  canceledAt: timestamp('canceled_at'),
  cancellationReason: varchar('cancellation_reason', { length: 255 }),
  cancellationComment: text('cancellation_comment'),

  // Important dates
  startedAt: timestamp('started_at').notNull(),
  endsAt: timestamp('ends_at'),
  endedAt: timestamp('ended_at'),

  // Metadata
  metadata: jsonb('metadata').default({}).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const selectSubscriptionSchema = createSelectSchema(subscriptions)
export const insertSubscriptionSchema = createInsertSchema(subscriptions, {
  polarSubscriptionId: z
    .string()
    .min(1, 'Polar subscription ID cannot be empty'),
  polarCustomerId: z.string().min(1, 'Polar customer ID cannot be empty'),
  polarProductId: z.string().min(1, 'Polar product ID cannot be empty'),
  customerEmail: z.string().email('Invalid customer email'),
  status: z.string().min(1, 'Status cannot be empty'),
  amount: z.number().min(0, 'Amount must be non-negative'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
})

// Export subscription types
export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert

// Uploads table - stores file uploads to R2 linked to users
export const uploads = pgTable('uploads', {
  // Primary key
  id: serial('id').primaryKey(),

  // Foreign key to users table
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),

  // File metadata
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileKey: varchar('file_key', { length: 500 }).notNull().unique(), // R2 object key
  fileSize: integer('file_size').notNull(), // in bytes
  mimeType: varchar('mime_type', { length: 100 }).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const selectUploadSchema = createSelectSchema(uploads)
export const insertUploadSchema = createInsertSchema(uploads, {
  fileName: z.string().min(1, 'File name cannot be empty'),
  fileKey: z.string().min(1, 'File key cannot be empty'),
  fileSize: z.number().min(0, 'File size must be non-negative'),
  mimeType: z.string().min(1, 'MIME type cannot be empty'),
})

// Export upload types
export type Upload = typeof uploads.$inferSelect
export type NewUpload = typeof uploads.$inferInsert
