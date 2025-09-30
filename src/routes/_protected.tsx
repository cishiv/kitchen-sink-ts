import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import type { JSX } from 'react'
import { getAuthUser } from '@/lib/auth-helpers'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async (): Promise<void> => {
    const authUser = await getAuthUser()

    if (!authUser) {
      throw redirect({
        to: '/login',
        search: {
          redirect: window.location.pathname,
        },
      })
    }
  },
  component: ProtectedLayout,
})

function ProtectedLayout(): JSX.Element {
  return <Outlet />
}
