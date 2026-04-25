# Kitchen Sink - Full-Stack TypeScript SaaS Starter

A production-ready, full-stack TypeScript SaaS starter template built with modern technologies. Features authentication, subscription billing, file uploads, and a complete admin dashboard.

## 🚀 Features

- **🔐 Authentication** - Email/password and Google OAuth via [BetterAuth](https://www.better-auth.com/)
- **💳 Subscription Billing** - Integrated with [Polar](https://polar.sh/) for payment processing
- **📁 File Storage** - Cloudflare R2 (S3-compatible) for scalable file uploads
- **🗄️ Database** - PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **⚡️ Modern Stack** - React 19, TanStack Start, Vite, TypeScript
- **🎨 UI Components** - shadcn/ui with Tailwind CSS
- **📱 Responsive Design** - Mobile-first approach
- **🧪 Testing** - Vitest for unit tests
- **🔧 Type Safety** - End-to-end TypeScript with Zod validation

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ and **pnpm** installed
- **PostgreSQL** database (local or cloud)
- **Cloudflare R2** account (for file uploads)
- **Polar** account (for subscription billing)
- **Google OAuth** credentials (optional, for social login)

## 🛠️ Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd kitchen-sink-ts
pnpm install
```

### 2. Environment Setup

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# BetterAuth Configuration
BETTER_AUTH_SECRET=your-random-secret-string
BETTER_AUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Polar Subscription Platform
POLAR_MODE=sandbox # or 'production'
POLAR_ACCESS_TOKEN=your-polar-access-token
POLAR_SUCCESS_URL=http://localhost:3000/billing/success
POLAR_WEBHOOK_SECRET=your-polar-webhook-secret
POLAR_THEME=dark # or 'light'

# Cloudflare R2 Storage
R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=your-bucket-name
```

### 3. Database Setup

Generate and run migrations:

```bash
# Generate migration files from schema
pnpm drizzle-kit generate

# Apply migrations to database
pnpm drizzle-kit migrate

# (Optional) Open Drizzle Studio to inspect your database
pnpm drizzle-kit studio
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 🏗️ Architecture

### Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| **Frontend**   | React 19, TanStack Router           |
| **Backend**    | TanStack Start (SSR)                |
| **Database**   | PostgreSQL + Drizzle ORM            |
| **Auth**       | BetterAuth (email/password + OAuth) |
| **Payments**   | Polar (subscriptions)               |
| **Storage**    | Cloudflare R2 (S3-compatible)       |
| **Styling**    | Tailwind CSS + shadcn/ui            |
| **Validation** | Zod                                 |
| **Build Tool** | Vite                                |
| **Testing**    | Vitest                              |

### Project Structure

```
kitchen-sink-ts/
├── src/
│   ├── routes/              # File-based routing
│   │   ├── _protected/      # Protected routes (require auth)
│   │   ├── api/             # API endpoints
│   │   │   ├── auth/        # BetterAuth endpoints
│   │   │   ├── billing/     # Polar checkout & subscriptions
│   │   │   ├── uploads/     # File upload endpoints
│   │   │   └── webhooks/    # Webhook handlers
│   │   └── __root.tsx       # Root layout
│   ├── components/          # React components
│   │   └── ui/              # shadcn/ui components
│   ├── lib/                 # Core libraries & utilities
│   │   ├── db/              # Database schema & client
│   │   ├── adapters/        # Data adapters
│   │   ├── auth.ts          # BetterAuth server config
│   │   ├── auth-client.ts   # BetterAuth client
│   │   ├── auth-helpers.ts  # Auth utility functions
│   │   ├── polar.ts         # Polar SDK client
│   │   ├── r2.ts            # R2 storage utilities
│   │   └── utils.ts         # General utilities
│   ├── middleware/          # TanStack Start middleware
│   └── styles.css           # Global styles
├── drizzle/                 # Database migrations
├── .env.example             # Environment variables template
└── package.json
```

## 🔑 Core Concepts

### Authentication

**Server-side auth helpers** (`src/lib/auth-helpers.ts`):

- `getServerAuthUser()` - Returns current user or null
- `requireAuth()` - Throws error if not authenticated

**Protected Routes:**
Routes under `src/routes/_protected/` automatically redirect to `/login` if not authenticated.

**Example: Protecting a custom route**

```typescript
// src/routes/admin.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getServerAuthUser } from '@/lib/auth-helpers'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    const authUser = await getServerAuthUser()
    if (!authUser) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname },
      })
    }
  },
  component: AdminPage,
})
```

**API Route Protection:**

```typescript
import { authMiddleware } from '@/middleware/auth-middleware'

export const Route = createFileRoute('/api/my-endpoint')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      GET: async ({ context }) => {
        // context.user and context.session are available
        const userId = context.user.id
        // ...
      },
    },
  },
})
```

### Database Schema

All tables are defined in `src/lib/db/schema.ts`:

- **users** - User accounts
- **sessions** - Active user sessions
- **accounts** - OAuth provider accounts
- **verifications** - Email verification tokens
- **subscription_tiers** - Available subscription plans
- **subscriptions** - User subscriptions (synced with Polar)
- **uploads** - File upload metadata

**Example: Adding a new table**

```typescript
// src/lib/db/schema.ts
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const selectPostSchema = createSelectSchema(posts)
export const insertPostSchema = createInsertSchema(posts)

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
```

Then generate and apply migration:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### Subscription Billing (Polar)

**Checkout Flow:**

1. User clicks "Subscribe" button
2. Frontend calls `/api/billing/checkout` with product ID
3. User completes payment on Polar
4. Polar webhook creates subscription in database
5. User redirected to success page

**Webhook Events Handled:**

- `checkout.created` - Checkout session initiated
- `checkout.updated` - Payment succeeded/failed
- `subscription.created` - New subscription created
- `subscription.updated` - Subscription modified
- `subscription.active` - Subscription activated
- `subscription.revoked` - Subscription ended

**Webhook Implementation:** See `src/routes/api/webhooks/polar.ts`

### File Uploads (R2)

**Upload Flow:**

1. Frontend requests presigned upload URL from `/api/uploads/presigned-url`
2. Validation checks: file size (max 50MB) and MIME type
3. Frontend uploads file directly to R2 using presigned URL
4. Frontend notifies `/api/uploads/complete` to create database record
5. File is accessible via `/api/uploads/:id/view` or `/api/uploads/:id/download`

**Supported File Types:**

- Images: JPEG, PNG, GIF, WebP, SVG
- Documents: PDF, TXT, CSV, JSON
- Office: DOCX, XLSX, PPTX
- Archives: ZIP

**Customizing Allowed File Types:**
Edit `ALLOWED_MIME_TYPES` in `src/routes/api/uploads/presigned-url.ts`

## 🧑‍💻 Development

### Available Commands

```bash
pnpm dev              # Start development server (port 3000)
pnpm build            # Build for production
pnpm serve            # Preview production build
pnpm test             # Run tests
pnpm lint             # Lint code
pnpm format           # Format code
pnpm check            # Format and lint with auto-fix
```

### Adding UI Components

This project uses shadcn/ui. To add components:

```bash
# Example: Add a new component
npx shadcn@latest add button
npx shadcn@latest add dialog
```

Components are installed to `src/components/ui/`

### Database Migrations

**Workflow:**

1. Modify `src/lib/db/schema.ts`
2. Generate migration: `pnpm drizzle-kit generate`
3. Review migration in `drizzle/` directory
4. Apply migration: `pnpm drizzle-kit migrate`

**Inspect Database:**

```bash
pnpm drizzle-kit studio
# Opens web UI at http://localhost:4983
```

## 🚢 Deployment

### Environment Setup

1. Set all environment variables in your hosting platform
2. Update `BETTER_AUTH_URL` to your production domain
3. Update `POLAR_SUCCESS_URL` to your production callback URL
4. Set `POLAR_MODE=production` for live payments

### Database

1. Provision PostgreSQL database
2. Run migrations on production:
   ```bash
   pnpm drizzle-kit migrate
   ```

### Webhooks

Configure webhook endpoints in Polar dashboard:

- **Webhook URL**: `https://yourdomain.com/api/webhooks/polar`
- **Secret**: Use the value from `POLAR_WEBHOOK_SECRET`

### Recommended Platforms

- **Vercel** - Zero-config deployment for TanStack Start
- **Railway** - Easy PostgreSQL hosting
- **Cloudflare** - R2 storage included with free tier
- **Supabase** - PostgreSQL with free tier

## 🎨 Customization Guide

### Branding

1. **Update Site Metadata** - Edit `src/routes/__root.tsx`
2. **Replace Logo** - Update `src/components/Header.tsx`
3. **Modify Theme** - Edit `src/styles.css` (Tailwind config)

### Adding Features

**Example: Add a Blog**

1. **Create Database Schema:**

```typescript
// src/lib/db/schema.ts
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: text('author_id')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

2. **Generate Migration:**

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

3. **Create API Routes:**

```typescript
// src/routes/api/blog/index.ts
export const Route = createFileRoute('/api/blog/')({
  server: {
    handlers: {
      GET: async () => {
        const posts = await db.select().from(blogPosts)
        return Response.json(posts)
      },
    },
  },
})
```

4. **Create Frontend Routes:**

```typescript
// src/routes/blog/index.tsx
export const Route = createFileRoute('/blog/')({
  component: BlogList,
})
```

### Subscription Tiers

1. Create tiers in Polar dashboard
2. Add tier metadata to `subscription_tiers` table
3. Display in `src/components/ProductsGrid.tsx`

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**

- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- Ensure database exists

**OAuth Not Working**

- Verify Google OAuth credentials
- Check redirect URIs in Google Console
- Ensure `BETTER_AUTH_URL` matches your domain

**Webhooks Not Firing**

- Verify `POLAR_WEBHOOK_SECRET` matches Polar dashboard
- Check webhook URL is publicly accessible
- Review logs in Polar dashboard

**File Upload Fails**

- Verify R2 credentials are correct
- Check bucket exists and is accessible
- Ensure CORS is configured on R2 bucket

### Debug Mode

Enable verbose logging:

```typescript
// src/lib/db/index.ts
export const db = drizzle(client, {
  schema,
  logger: true, // Enable query logging
})
```

## 📚 Resources

- [TanStack Start Docs](https://tanstack.com/start)
- [BetterAuth Docs](https://www.better-auth.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Polar Docs](https://docs.polar.sh/)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

Built with:

- [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- [BetterAuth](https://www.better-auth.com/) - Authentication library
- [Polar](https://polar.sh/) - Subscription platform
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI components

---

**Built with ❤️ for the TypeScript community**
