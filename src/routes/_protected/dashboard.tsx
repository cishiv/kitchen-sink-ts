'use client'

import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { JSX } from 'react'
import type { Upload } from '@/lib/db/schema'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FileUploadZone } from '@/components/FileUploadZone'
import { UploadsTable } from '@/components/UploadsTable'

export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardPage,
})

function DashboardPage(): JSX.Element {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(true)
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false)
  const [uploads, setUploads] = useState<Array<Upload>>([])
  const [isLoadingUploads, setIsLoadingUploads] = useState<boolean>(true)

  useEffect(() => {
    async function fetchUserEmail(): Promise<void> {
      try {
        const response = await fetch('/api/user')
        if (response.ok) {
          const data = await response.json()
          setUserEmail(data.email)
        }
      } catch (error) {
        console.error('Failed to fetch user email:', error)
      } finally {
        setIsLoadingEmail(false)
      }
    }

    async function fetchUploads(): Promise<void> {
      try {
        const response = await fetch('/api/uploads')
        if (response.ok) {
          const data: Array<Upload> = await response.json()
          setUploads(data)
        }
      } catch (error) {
        console.error('Failed to fetch uploads:', error)
      } finally {
        setIsLoadingUploads(false)
      }
    }

    if (session?.user) {
      fetchUserEmail()
      fetchUploads()
    }
  }, [session])

  async function refreshUploads(): Promise<void> {
    try {
      const response = await fetch('/api/uploads')
      if (response.ok) {
        const data: Array<Upload> = await response.json()
        setUploads(data)
      }
    } catch (error) {
      console.error('Failed to refresh uploads:', error)
    }
  }

  async function handleSignOut(): Promise<void> {
    setIsSigningOut(true)
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.navigate({ to: '/' })
          },
        },
      })
    } catch (error) {
      console.error('Failed to sign out:', error)
      setIsSigningOut(false)
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Session Error</CardTitle>
            <CardDescription>
              Unable to load session. Please try signing in again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.navigate({ to: '/login' })}
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>
              Welcome back, {session.user.name}!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-white">
                <h3 className="text-sm font-medium text-gray-500">
                  User Information
                </h3>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="text-sm font-medium">Name: </span>
                    <span className="text-sm text-gray-700">
                      {session.user.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Email: </span>
                    <span className="text-sm text-gray-700">
                      {session.user.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-white">
                <h3 className="text-sm font-medium text-gray-500">
                  Protected API Data
                </h3>
                <div className="mt-2">
                  {isLoadingEmail ? (
                    <Skeleton className="h-4 w-64" />
                  ) : (
                    <div>
                      <span className="text-sm font-medium">
                        Email from API:{' '}
                      </span>
                      <span className="text-sm text-gray-700">
                        {userEmail ?? 'Not available'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={handleSignOut}
              variant="destructive"
              className="w-full"
              disabled={isSigningOut}
            >
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </CardContent>
        </Card>

        {/* File Upload Section */}
        <FileUploadZone onUploadComplete={refreshUploads} />

        {/* Uploads Table */}
        {isLoadingUploads ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ) : (
          <UploadsTable uploads={uploads} onDelete={refreshUploads} />
        )}
      </div>
    </div>
  )
}
