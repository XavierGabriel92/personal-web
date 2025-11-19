import { AlertCircleIcon, UploadIcon, VideoIcon, XIcon } from "lucide-react"
import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { useFileUpload } from "@/hooks/use-file-upload"

interface VideoFileUploaderProps {
  value?: File | string | null
  onChange?: (file: File | null) => void
  maxSizeMB?: number
}

export default function VideoFileUploader({
  value,
  onChange,
  maxSizeMB = 10,
}: VideoFileUploaderProps) {
  const maxSize = maxSizeMB * 1024 * 1024
  const isSyncingRef = useRef(false)

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
      addFiles,
      clearFiles,
    },
  ] = useFileUpload({
    accept: "video/*,.mp4,.mov,.avi,.webm,.mkv,.flv,.wmv",
    maxSize,
    multiple: false,
    onFilesChange: (updatedFiles) => {
      // Don't call onChange if we're syncing from external props
      if (isSyncingRef.current) {
        return
      }
      if (updatedFiles.length > 0 && updatedFiles[0]?.file instanceof File) {
        onChange?.(updatedFiles[0].file)
      } else {
        onChange?.(null)
      }
    },
  })

  // Sync external value with internal state
  useEffect(() => {
    const currentFile = files[0]?.file instanceof File ? files[0].file : null

    // If external value is cleared, clear internal files
    if (value === null || value === undefined) {
      if (currentFile) {
        isSyncingRef.current = true
        clearFiles()
        // Reset flag synchronously since clearFiles doesn't trigger onFilesChange
        setTimeout(() => {
          isSyncingRef.current = false
        }, 0)
      }
      return
    }

    // If external value is a File and different from current, sync it
    if (value instanceof File) {
      if (currentFile !== value) {
        isSyncingRef.current = true
        addFiles([value])
        // Reset the flag after onFilesChange has been called
        setTimeout(() => {
          isSyncingRef.current = false
        }, 0)
      }
    }
    // If value is a string (URL), we'll use it for preview but don't add to files
  }, [value, files, addFiles, clearFiles])

  const previewUrl =
    files[0]?.preview || (typeof value === "string" ? value : null)
  const fileName = files[0]?.file.name || (value instanceof File ? value.name : null)
  const hasFile = files.length > 0 || (value instanceof File)

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {/* Drop area */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload video file"
          />
          {previewUrl || hasFile ? (
            <div className="absolute inset-0 flex items-center justify-center p-4 w-full h-full">
              {previewUrl ? (
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-full max-h-full max-w-full rounded object-contain"
                  style={{ maxHeight: "100%", maxWidth: "100%", width: "auto", height: "auto" }}
                >
                  <track kind="captions" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <VideoIcon className="size-12 opacity-60 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {fileName || "Vídeo carregado"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Preview não disponível
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
                aria-hidden="true"
              >
                <VideoIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">
                Arraste seu vídeo aqui
              </p>
              <p className="text-xs text-muted-foreground">
                MP4, MOV, AVI ou outros formatos de vídeo (máx. {maxSizeMB}MB)
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={openFileDialog}
              >
                <UploadIcon
                  className="-ms-1 size-4 opacity-60"
                  aria-hidden="true"
                />
                Selecionar vídeo
              </Button>
            </div>
          )}
        </div>

        {(previewUrl || hasFile) && (
          <div className="absolute top-4 right-4 z-50">
            <button
              type="button"
              className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              onClick={() => {
                if (files.length > 0) {
                  removeFile(files[0]?.id)
                }
                onChange?.(null)
              }}
              aria-label="Remover vídeo"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-xs text-destructive"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {fileName && (
        <p
          aria-live="polite"
          className="mt-2 text-center text-xs text-muted-foreground"
        >
          {fileName}
        </p>
      )}
    </div>
  )
}
