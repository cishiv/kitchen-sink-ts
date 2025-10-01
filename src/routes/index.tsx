import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import type { JSX } from 'react/jsx-runtime'
import { Button } from '@/components/ui/button'
import { getServerAuthUser } from '@/lib/auth-helpers'

export const Route = createFileRoute('/')({
  beforeLoad: async (): Promise<void> => {
    const authUser = await getServerAuthUser()

    if (authUser) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: HomePage,
})

function HomePage(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Welcome to Kitchen Sink
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Get started by signing in to your account or creating a new one
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <Button size="lg" variant="default">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="lg" variant="outline">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
