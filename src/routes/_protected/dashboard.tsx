'use client'

import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { JSX } from 'react'
import type { Upload } from '@/lib/db/schema'
import { authClient } from '@/lib/auth-client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FileUploadZone } from '@/components/FileUploadZone'
import { UploadsTable } from '@/components/UploadsTable'

export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardPage,
})

function DashboardPage(): JSX.Element {
  const { data: session } = authClient.useSession()
  const [uploads, setUploads] = useState<Array<Upload>>([])
  const [isLoadingUploads, setIsLoadingUploads] = useState<boolean>(true)

  useEffect(() => {
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

  return (
    <div className="space-y-4">
      <FileUploadZone onUploadComplete={refreshUploads} />

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
  )
}
