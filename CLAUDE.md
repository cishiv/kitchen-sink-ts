# CLAUDE.md

Agent reference for the kitchen-sink-ts template. Optimized for skim. File paths are absolute relative to the repo root.

## Orientation

TanStack Start (React 19, Vite 7, SSR) + Bun runtime. BetterAuth (email/password + Google OAuth) on Drizzle/Postgres. Polar for subscription billing. Cloudflare R2 (S3-compatible) for file storage. OpenRouter via the Vercel AI SDK for LLM calls. shadcn/ui (new-york, neutral) on Tailwind 4. File-based routing under `src/routes/`. Path alias `@/*` → `src/*`. Zod 4. `verbatimModuleSyntax`-style imports throughout. The package manager is Bun and scripts wrap CLIs with `bun --bun`.

## File map

| Concept                          | Path                                                                                                                                                                    |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server auth instance             | `src/lib/auth.ts`                                                                                                                                                       |
| Client auth instance             | `src/lib/auth-client.ts`                                                                                                                                                |
| Auth helpers (server functions)  | `src/lib/auth-helpers.ts` — `getServerAuthUser`, `requireAuth`, `AuthSession`                                                                                           |
| Auth middleware (API routes)     | `src/middleware/auth-middleware.ts` — `authMiddleware`, `AuthContext`                                                                                                   |
| Auth catch-all handler           | `src/routes/api/auth/$.ts`                                                                                                                                              |
| DB client                        | `src/lib/db/index.ts`                                                                                                                                                   |
| DB schema (all tables)           | `src/lib/db/schema.ts`                                                                                                                                                  |
| Drizzle config                   | `drizzle.config.ts`                                                                                                                                                     |
| Migrations                       | `drizzle/`                                                                                                                                                              |
| R2 storage (lazy-init)           | `src/lib/r2.ts` — `generatePresignedUploadUrl`, `generatePresignedDownloadUrl`, `deleteObject`                                                                          |
| Polar SDK client                 | `src/lib/polar.ts` — exports `api`                                                                                                                                      |
| Polar webhook handler            | `src/routes/api/webhooks/polar.ts`                                                                                                                                      |
| Polar checkout endpoint          | `src/routes/api/billing/checkout.ts`                                                                                                                                    |
| Subscription cancel/reinstate    | `src/routes/api/billing/subscription.ts`                                                                                                                                |
| OpenRouter LLM helpers           | `src/lib/openrouter.ts` — `openrouter`, `getModel`, `getDefaultModelId`, `complete`, `completeStructured`                                                               |
| AI completion endpoint           | `src/routes/api/ai/complete.ts`                                                                                                                                         |
| Upload presign endpoint          | `src/routes/api/uploads/presigned-url.ts`                                                                                                                               |
| Upload finalize endpoint         | `src/routes/api/uploads/complete.ts`                                                                                                                                    |
| Upload list endpoint             | `src/routes/api/uploads/index.ts`                                                                                                                                       |
| Upload view URL                  | `src/routes/api/uploads/$id/view.ts`                                                                                                                                    |
| Upload download URL              | `src/routes/api/uploads/$id/download.ts`                                                                                                                                |
| Upload delete                    | `src/routes/api/uploads/$id/index.ts` (DELETE)                                                                                                                          |
| Sample auth-gated API            | `src/routes/api/user.ts`                                                                                                                                                |
| Adapters (DB row → public types) | `src/lib/adapters/subscription.adapter.ts`, `src/lib/adapters/user.adapter.ts`                                                                                          |
| Public types                     | `src/lib/types.ts` — `UserSubscription`, `UserDetails`                                                                                                                  |
| Blog loader (markdown + slug)    | `src/lib/blog.ts` — `getAllBlogPosts`, `getBlogPost`, `BlogPost`, `BlogPostPreview`, `BlogPostFrontmatter`                                                              |
| Blog content                     | `src/content/blog/*.md`                                                                                                                                                 |
| SEO meta helper                  | `src/lib/seo.ts` — `seo({ title, description, image, keywords })`                                                                                                       |
| Root layout                      | `src/routes/__root.tsx`                                                                                                                                                 |
| Protected layout                 | `src/routes/_protected.tsx` (redirects to `/login` when unauthenticated)                                                                                                |
| Protected pages                  | `src/routes/_protected/dashboard.tsx`, `src/routes/_protected/billing.tsx`, `src/routes/_protected/billing.success.tsx`                                                 |
| Public pages                     | `src/routes/index.tsx`, `src/routes/login.tsx`, `src/routes/signup.tsx`, `src/routes/pricing.tsx`, `src/routes/faq.tsx`, `src/routes/dpa.tsx`, `src/routes/privacy.tsx` |
| Blog routes                      | `src/routes/blog/index.tsx`, `src/routes/blog/$slug.tsx`                                                                                                                |
| Header / Footer                  | `src/components/Header.tsx`, `src/components/Footer.tsx`                                                                                                                |
| Sidebar (protected layout)       | `src/components/app-sidebar.tsx`, `src/components/nav-user.tsx`                                                                                                         |
| Subscription UI                  | `src/components/UserSubscription.tsx`, `src/components/SubscriptionActionButton.tsx`, `src/components/ProductsGrid.tsx`                                                 |
| Upload UI                        | `src/components/FileUploadZone.tsx`, `src/components/UploadsTable.tsx`                                                                                                  |
| shadcn primitives                | `src/components/ui/*`                                                                                                                                                   |
| `cn()` utility                   | `src/lib/utils.ts`                                                                                                                                                      |
| shadcn config                    | `components.json`                                                                                                                                                       |
| Router builder                   | `src/router.tsx`                                                                                                                                                        |
| Generated route tree             | `src/routeTree.gen.ts` (do not edit)                                                                                                                                    |
| Vite config                      | `vite.config.ts`                                                                                                                                                        |
| TS config (path alias)           | `tsconfig.json`                                                                                                                                                         |
| Railway deploy config            | `railway.json`                                                                                                                                                          |
| Env example                      | `.env.example`                                                                                                                                                          |
| Spec workflow                    | `SPECIFICATIONS/_WORKFLOW.md`                                                                                                                                           |

## Commands

All scripts live in `package.json` and wrap their CLIs with `bun --bun` so they execute under Bun's runtime regardless of the system Node version.

| Command               | Purpose                                               |
| --------------------- | ----------------------------------------------------- |
| `bun run dev`         | Vite dev server on port 3000                          |
| `bun run build`       | Production build (outputs to `dist/server/server.js`) |
| `bun run start`       | `bun dist/server/server.js` — serve the built app     |
| `bun run serve`       | Vite preview of the production build                  |
| `bun run test`        | Vitest (passes with no tests)                         |
| `bun run lint`        | ESLint                                                |
| `bun run format`      | Prettier                                              |
| `bun run check`       | Prettier write + ESLint --fix (run before committing) |
| `bun run db:generate` | Generate migrations from `src/lib/db/schema.ts`       |
| `bun run db:migrate`  | Apply pending migrations                              |
| `bun run db:push`     | Push schema to DB without a migration (dev only)      |
| `bun run db:studio`   | Open Drizzle Studio                                   |

`DATABASE_URL` must be set for any `db:*` command.

## Conventions

- Path alias: `@/*` → `src/*`. Always import via `@/...`.
- Type-only imports: `import { type Foo } from '@/lib/db/schema'` (`verbatimModuleSyntax`).
- Functional code only. No class hierarchies. Small, named, single-purpose functions. Multi-arg functions take a single typed object.
- Explicit return types on exported functions, including server functions and route handlers.
- Drizzle table pattern in `src/lib/db/schema.ts`:
  ```ts
  export const widgets = pgTable('widgets', {
    /* ... */
  })
  export const selectWidgetSchema = createSelectSchema(widgets)
  export const insertWidgetSchema = createInsertSchema(widgets, {
    /* refinements */
  })
  export type Widget = typeof widgets.$inferSelect
  export type NewWidget = typeof widgets.$inferInsert
  ```
- Server functions: `createServerFn({ method: 'GET' | 'POST' }).handler(async () => { /* ... */ })`. Add `.inputValidator(...)` to validate inputs.
- API routes: `createFileRoute('/api/...')({ server: { middleware: [...], handlers: { GET/POST/...: async ({ context, request, params }) => { ... } } } })`.
- Auth-gated APIs apply `authMiddleware`. The handler reads `context.user` and `context.session` (`AuthContext`).
- Validate request bodies with Zod. Project is on Zod 4 — surface validation errors via `error.issues` (not `error.errors`).
- Server Components by default; mark client files with `'use client'` only when interactivity is required (`useState`, `useEffect`, event handlers, `authClient.useSession`).
- Adapter pattern: convert raw DB rows to public types in `src/lib/adapters/*.adapter.ts` before returning to the client.
- Lazy-init for env-dependent SDKs (see "Lazy-init pattern" below).

## Recipes

### 1. Add a public page

Create `src/routes/<name>.tsx`. The route tree regenerates automatically.

```tsx
import { createFileRoute } from '@tanstack/react-router'
import type { JSX } from 'react'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/about')({
  head: () => ({ meta: seo({ title: 'About', description: '...' }) }),
  component: AboutPage,
})

function AboutPage(): JSX.Element {
  return <div>About</div>
}
```

### 2. Add a protected page

Place the file under `src/routes/_protected/`. The `_protected.tsx` layout already calls `getServerAuthUser` in `beforeLoad` and redirects to `/login?redirect=...` if there's no session.

```tsx
// src/routes/_protected/widgets.tsx
import { createFileRoute } from '@tanstack/react-router'
import type { JSX } from 'react'

export const Route = createFileRoute('/_protected/widgets')({
  component: WidgetsPage,
})

function WidgetsPage(): JSX.Element {
  return <div>Widgets</div>
}
```

### 3. Add a server function (loader-style data fetch)

```ts
// in a route file
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '@/lib/db'
import { widgets } from '@/lib/db/schema'

const getWidget = createServerFn({ method: 'GET' })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const [row] = await db.select().from(widgets).where(eq(widgets.id, id))
    return row ?? null
  })

export const Route = createFileRoute('/widgets/$id')({
  loader: async ({ params }) => ({
    widget: await getWidget({ data: params.id }),
  }),
  component: WidgetView,
})
```

### 4. Add a public API route

```ts
// src/routes/api/widgets/index.ts
import { createFileRoute } from '@tanstack/react-router'
import { db } from '@/lib/db'
import { widgets } from '@/lib/db/schema'

export const Route = createFileRoute('/api/widgets/')({
  server: {
    handlers: {
      GET: async () => {
        const rows = await db.select().from(widgets)
        return Response.json(rows)
      },
    },
  },
})
```

### 5. Add an auth-gated API route

```ts
// src/routes/api/widgets/index.ts
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import type { AuthContext } from '@/middleware/auth-middleware'
import { authMiddleware } from '@/middleware/auth-middleware'
import { db } from '@/lib/db'
import { widgets } from '@/lib/db/schema'

const bodySchema = z.object({ name: z.string().min(1) })

export const Route = createFileRoute('/api/widgets/')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({
        context,
        request,
      }: {
        context: AuthContext
        request: Request
      }) => {
        try {
          const body = await request.json()
          const { name } = bodySchema.parse(body)
          const [row] = await db
            .insert(widgets)
            .values({ userId: context.user.id, name })
            .returning()
          return Response.json(row, { status: 201 })
        } catch (error) {
          if (error instanceof z.ZodError) {
            return Response.json({ error: error.issues }, { status: 400 })
          }
          return Response.json({ error: 'Failed' }, { status: 500 })
        }
      },
    },
  },
})
```

### 6. Add a database table

1. Append to `src/lib/db/schema.ts`:
   ```ts
   export const widgets = pgTable('widgets', {
     id: serial('id').primaryKey(),
     userId: text('user_id')
       .references(() => users.id)
       .notNull(),
     name: varchar('name', { length: 255 }).notNull(),
     createdAt: timestamp('created_at').defaultNow().notNull(),
     updatedAt: timestamp('updated_at').defaultNow().notNull(),
   })
   export const selectWidgetSchema = createSelectSchema(widgets)
   export const insertWidgetSchema = createInsertSchema(widgets, {
     name: (schema) => schema.min(1, 'Name cannot be empty'),
   })
   export type Widget = typeof widgets.$inferSelect
   export type NewWidget = typeof widgets.$inferInsert
   ```
2. `bun run db:generate` (creates a SQL file in `drizzle/`).
3. Review the generated SQL.
4. `bun run db:migrate`.

### 7. Gate a feature behind an active subscription

Read the user's subscription from the DB. Match the same query used by `src/components/UserSubscription.tsx`:

```ts
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'

async function hasActiveSubscription(userId: string): Promise<boolean> {
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(
      and(eq(subscriptions.userId, userId), eq(subscriptions.status, 'active')),
    )
    .limit(1)
  return Boolean(sub)
}
```

Use it inside an auth-gated handler (`context.user.id`) or a server function (after `getServerAuthUser`). Return 402/403 or feature-flag the UI based on the result.

### 8. Add an LLM call (text + structured)

`src/lib/openrouter.ts` exports the helpers. Default model is `OPENROUTER_DEFAULT_MODEL` or falls back to `anthropic/claude-sonnet-4.5`.

```ts
import { complete, completeStructured } from '@/lib/openrouter'
import { z } from 'zod'

const { text } = await complete({ prompt: 'Summarize this...', system: '...' })

const { object } = await completeStructured({
  prompt: 'Extract fields from: ...',
  schema: z.object({ title: z.string(), tags: z.array(z.string()) }),
})
```

For an HTTP endpoint, mirror `src/routes/api/ai/complete.ts` (auth-gated, Zod-validated body, returns JSON).

### 9. Add a file upload feature

The flow is presign → PUT → complete. Reuse the existing endpoints:

- `POST /api/uploads/presigned-url` with `{ fileName, fileSize, mimeType }` → `{ presignedUrl, fileKey }`
- `PUT presignedUrl` with the file body and `Content-Type: <mimeType>`
- `POST /api/uploads/complete` with `{ fileKey, fileName, fileSize, mimeType }` → DB row

Client reference: `src/components/FileUploadZone.tsx`. Server reference: `src/routes/api/uploads/presigned-url.ts`, `src/routes/api/uploads/complete.ts`.

To customize allowed MIME types or max size, edit `MAX_FILE_SIZE` and `ALLOWED_MIME_TYPES` in `src/routes/api/uploads/presigned-url.ts`.

To attach files to a different domain object (not the generic `uploads` table), call `generatePresignedUploadUrl` and `generatePresignedDownloadUrl` directly from `@/lib/r2` and write your own DB row.

### 10. Handle a new Polar webhook event

Edit `src/routes/api/webhooks/polar.ts`. Add a `case` for the new `payload.type` inside the switch, wrap the handler in `withErrorHandling`, and write a `handleX(data)` function next to the existing ones. The webhook is verified using `POLAR_WEBHOOK_SECRET` by `Webhooks()` from `@polar-sh/tanstack-start`.

### 11. Add a shadcn/ui component

```bash
bunx --bun shadcn@latest add <component>
```

Components install into `src/components/ui/` per `components.json`.

## Golden paths

### Auth

1. User submits `/signup` or `/login` (`src/routes/signup.tsx`, `src/routes/login.tsx`) which calls `authClient.signIn.email` / `signUp.email` from `src/lib/auth-client.ts`.
2. Google OAuth is triggered via `authClient.signIn.social({ provider: 'google' })`.
3. BetterAuth handles the request through the catch-all at `src/routes/api/auth/$.ts`, which delegates to `auth.handler(request)` from `src/lib/auth.ts`.
4. The session lives in a cookie; `authClient.useSession()` reads it on the client, `auth.api.getSession({ headers })` on the server.
5. Protected routes (`src/routes/_protected.tsx`) call `getServerAuthUser` in `beforeLoad`. If null, they `throw redirect({ to: '/login', search: { redirect } })`.
6. API routes apply `authMiddleware` and read `context.user`.
7. Logout: `authClient.signOut()` (see `src/components/Header.tsx`, `src/components/nav-user.tsx`).

### Subscription

1. Public `src/routes/pricing.tsx` and authenticated `src/routes/_protected/billing.tsx` render `<ProductsGrid />` (`src/components/ProductsGrid.tsx`).
2. `ProductsGrid` fetches products via the Polar SDK (`src/lib/polar.ts`) inside a server function and filters out the user's current subscription.
3. Subscribe button hits `GET /api/billing/checkout?products=<id>&customerExternalId=<userId>`. The handler is the `Checkout(...)` adapter from `@polar-sh/tanstack-start` — see `src/routes/api/billing/checkout.ts`.
4. Polar redirects the user to the success URL (`POLAR_SUCCESS_URL`) → `src/routes/_protected/billing.success.tsx`.
5. Polar fires webhooks to `/api/webhooks/polar` (`src/routes/api/webhooks/polar.ts`). `subscription.created` / `subscription.active` / `subscription.updated` / `subscription.revoked` write to the `subscriptions` table. User matching: `customerExternalId` first, then `customer.email`.
6. The user's subscription card (`src/components/UserSubscription.tsx`) reads from `subscriptions` and shows cancel/reinstate via `src/components/SubscriptionActionButton.tsx`, which `POST`s to `/api/billing/subscription` (`src/routes/api/billing/subscription.ts`) and updates Polar via the SDK.

### Upload

1. `FileUploadZone` (`src/components/FileUploadZone.tsx`) `POST`s `{ fileName, fileSize, mimeType }` to `/api/uploads/presigned-url`.
2. The handler validates against `ALLOWED_MIME_TYPES` and `MAX_FILE_SIZE`, builds a key as `${userId}/${Date.now()}-${fileName}`, calls `generatePresignedUploadUrl` (`src/lib/r2.ts`), and returns `{ presignedUrl, fileKey }`.
3. Client `PUT`s the file to `presignedUrl` with the correct `Content-Type` (uses `XMLHttpRequest` for progress).
4. Client `POST`s `{ fileKey, fileName, fileSize, mimeType }` to `/api/uploads/complete`, which validates with `insertUploadSchema` and inserts the `uploads` row.
5. View/download routes (`src/routes/api/uploads/$id/view.ts`, `download.ts`) verify ownership and return short-lived presigned GET URLs (inline vs attachment).

### LLM call

1. Client `POST`s `{ prompt, model? }` to `/api/ai/complete` (`src/routes/api/ai/complete.ts`).
2. `authMiddleware` validates the session.
3. The handler validates with Zod, calls `complete({ prompt, model })` from `src/lib/openrouter.ts`.
4. `complete` resolves the model via `getModel(modelId || getDefaultModelId())`, calls `generateText` from `ai` against the OpenRouter provider, returns `{ text, modelId }`.
5. Use `completeStructured` for schema-constrained output (uses `generateObject`).

## Lazy-init pattern for env-dependent modules

`src/lib/r2.ts` is the canonical example. Env vars are read inside `getR2Config()`, the `S3Client` is built on first use and cached in module-scope variables. This keeps the app booting even when R2 env vars are missing — failures only surface when an upload endpoint is actually called.

Apply the same pattern to any new SDK that needs env at construction time:

```ts
let cached: Client | null = null
const getClient = (): Client => {
  if (cached) return cached
  cached = new Client({ apiKey: requireEnv('FOO_API_KEY') })
  return cached
}
```

`src/lib/polar.ts` and `src/lib/openrouter.ts` instantiate at import time today — that's acceptable because their constructors don't throw when env vars are missing (they fail at request time). If you swap in an SDK that throws on construction, port it to the lazy-init pattern.

## Gotchas

- **Zod 4 is required.** BetterAuth's internals use Zod 4 APIs. Use `error.issues` (not `error.errors`).
- **`bun --bun` wrapping in scripts is load-bearing.** Some CLIs (`vitest`, `eslint`, `drizzle-kit`) misbehave under stale Node when invoked via Bun without `--bun`. Don't strip the prefix.
- **Build output path.** `bun run build` emits `dist/server/server.js`. `bun run start` runs that file. There is no `.output/`.
- **shadcn lint noise.** Files in `src/components/ui/` and a few wrappers (e.g. `src/lib/polar.ts`, `src/routes/api/billing/*`, `src/routes/_protected/billing*.tsx`, `src/routes/api/webhooks/polar.ts`, `src/components/UserSubscription.tsx`, `src/components/ProductsGrid.tsx`) carry `/* eslint-disable @typescript-eslint/no-unnecessary-condition */`. This is a known false-positive in the generated/SDK-shaped code — leave the disables in place.
- **`useSession()` is client-only.** Server-side, use `getServerAuthUser` from `src/lib/auth-helpers.ts`.
- **Polar checkout URL.** The Subscribe button URL is `?products=<productId>&customerExternalId=<userId>`. Without `customerExternalId`, the webhook can't link the subscription to a user reliably (it falls back to email).
- **Header/Footer visibility.** `src/routes/__root.tsx` hides `<Header />` and `<Footer />` when a session exists; the protected layout renders its own sidebar via `src/components/app-sidebar.tsx`.
- **Drizzle dev URL log.** `drizzle.config.ts` logs `DATABASE_URL` at startup — it's intentional for migration debugging.

## Specifications workflow

New features start as a markdown spec under `SPECIFICATIONS/NOT_YET_IMPLEMENTED/`, get moved to `SPECIFICATIONS/IMPLEMENTED/` with the `IMPLEMENTED_` prefix in a separate commit once shipped. Full process: `SPECIFICATIONS/_WORKFLOW.md`.
