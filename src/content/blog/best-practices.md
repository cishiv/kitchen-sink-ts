---
title: "Best Practices for Building with Kitchen Sink"
description: "Learn the recommended patterns and best practices for building scalable applications with Kitchen Sink."
published: "2025-02-10"
author: "Kitchen Sink Team"
tags: ["best-practices", "architecture", "typescript"]
---

# Best Practices for Building with Kitchen Sink

Building on top of Kitchen Sink gives you a solid foundation, but following these best practices will help you create maintainable, scalable applications.

## Project Structure

### Keep Routes Focused

Each route should have a single responsibility. Break complex pages into smaller components.

```typescript
// Good: Focused route component
export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div>
      <DashboardHeader />
      <DashboardStats />
      <DashboardActivity />
    </div>
  )
}
```

### Organize by Feature

Group related components, hooks, and utilities by feature rather than by type.

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   └── billing/
│       ├── components/
│       ├── hooks/
│       └── utils/
```

## Database Best Practices

### Always Use Transactions

When making multiple related database changes, wrap them in a transaction:

```typescript
import { db } from '@/lib/db'

await db.transaction(async (tx) => {
  await tx.insert(users).values(newUser)
  await tx.insert(profiles).values(newProfile)
})
```

### Type Your Queries

Take advantage of Drizzle's type safety:

```typescript
// Explicit typing ensures safety
const users: User[] = await db.select().from(usersTable)
```

### Use Prepared Statements

For frequently executed queries, use prepared statements:

```typescript
const getUserById = db.query.users.findFirst({
  where: eq(users.id, sql.placeholder('id')),
}).prepare()

const user = await getUserById.execute({ id: userId })
```

## Authentication Patterns

### Server-Side Auth Checks

Always verify authentication on the server:

```typescript
export const protectedAction = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // context.user is guaranteed to exist here
    const userId = context.user.id
    // ... your logic
  })
```

### Redirect Authenticated Users

Prevent authenticated users from accessing login/signup pages:

```typescript
export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const user = await getServerAuthUser()
    if (user) {
      throw redirect({ to: '/dashboard' })
    }
  },
})
```

## Performance Optimization

### Use React Query for Data Fetching

Leverage TanStack Query for caching and automatic refetching:

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
})
```

### Implement Pagination

Don't fetch all records at once:

```typescript
const posts = await db
  .select()
  .from(postsTable)
  .limit(20)
  .offset(page * 20)
  .orderBy(desc(postsTable.createdAt))
```

### Optimize Images

Use modern image formats and proper sizing:

```typescript
<img
  src={`/uploads/${imageKey}`}
  alt="Description"
  loading="lazy"
  width={800}
  height={600}
/>
```

## Error Handling

### Use Try-Catch Blocks

Always handle potential errors gracefully:

```typescript
export const createPost = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    try {
      const post = await db.insert(posts).values({
        ...data,
        authorId: context.user.id,
      })
      return { success: true, post }
    } catch (error) {
      console.error('Failed to create post:', error)
      return { success: false, error: 'Failed to create post' }
    }
  })
```

### Provide User Feedback

Use toast notifications for user actions:

```typescript
import { toast } from 'sonner'

async function handleSubmit() {
  try {
    await createPost(data)
    toast.success('Post created successfully!')
  } catch (error) {
    toast.error('Failed to create post')
  }
}
```

## Type Safety

### Use Zod for Validation

Validate all user input with Zod schemas:

```typescript
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  published: z.boolean().default(false),
})

type CreatePostInput = z.infer<typeof createPostSchema>
```

### Explicit Return Types

Always specify return types for functions:

```typescript
async function fetchUser(id: string): Promise<User | null> {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  })
}
```

## Security Considerations

### Sanitize User Input

Never trust user input:

```typescript
import { sanitize } from 'isomorphic-dompurify'

const cleanContent = sanitize(userInput)
```

### Use Environment Variables

Keep secrets in environment variables:

```typescript
const apiKey = process.env.SECRET_API_KEY
if (!apiKey) {
  throw new Error('SECRET_API_KEY is not set')
}
```

### Implement Rate Limiting

Protect your APIs from abuse (future feature):

```typescript
// Coming soon: built-in rate limiting
```

## Testing

### Write Unit Tests

Test your utility functions and business logic:

```typescript
import { describe, it, expect } from 'vitest'

describe('calculateTotal', () => {
  it('should sum prices correctly', () => {
    expect(calculateTotal([10, 20, 30])).toBe(60)
  })
})
```

### Use Type-Safe Mocks

Leverage TypeScript for better test mocks:

```typescript
const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  // ... other required fields
}
```

## Conclusion

Following these best practices will help you build robust, maintainable applications with Kitchen Sink. Remember:

1. Keep code focused and modular
2. Leverage TypeScript's type safety
3. Always validate and sanitize input
4. Use transactions for related database operations
5. Handle errors gracefully
6. Test your code

Happy coding! 🎉
