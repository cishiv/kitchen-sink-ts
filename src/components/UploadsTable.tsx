'use client'

import { useState } from 'react'
import { Download, Trash2, Eye } from 'lucide-react'
import { format } from 'date-fns'
import type { JSX } from 'react'
import type { Upload } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type UploadsTableProps = {
  uploads: Array<Upload>
  onDelete?: () => void
}

export function UploadsTable({
  uploads,
  onDelete,
}: UploadsTableProps): JSX.Element {
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set())
  const [viewerOpen, setViewerOpen] = useState<boolean>(false)
  const [viewerImageUrl, setViewerImageUrl] = useState<string | null>(null)
  const [viewerImageName, setViewerImageName] = useState<string | null>(null)

  function isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/')
  }

  async function handleView(upload: Upload): Promise<void> {
    try {
      const response = await fetch(`/api/uploads/${upload.id}/view`)

      if (!response.ok) {
        throw new Error('Failed to generate view URL')
      }

      const { presignedUrl, fileName } = await response.json()

      setViewerImageUrl(presignedUrl)
      setViewerImageName(fileName)
      setViewerOpen(true)
    } catch (error) {
      console.error('Error viewing file:', error)
      alert('Failed to view file')
    }
  }

  async function handleDownload(upload: Upload): Promise<void> {
    if (downloadingIds.has(upload.id)) return

    setDownloadingIds((prev) => new Set(prev).add(upload.id))

    try {
      const response = await fetch(`/api/uploads/${upload.id}/download`)

      if (!response.ok) {
        throw new Error('Failed to generate download URL')
      }

      const { presignedUrl, fileName } = await response.json()

      // Create temporary link and trigger download
      const link = document.createElement('a')
      link.href = presignedUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading file:', error)
      alert('Failed to download file')
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev)
        next.delete(upload.id)
        return next
      })
    }
  }

  async function handleDelete(upload: Upload): Promise<void> {
    if (deletingIds.has(upload.id)) return

    const confirmed: boolean = window.confirm(
      `Are you sure you want to delete "${upload.fileName}"?`,
    )

    if (!confirmed) return

    setDeletingIds((prev) => new Set(prev).add(upload.id))

    try {
      const response = await fetch(`/api/uploads/${upload.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete upload')
      }

      if (onDelete) {
        onDelete()
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Failed to delete file')
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev)
        next.delete(upload.id)
        return next
      })
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
  }

  if (uploads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            No uploads yet. Upload your first file above.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Uploads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploads.map((upload) => (
                <TableRow key={upload.id}>
                  <TableCell className="font-medium">
                    {upload.fileName}
                  </TableCell>
                  <TableCell>{formatFileSize(upload.fileSize)}</TableCell>
                  <TableCell>
                    {format(new Date(upload.createdAt), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {isImage(upload.mimeType) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(upload)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(upload)}
                        disabled={downloadingIds.has(upload.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {downloadingIds.has(upload.id)
                          ? 'Downloading...'
                          : 'Download'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(upload)}
                        disabled={deletingIds.has(upload.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {deletingIds.has(upload.id) ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Image Viewer Dialog */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{viewerImageName}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center">
            {viewerImageUrl && (
              <img
                src={viewerImageUrl}
                alt={viewerImageName ?? 'Image preview'}
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
