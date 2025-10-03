---
title: "Getting Started with Kitchen Sink"
description: "Learn how to set up and start building with Kitchen Sink, the modern full-stack TypeScript starter template."
published: "2025-01-15"
author: "Kitchen Sink Team"
tags: ["tutorial", "getting-started", "typescript"]
---

# Getting Started with Kitchen Sink

Welcome to Kitchen Sink, your go-to full-stack TypeScript starter template! This guide will help you get up and running in minutes.

## What is Kitchen Sink?

Kitchen Sink is a comprehensive starter template that includes everything you need to build modern web applications:

- **TanStack Start** for routing and server functions
- **BetterAuth** for authentication
- **Drizzle ORM** with PostgreSQL
- **shadcn/ui** components
- **Tailwind CSS** for styling

## Quick Start

### Prerequisites

Before you begin, make sure you have:

- Node.js 18+ installed
- PostgreSQL database running
- pnpm package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/kitchen-sink.git

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
```

### Configuration

Update your `.env` file with your database credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Run Migrations

```bash
pnpm drizzle-kit migrate
```

### Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your app running!

## Next Steps

Now that you're up and running, here are some things to explore:

1. **Authentication** - Try signing up and logging in
2. **Protected Routes** - Check out the dashboard and billing pages
3. **Database** - Explore the schema in `src/lib/db/schema.ts`
4. **API Routes** - Create server functions for your business logic

## Learn More

- Check out our [API documentation](/docs/api)
- Join our [community Discord](https://discord.gg/example)
- Read about [best practices](/blog/best-practices)

Happy building! 🚀
