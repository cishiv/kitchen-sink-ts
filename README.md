# kitchen-sink-ts

A full-stack TypeScript template for shipping MVPs fast. Auth, subscriptions, file uploads, LLM calls, and a markdown blog are wired up out of the box.

## Stack

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Runtime    | Bun                                        |
| Frontend   | React 19, TanStack Router                  |
| Server     | TanStack Start (SSR)                       |
| Build      | Vite 7                                     |
| Database   | PostgreSQL + Drizzle ORM                   |
| Auth       | BetterAuth (email/password + Google OAuth) |
| Payments   | Polar                                      |
| Storage    | Cloudflare R2 (S3-compatible)              |
| LLM        | OpenRouter via Vercel AI SDK               |
| UI         | shadcn/ui + Tailwind CSS 4                 |
| Validation | Zod 4                                      |
| Tests      | Vitest                                     |

## Quickstart

```bash
git clone <your-repo-url>
cd kitchen-sink-ts
bun install
cp .env.example .env
# fill in .env (see below)
bun run db:migrate
bun run dev
```

App runs at http://localhost:3000.

## Environment variables

All vars live in `.env.example`. Group by service:

**Auth (BetterAuth)**

- `BETTER_AUTH_SECRET` — random string, used to sign sessions
- `BETTER_AUTH_URL` — base URL of your app (e.g. `http://localhost:3000`)

**Database**

- `DATABASE_URL` — Postgres connection string

**Google OAuth**

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

**Polar (subscriptions)**

- `POLAR_MODE` — `sandbox` or `production`
- `POLAR_ACCESS_TOKEN`
- `POLAR_SUCCESS_URL` — full URL, e.g. `http://localhost:3000/billing/success`
- `POLAR_WEBHOOK_SECRET`
- `POLAR_THEME` — `dark` or `light`

**Cloudflare R2**

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`

**OpenRouter**

- `OPENROUTER_API_KEY`
- `OPENROUTER_DEFAULT_MODEL` — optional; falls back to `anthropic/claude-sonnet-4.5`

## Scripts

| Command               | Purpose                                            |
| --------------------- | -------------------------------------------------- |
| `bun run dev`         | Dev server on port 3000                            |
| `bun run build`       | Production build (outputs `dist/server/server.js`) |
| `bun run start`       | Run the built server                               |
| `bun run serve`       | Preview the production build                       |
| `bun run test`        | Vitest                                             |
| `bun run lint`        | ESLint                                             |
| `bun run format`      | Prettier                                           |
| `bun run check`       | Format + lint with auto-fix                        |
| `bun run db:generate` | Generate a migration from `src/lib/db/schema.ts`   |
| `bun run db:migrate`  | Apply pending migrations                           |
| `bun run db:push`     | Push schema to DB without a migration (dev only)   |
| `bun run db:studio`   | Open Drizzle Studio                                |

## Deployment

Railway-first. `railway.json` already configures the build (`bun install && bun run build`) and start (`bun run start`) commands and a `/` healthcheck.

Steps:

1. Create a Railway project. Add a Postgres plugin or attach an external Postgres URL. Set `DATABASE_URL`.
2. Set every env var listed above. `BETTER_AUTH_URL` and `POLAR_SUCCESS_URL` must point at the deployed URL, not localhost. Set `POLAR_MODE=production` for live billing.
3. Run migrations against the production DB once: `bun run db:migrate` (Railway's `railway run` works).
4. Configure the Polar webhook to `https://<your-domain>/api/webhooks/polar` with the same secret as `POLAR_WEBHOOK_SECRET`.
5. Configure Cloudflare R2 CORS so direct browser PUTs from your domain succeed.

`PORT` is provided by Railway and respected by the TanStack Start server. Don't hard-code a port.

## Pointers

- For agents working in this repo, see `CLAUDE.md`.
- For the spec workflow, see `SPECIFICATIONS/_WORKFLOW.md`.
- If you want the same features split across a separate backend and frontend, see [kitchen-sink-twotier](https://github.com/cishiv/kitchen-sink-twotier).
