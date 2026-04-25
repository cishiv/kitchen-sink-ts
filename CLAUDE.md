# kitchen-sink-ts — Ways of Working

> Project-wide ways of working and constraints for every contributor —
> human or agent. Read this document before making changes.
> Complements `SPECIFICATIONS/*.md`, which define *what* to build; this
> document defines *how* to build it and what not to touch.

## 0. Hierarchy of Truth

When two sources disagree, resolve in this order:

1. An explicit instruction from the current user turn.
2. `CLAUDE.md` (this document).
3. `SPECIFICATIONS/*.md`.
4. Existing code.
5. Prior assistant messages or external docs.

If a lower source contradicts a higher one, flag it; do not silently
follow the lower source.

## 1. Specs Are The Source of Truth for "What"

- Before implementing anything that the specs describe, re-read the
  relevant spec file.
- If the spec is wrong, outdated, or ambiguous, update the spec in the
  same change that updates the code. Do not leave them out of sync.
- New routes, tables, or modules begin by extending the spec, then the
  implementation.
- The full lifecycle (naming, frontmatter, move-to-implemented) lives in
  `SPECIFICATIONS/HOW_TO_USE_SPECIFICATION.md`. Use
  `SPECIFICATIONS/SPEC_TEMPLATE.md` as the starting point for a new spec.

## Specifications and acceptance criteria

This repo follows a spec-driven workflow. See `SPECIFICATIONS/HOW_TO_USE_SPECIFICATION.md` for the full lifecycle.

Every spec includes an `ACCEPTANCE_CRITERIA` section at the top. Each criterion is a checklist item tagged `[BLOCKING]` or `[NICE_TO_HAVE]` — untagged criteria default to `[BLOCKING]`.

A criterion is verifiable if it reduces to one of:

- A command that exits 0 (e.g. `bun run typecheck`, `bun run test`).
- An HTTP request whose response matches a documented Zod schema.

Build and extend agents loop on the criteria up to 3 attempts each. Failure of a `[BLOCKING]` criterion escalates to the user. Failure of `[NICE_TO_HAVE]` surfaces as a warning.

## 2. Architectural Invariants

These are non-negotiable without an explicit amendment to this document
or an explicit user override.

**Stack**

- Single Bun process running TanStack Start (React 19, Vite 7, SSR).
  File-based routing under `src/routes/`. Path alias `@/*` → `src/*`.
- BetterAuth (email/password) on Drizzle/Postgres. Polar for billing.
  Cloudflare R2 (S3-compatible) for files. OpenRouter via the Vercel
  AI SDK for LLM calls. shadcn/ui (new-york, neutral) on Tailwind 4.
- Zod 4. `verbatimModuleSyntax`. Always type-only imports for types.
- Package manager is **Bun**. Scripts wrap CLIs with `bun --bun` so they
  execute under Bun's runtime regardless of system Node.

**Server (route handlers + server functions)**

- API routes live under `src/routes/api/`. Auth-gated handlers apply
  `authMiddleware` and read `context.user` / `context.session`.
- Validate request bodies with Zod *before* touching the DB. Surface
  Zod errors via `error.issues` (Zod 4).
- Domain logic does not import from `src/components/`. UI does not
  import from `src/routes/api/`.
- Adapters (`src/lib/adapters/*.adapter.ts`) convert raw DB rows into
  public types before returning to the client.

**Client**

- Server Components by default. Mark a file `'use client'` only when
  interactivity is required (`useState`, `useEffect`, event handlers,
  `authClient.useSession`).
- `src/components/ui/` is for shadcn primitives only. Domain components
  live alongside their feature.
- Every request goes through `authClient` or a typed fetcher in
  `src/lib/`. No ad-hoc `fetch()` calls.

**Lazy-init for env-dependent SDKs**

- Any SDK that needs env vars to construct must be lazy-initialised:
  read env inside a getter, build on first use, cache in module scope.
  See `src/lib/r2.ts` for the canonical pattern.
- The app must boot even when integration env vars are missing —
  failures only surface when the integration is actually called.

## 3. Changes Are Surgical

- Touch only what the task requires.
- Do not reformat, rename, or "improve" adjacent code.
- Match existing style even if you would do it differently.
- If you notice unrelated dead code or bugs, mention them in the
  response — do not silently fix them.
- Remove orphans *your* change created. Leave pre-existing dead code
  alone.
- Every changed line must trace to the stated task.

## 4. Simplicity Over Cleverness

- Minimum code that solves the problem.
- No speculative abstractions. No configuration no one asked for.
  No error handling for impossible branches.
- If a senior engineer would call it overcomplicated, it is.
- Prefer boring, well-understood tools over novel ones.

## 5. Surface Assumptions, Don't Hide Them

Before implementing a non-trivial task:

- State assumptions explicitly in the response.
- If there are multiple reasonable interpretations, present them and
  let the user pick. Do not silently choose.
- If requirements are unclear, stop and ask.
- If a simpler alternative exists, say so before writing the complex
  one.

The cost of asking a clarifying question is much lower than the cost
of rewriting a misbuilt feature.

## 6. Goal-Driven Execution

Every task has a verifiable success criterion. Translate vague asks
into concrete ones:

- "Add validation" → "Invalid input returns 400 with the Zod issue
  shape; test covers it."
- "Fix the bug" → "Write a failing test that reproduces it; make it
  pass."
- "Refactor X" → "Tests pass before and after; public API unchanged."

For multi-step tasks, write the plan down (as a TODO list or in-message
plan) before starting, and check off each step.

## 7. Tests

- Bug fixes start with a failing test.
- `bun run lint` and `bun run check` must pass.
- Do not skip or `.only` tests in committed code.

## 8. Secrets & Config

- No secrets in the repo. Ever. `.env` files are gitignored; only
  `.env.example` is committed.
- The client bundle receives only `VITE_`-prefixed values. Anything
  there is effectively public.
- New config values are added to `.env.example` in the same commit
  that introduces their consumer.

## 9. Commits & Pull Requests

- Conventional-ish commit style: `feat(routes): ...`, `fix(lib): ...`,
  `chore(db): ...`, `docs: ...`.
- Commit messages explain the *why*, not the *what*. The diff is the
  *what*.
- One logical change per commit where reasonable.

## 10. Agent-Specific Rules

These apply to AI coding agents operating in this repo.

- **Read before writing.** Before editing a file, read it. Before
  editing a module, skim the whole module.
- **Never create files unless necessary.** Prefer editing existing
  files. No tutorial-style markdown files unless explicitly asked.
- **Don't narrate in code comments.** Comments explain non-obvious
  intent, trade-offs, or constraints — never the change itself.
- **Don't announce tool use.** Just use the tools.
- **Don't cite this document or the specs in user-facing responses.**
  Apply them.
- **Fail loudly.** If an instruction would violate this document, say
  so and ask. Do not silently comply and hope no one notices.
- **When uncertain, stop.** Ask the user rather than guessing at
  architecture or naming.

## 11. Amending This Document

This document is not a ceiling; it is a ratchet. Changes to it:

1. Happen in a dedicated commit (or co-located with the work that
   motivates them).
2. Explain the change in the commit body, not just the diff.
3. Are made by the user, or proposed by an agent and approved by the
   user.

If you (an agent) believe a rule here is wrong or obstructing the
task, raise it in the response before taking action that contradicts
it.

<!-- AGENT-WRITABLE BELOW -->

# Reference

> The content below this divider is regenerated by the build/extend skills
> when file map, recipes, or golden paths change. Hand-edits are fine,
> but expect them to be reconciled the next time a feature ships.

## File map

| Concept                          | Path                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------- |
| Server auth instance             | `src/lib/auth.ts`                                                               |
| Client auth instance             | `src/lib/auth-client.ts`                                                        |
| Auth helpers (server fns)        | `src/lib/auth-helpers.ts` — `getServerAuthUser`, `requireAuth`, `AuthSession`   |
| Auth middleware (API routes)     | `src/middleware/auth-middleware.ts` — `authMiddleware`, `AuthContext`           |
| Auth catch-all handler           | `src/routes/api/auth/$.ts`                                                      |
| DB client (lazy-init)            | `src/lib/db/index.ts`                                                           |
| DB schema (all tables)           | `src/lib/db/schema.ts`                                                          |
| Drizzle config                   | `drizzle.config.ts`                                                             |
| Migrations                       | `drizzle/`                                                                      |
| R2 storage (lazy-init)           | `src/lib/r2.ts`                                                                 |
| Polar SDK client (lazy-init)     | `src/lib/polar.ts`                                                              |
| Polar webhook handler            | `src/routes/api/webhooks/polar.ts`                                              |
| OpenRouter helpers (lazy-init)   | `src/lib/openrouter.ts`                                                         |
| AI completion endpoint           | `src/routes/api/ai/complete.ts`                                                 |
| Upload endpoints                 | `src/routes/api/uploads/*`                                                      |
| Adapters (DB row → public)       | `src/lib/adapters/*.adapter.ts`                                                 |
| Public types                     | `src/lib/types.ts`                                                              |
| Blog loader                      | `src/lib/blog.ts`                                                               |
| Blog content                     | `src/content/blog/*.md`                                                         |
| SEO meta helper                  | `src/lib/seo.ts`                                                                |
| Root layout                      | `src/routes/__root.tsx`                                                         |
| Protected layout                 | `src/routes/_protected.tsx`                                                     |
| shadcn primitives                | `src/components/ui/*`                                                           |
| Vite config                      | `vite.config.ts`                                                                |
| Railway deploy config            | `railway.json`                                                                  |
| Database model                   | `DATABASEMODEL.md`                                                              |
| Spec workflow                    | `SPECIFICATIONS/HOW_TO_USE_SPECIFICATION.md`                                    |

## Commands

| Command               | Purpose                                               |
| --------------------- | ----------------------------------------------------- |
| `bun run dev`         | Vite dev server on port 3000                          |
| `bun run build`       | Production build (outputs to `dist/server/server.js`) |
| `bun run start`       | `bun dist/server/server.js` — serve the built app     |
| `bun run test`        | Vitest                                                |
| `bun run check`       | Prettier write + ESLint --fix (run before committing) |
| `bun run db:generate` | Generate migrations from `src/lib/db/schema.ts`       |
| `bun run db:migrate`  | Apply pending migrations                              |
| `bun run db:studio`   | Open Drizzle Studio                                   |
| `bun run db:doc`      | Print a mermaid skeleton of the current schema        |

## Recipes

### Add a public page

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

### Add a protected page

Place the file under `src/routes/_protected/`. The `_protected.tsx` layout already calls `getServerAuthUser` in `beforeLoad` and redirects to `/login?redirect=...` if there's no session.

### Add an auth-gated API route

```ts
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { authMiddleware, type AuthContext } from '@/middleware/auth-middleware'
import { db } from '@/lib/db'
import { widgets } from '@/lib/db/schema'

const bodySchema = z.object({ name: z.string().min(1) })

export const Route = createFileRoute('/api/widgets/')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({ context, request }: { context: AuthContext; request: Request }) => {
        const { name } = bodySchema.parse(await request.json())
        const [row] = await db
          .insert(widgets)
          .values({ userId: context.user.id, name })
          .returning()
        return Response.json(row, { status: 201 })
      },
    },
  },
})
```

### Add a database table

1. Append the Drizzle table to `src/lib/db/schema.ts`, plus `createSelectSchema` / `createInsertSchema` and the `$inferSelect` / `$inferInsert` types.
2. `bun run db:generate` (creates a SQL file in `drizzle/`).
3. Review the generated SQL.
4. `bun run db:migrate`.
5. Update `DATABASEMODEL.md` in a separate commit.

### Add a shadcn component

```bash
bunx --bun shadcn@latest add <component>
```

Components install into `src/components/ui/` per `components.json`.

## Golden paths

### Auth

1. User submits `/signup` or `/login` (`src/routes/signup.tsx`, `src/routes/login.tsx`) which calls `authClient.signIn.email` / `signUp.email` from `src/lib/auth-client.ts`.
2. BetterAuth handles the request through the catch-all at `src/routes/api/auth/$.ts`, which delegates to `auth.handler(request)` from `src/lib/auth.ts`.
3. The session lives in a cookie; `authClient.useSession()` reads it on the client, `auth.api.getSession({ headers })` on the server.
4. Protected routes (`src/routes/_protected.tsx`) call `getServerAuthUser` in `beforeLoad`. If null, they `throw redirect({ to: '/login', search: { redirect } })`.
5. API routes apply `authMiddleware` and read `context.user`.
6. Logout: `authClient.signOut()` (see `src/components/Header.tsx`, `src/components/nav-user.tsx`).

### Subscription

1. Public `src/routes/pricing.tsx` and authenticated `src/routes/_protected/billing.tsx` render `<ProductsGrid />` (`src/components/ProductsGrid.tsx`).
2. `ProductsGrid` fetches products via the Polar SDK (`src/lib/polar.ts`) inside a server function.
3. Subscribe button hits `GET /api/billing/checkout?products=<id>&customerExternalId=<userId>`. The handler is the `Checkout(...)` adapter from `@polar-sh/tanstack-start`.
4. Polar redirects to `POLAR_SUCCESS_URL` → `src/routes/_protected/billing.success.tsx`.
5. Polar fires webhooks to `/api/webhooks/polar` (`src/routes/api/webhooks/polar.ts`). `subscription.*` events write to the `subscriptions` table.
6. Cancel/reinstate via `src/components/SubscriptionActionButton.tsx` → `POST /api/billing/subscription`.

### Upload

1. `FileUploadZone` (`src/components/FileUploadZone.tsx`) `POST`s `{ fileName, fileSize, mimeType }` to `/api/uploads/presigned-url`.
2. Handler validates against `ALLOWED_MIME_TYPES` and `MAX_FILE_SIZE`, calls `generatePresignedUploadUrl` (`src/lib/r2.ts`), and returns `{ presignedUrl, fileKey }`.
3. Client `PUT`s the file to `presignedUrl`.
4. Client `POST`s `{ fileKey, fileName, fileSize, mimeType }` to `/api/uploads/complete`, which inserts the `uploads` row.
5. View/download routes verify ownership and return short-lived presigned GET URLs.

### LLM call

1. Client `POST`s `{ prompt, model? }` to `/api/ai/complete` (`src/routes/api/ai/complete.ts`).
2. `authMiddleware` validates the session.
3. Handler calls `complete({ prompt, model })` from `src/lib/openrouter.ts`, which resolves the model via `getModel(modelId || getDefaultModelId())` and calls `generateText` from `ai`.
4. Use `completeStructured` for schema-constrained output (uses `generateObject`).

## Gotchas

- **Zod 4 is required.** BetterAuth's internals use Zod 4 APIs. Use `error.issues` (not `error.errors`).
- **`bun --bun` wrapping in scripts is load-bearing.** Some CLIs (`vitest`, `eslint`, `drizzle-kit`) misbehave under stale Node when invoked via Bun without `--bun`.
- **Build output path.** `bun run build` emits `dist/server/server.js`. `bun run start` runs that file.
- **`useSession()` is client-only.** Server-side, use `getServerAuthUser` from `src/lib/auth-helpers.ts`.
- **`db:doc` is a stub.** It prints a mermaid skeleton from current schema metadata. Hand-edit `DATABASEMODEL.md` for prose.
