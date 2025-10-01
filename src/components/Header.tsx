'use client'

import { Link, useRouter } from '@tanstack/react-router'
import type { JSX } from 'react'
import { authClient } from '@/lib/auth-client'

export default function Header(): JSX.Element {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  async function handleSignOut(): Promise<void> {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.navigate({ to: '/' })
        },
      },
    })
  }

  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>
      </nav>

      <nav className="flex flex-row items-center">
        {session?.user ? (
          <>
            <div className="px-2">
              <span className="text-sm">Welcome, {session.user.name}</span>
            </div>
            <div className="px-2 font-bold">
              <Link to="/dashboard">Dashboard</Link>
            </div>
            <div className="px-2 font-bold">
              <Link to="/billing">Billing</Link>
            </div>
            <div className="px-2">
              <button
                onClick={handleSignOut}
                className="font-bold hover:underline"
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="px-2 font-bold">
              <Link to="/login">Login</Link>
            </div>

            <div className="px-2 font-bold">
              <Link to="/signup">Sign Up</Link>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}
