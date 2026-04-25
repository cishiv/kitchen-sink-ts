---
title: 'Announcing New Features: File Uploads and Subscriptions'
description: 'Exciting updates to Kitchen Sink including R2 file uploads, Polar subscriptions, and improved billing management.'
published: '2025-02-01'
author: 'Kitchen Sink Team'
tags: ['announcement', 'features', 'updates']
---

# Announcing New Features

We're thrilled to announce major new features in Kitchen Sink that make it even easier to build production-ready applications.

## File Uploads with R2

Kitchen Sink now includes built-in support for file uploads using Cloudflare R2 (S3-compatible storage).

### Key Features

- **Simple API** - Upload files with a single function call
- **Presigned URLs** - Secure, direct-to-storage uploads
- **Automatic cleanup** - Track uploads in your database
- **Progress tracking** - Built-in upload progress indicators

### Example Usage

```typescript
import { uploadToR2 } from '@/lib/r2'

async function handleUpload(file: File) {
  const result = await uploadToR2(file)
  console.log('File uploaded:', result.key)
}
```

## Subscription Management with Polar

We've integrated Polar for subscription billing and management.

### What You Get

- **Flexible pricing** - Support for multiple subscription tiers
- **Automatic webhooks** - Stay in sync with subscription changes
- **Customer portal** - Let users manage their own subscriptions
- **Analytics** - Track MRR and subscription metrics

### Setting Up Subscriptions

1. Create products in your Polar dashboard
2. Configure webhooks to point to your app
3. Start accepting subscriptions!

```typescript
// Products are automatically fetched and displayed
import { ProductsGrid } from '@/components/ProductsGrid'

function PricingPage() {
  return <ProductsGrid />
}
```

## Improved Billing Dashboard

The billing page has been completely redesigned with:

- Real-time subscription status
- One-click upgrade/downgrade
- Subscription cancellation with reason tracking
- Invoice history

## Database Schema Updates

We've added new tables to support these features:

- `subscription_tiers` - Define your product tiers
- `subscriptions` - Track user subscriptions
- `uploads` - Manage file uploads

All changes are fully typed with Drizzle ORM and Zod schemas.

## Migration Guide

If you're upgrading from an earlier version:

```bash
# Pull the latest changes
git pull origin main

# Install new dependencies
pnpm install

# Run new migrations
pnpm drizzle-kit migrate
```

## What's Next?

We're already working on the next set of features:

- Team collaboration and workspaces
- Real-time notifications
- Advanced analytics dashboard
- Email templates

Stay tuned for more updates!

## Feedback

We'd love to hear what you think about these new features. Join our [Discord community](https://discord.gg/example) or open an issue on [GitHub](https://github.com/example/kitchen-sink).
