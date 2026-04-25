# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack TypeScript application built with TanStack Start (React), BetterAuth for authentication, Drizzle ORM with PostgreSQL, and integrations for Polar (subscriptions) and R2 (file storage). Uses Vite for bundling, shadcn/ui for components, and Tailwind CSS for styling.

## Common Commands

### Development

```bash
pnpm dev              # Start development server on port 3000
pnpm build            # Build for production
pnpm serve            # Preview production build
```

### Testing & Code Quality

```bash
pnpm test             # Run tests with Vitest
pnpm lint             # Lint code with ESLint
pnpm format           # Format code with Prettier
pnpm check            # Format and lint (with auto-fix)
```

### Database

```bash
pnpm drizzle-kit generate    # Generate migrations from schema changes
pnpm drizzle-kit migrate     # Apply migrations to database
pnpm drizzle-kit studio      # Open Drizzle Studio to inspect database
```

Environment variable `DATABASE_URL` must be set (Postgres connection string).

## Architecture

### Authentication Stack (BetterAuth)

- **Server-side auth instance**: `src/lib/auth.ts` - BetterAuth configured with Drizzle adapter, email/password, and Google OAuth
- **Client-side auth**: `src/lib/auth-client.ts` - Client instance for auth operations
- **Auth helpers**: `src/lib/auth-helpers.ts` - Server functions `getAuthUser()` and `requireAuth()` for authentication checks
- **Middleware**: `src/middleware/auth-middleware.ts` - TanStack Start middleware for protecting API routes and server functions
- **Protected routes**: Use the `_protected.tsx` layout route which calls `getAuthUser()` in `beforeLoad` and redirects to `/login` if not authenticated

### Routing (TanStack Router)

- **File-based routing**: Routes defined in `src/routes/` directory
- **Route tree**: Auto-generated in `src/routeTree.gen.ts` (do not edit manually)
- **Protected routes**: Nest under `src/routes/_protected/` directory to inherit authentication checks
- **Router config**: `src/router.tsx` creates the router instance with scroll restoration enabled
- **API routes**: Place in `src/routes/api/` - example at `src/routes/api/user.ts`

### Database (Drizzle ORM + PostgreSQL)

- **Schema**: All table definitions in `src/lib/db/schema.ts`
- **DB instance**: Exported from `src/lib/db/index.ts`
- **Migrations**: Generated in `drizzle/` directory via `drizzle-kit`
- **Schema pattern**: Each table exports:
  - Drizzle table schema (e.g., `users`)
  - Zod select schema (e.g., `selectUserSchema`)
  - Zod insert schema (e.g., `insertUserSchema`)
  - TypeScript types (e.g., `User`, `NewUser`)

**Core tables**:

- `users`, `sessions`, `accounts`, `verifications` - BetterAuth tables
- `subscription_tiers` - Define available subscription tiers and features
- `subscriptions` - Polar subscription data linked to users
- `uploads` - R2 file uploads linked to users

### UI Components (shadcn/ui)

- Located in `src/components/ui/`
- Built on Radix UI primitives with Tailwind styling
- Use `src/lib/utils.ts` for `cn()` utility (class name merging)

### Path Aliases

- `@/*` maps to `src/*` (configured in `tsconfig.json`)
- Use TypeScript imports: `import { type User } from '@/lib/db/schema'`

## Key Patterns

### Server Functions (TanStack Start)

Use `createServerFn()` for server-side operations that need database access or secrets. Example from `auth-helpers.ts`:

```typescript
export const getAuthUser = createServerFn({ method: 'GET' }).handler(
  async ({ request }): Promise<AuthSession | null> => {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session || !session.user) return null
    return session
  },
)
```

**TanStack Start Reference**: For practical examples of TanStack Start patterns and usage, refer to the e2e tests in the official repository: https://github.com/TanStack/router/tree/main/e2e/react-start

### Protected API Routes

Apply `authMiddleware` from `src/middleware/auth-middleware.ts` to protected API endpoints. It validates sessions and adds `user` and `session` to context.

### Authentication Flow

1. **Route protection**: Use `_protected.tsx` layout or call `getAuthUser()` in route `beforeLoad`
2. **API protection**: Use `authMiddleware` for server functions
3. **Redirect after login**: The login route accepts a `redirect` search param to return users to intended destination

## Environment Variables

Required variables (add to `.env`):

- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_CLIENT_ID` - For Google OAuth
- `GOOGLE_CLIENT_SECRET` - For Google OAuth

## TypeScript Configuration

- Strict mode enabled
- Module resolution: Bundler
- Target: ES2022
- Path aliases configured (`@/*`)
