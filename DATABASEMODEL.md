# Database model

> Update this file in a separate commit whenever the database schema changes.
> Run `bun run db:doc` to regenerate the mermaid skeleton from the current
> `src/lib/db/schema.ts`.

## ER diagram

```mermaid
erDiagram
  users ||--o{ sessions : "has"
  users ||--o{ accounts : "has"
  users ||--o{ subscriptions : "has"
  users ||--o{ uploads : "owns"
  subscription_tiers ||--o{ subscriptions : "tier of"

  users {
    text id PK
    text name
    text email UK
    boolean email_verified
    text image
    timestamp created_at
    timestamp updated_at
  }
  sessions {
    text id PK
    timestamp expires_at
    text token UK
    text ip_address
    text user_agent
    text user_id FK
    timestamp created_at
    timestamp updated_at
  }
  accounts {
    text id PK
    text account_id
    text provider_id
    text user_id FK
    text access_token
    text refresh_token
    text id_token
    timestamp access_token_expires_at
    timestamp refresh_token_expires_at
    text scope
    text password
    timestamp created_at
    timestamp updated_at
  }
  verifications {
    text id PK
    text identifier
    text value
    timestamp expires_at
    timestamp created_at
    timestamp updated_at
  }
  subscription_tiers {
    serial id PK
    varchar name UK
    text_array features
    timestamp created_at
    timestamp updated_at
  }
  subscriptions {
    serial id PK
    text user_id FK
    integer subscription_tier_id FK
    varchar polar_subscription_id UK
    varchar polar_customer_id
    varchar polar_product_id
    varchar polar_checkout_id
    varchar customer_email
    varchar customer_name
    varchar customer_external_id
    varchar product_name
    text product_description
    varchar status
    integer amount
    varchar currency
    varchar recurring_interval
    timestamp current_period_start
    timestamp current_period_end
    boolean cancel_at_period_end
    timestamp canceled_at
    varchar cancellation_reason
    text cancellation_comment
    timestamp started_at
    timestamp ends_at
    timestamp ended_at
    jsonb metadata
    timestamp created_at
    timestamp updated_at
  }
  uploads {
    serial id PK
    text user_id FK
    varchar file_name
    varchar file_key UK
    integer file_size
    varchar mime_type
    timestamp created_at
    timestamp updated_at
  }
```

## Tables

### `users`

The application's identity table, owned by BetterAuth. Holds the public profile fields (name, email, image) plus the email-verification flag. Every other domain table that belongs to a user references `users.id` with `ON DELETE CASCADE` on the auth-internal tables and a plain reference elsewhere. New per-user features should add a `user_id text references users(id)` column.

### `sessions`

BetterAuth session storage. One row per active sign-in. The `token` is the cookie value; `expires_at` drives session expiry. `ip_address` and `user_agent` are recorded at creation for audit.

### `accounts`

BetterAuth credential store. Each row is one (provider, accountId) pair belonging to a user. For email/password the row carries the salted password hash in `password`; for any future OAuth provider it carries access/refresh tokens. `provider_id = 'credential'` for email/password.

### `verifications`

BetterAuth's short-lived token store: email-verification links, password-reset tokens, etc. `identifier` is the target (usually the email), `value` is the token, `expires_at` enforces the window.

### `subscription_tiers`

Internal catalog of feature bundles (`name` is unique). `features` is a Postgres `text[]` of feature flag strings the app reads to gate UI and endpoints. Subscriptions optionally reference a tier — Polar is the source of pricing/billing truth, but tier mapping lives here.

### `subscriptions`

Mirror of the user's Polar subscription state. Polar webhooks (`/api/webhooks/polar`) write to this table on `subscription.created`, `subscription.active`, `subscription.updated`, and `subscription.revoked`. The columns split into Polar identity (`polar_*`), denormalized customer/product display fields, billing state (`status`, `amount`, `currency`, `recurring_interval`, `current_period_*`), and cancellation metadata. The app reads `subscriptions` for entitlement decisions instead of calling Polar at request time.

### `uploads`

Index of files stored in Cloudflare R2. `file_key` is the canonical R2 object key (unique). `file_size` and `mime_type` are recorded at presign time and validated at the `/api/uploads/complete` step. View/download endpoints look up by `id`, verify `user_id` ownership, and return short-lived presigned GET URLs.
