'use client'

import { useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Upload, X } from 'lucide-react'
import type { ChangeEvent, DragEvent, JSX } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

type UploadStatus = 'pending' | 'uploading' | 'complete' | 'error'

type FileUploadState = {
  file: File
  progress: number
  status: UploadStatus
  error?: string
}

type FileUploadZoneProps = {
  onUploadComplete?: () => void
}

export function FileUploadZone({
  onUploadComplete,
}: FileUploadZoneProps): JSX.Element {
  const [fileStates, setFileStates] = useState<Array<FileUploadState>>([])
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(files: FileList | null): void {
    if (!files || files.length === 0) return

    const newFileStates: Array<FileUploadState> = Array.from(files).map(
      (file) => ({
        file,
        progress: 0,
        status: 'pending',
      }),
    )

    setFileStates((prev) => [...prev, ...newFileStates])

    // Start uploading each file
    newFileStates.forEach((fileState, index) => {
      uploadFile(fileState, fileStates.length + index)
    })
  }

  async function uploadFile(
    fileState: FileUploadState,
    index: number,
  ): Promise<void> {
    const { file } = fileState

    try {
      // Update status to uploading
      updateFileState(index, { status: 'uploading', progress: 0 })

      // Step 1: Get presigned URL
      const presignedResponse = await fetch('/api/uploads/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        }),
      })

      if (!presignedResponse.ok) {
        throw new Error('Failed to get presigned URL')
      }

      const { presignedUrl, fileKey } = await presignedResponse.json()

      // Step 2: Upload to R2 using XMLHttpRequest for progress tracking
      await uploadToR2(presignedUrl, file, (progress) => {
        updateFileState(index, { progress })
      })

      // Step 3: Mark upload as complete in database
      const completeResponse = await fetch('/api/uploads/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileKey,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        }),
      })

      if (!completeResponse.ok) {
        throw new Error('Failed to complete upload')
      }

      // Update status to complete
      updateFileState(index, { status: 'complete', progress: 100 })

      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete()
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed'
      updateFileState(index, { status: 'error', error: errorMessage })
    }
  }

  function uploadToR2(
    presignedUrl: string,
    file: File,
    onProgress: (progress: number) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress: number = Math.round((e.loaded / e.total) * 100)
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'))
      })

      xhr.open('PUT', presignedUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
    })
  }

  function updateFileState(
    index: number,
    updates: Partial<FileUploadState>,
  ): void {
    setFileStates((prev) =>
      prev.map((state, i) => (i === index ? { ...state, ...updates } : state)),
    )
  }

  function removeFile(index: number): void {
    setFileStates((prev) => prev.filter((_, i) => i !== index))
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
    handleFileSelect(e.target.files)
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400',
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files here, or click to select
          </p>
          <p className="text-xs text-gray-500">Support for multiple files</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
        </div>

        {/* File list */}
        {fileStates.length > 0 && (
          <div className="space-y-2">
            {fileStates.map((fileState, index) => (
              <div
                key={`${fileState.file.name}-${index}`}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {fileState.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileState.file.size)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {fileState.status === 'complete' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {fileState.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    {(fileState.status === 'complete' ||
                      fileState.status === 'error') && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                {(fileState.status === 'uploading' ||
                  fileState.status === 'pending') && (
                  <div className="space-y-1">
                    <Progress value={fileState.progress} />
                    <p className="text-xs text-gray-500 text-right">
                      {fileState.progress}%
                    </p>
                  </div>
                )}

                {/* Error message */}
                {fileState.status === 'error' && fileState.error && (
                  <p className="text-xs text-red-500">{fileState.error}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
