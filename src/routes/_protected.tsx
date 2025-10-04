import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import type { JSX } from 'react'
import { getServerAuthUser } from '@/lib/auth-helpers'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }): Promise<void> => {
    const authUser = await getServerAuthUser()

    if (!authUser) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
      })
    }
  },
  component: ProtectedLayout,
})

function ProtectedLayout(): JSX.Element {
  return <Outlet />
}
