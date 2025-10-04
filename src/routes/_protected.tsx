import { Outlet, createFileRoute, redirect, useRouterState } from '@tanstack/react-router'
import type { JSX } from 'react'
import { getServerAuthUser } from '@/lib/auth-helpers'
import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

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
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  // Determine current page for breadcrumbs
  const getBreadcrumbTitle = (): string => {
    if (pathname.includes('/billing')) {
      if (pathname.includes('/success')) return 'Billing Success'
      return 'Billing'
    }
    if (pathname.includes('/dashboard')) return 'Dashboard'
    return 'Home'
  }

  const breadcrumbTitle = getBreadcrumbTitle()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Kitchen Sink
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
