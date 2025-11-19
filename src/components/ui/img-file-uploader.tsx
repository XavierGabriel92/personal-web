import { CircleUserRoundIcon, XIcon } from "lucide-react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { useFileUpload } from "@/hooks/use-file-upload"

interface ImgFileUploaderProps {
  value?: File | string | null
  onChange?: (file: File | null) => void
}

export default function ImgFileUploader({
  value,
  onChange,
}: ImgFileUploaderProps) {
  const [
    { files, isDragging },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      addFiles,
      clearFiles,
    },
  ] = useFileUpload({
    accept: "image/*",
    multiple: false,
    onFilesChange: (updatedFiles) => {
      if (updatedFiles.length > 0 && updatedFiles[0]?.file instanceof File) {
        onChange?.(updatedFiles[0].file)
      } else {
        onChange?.(null)
      }
    },
  })

  // Sync external value with internal state
  useEffect(() => {
    if (value === null || value === undefined) {
      if (files.length > 0) {
        clearFiles()
      }
      return
    }

    if (value instanceof File) {
      // If value is a File and we don't have it in files, add it
      const hasFile = files.some(
        (f) => f.file instanceof File && f.file === value
      )
      if (!hasFile) {
        addFiles([value])
      }
    }
    // If value is a string (URL), we'll use it for preview but don't add to files
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const previewUrl =
    files[0]?.preview || (typeof value === "string" ? value : null)

  return (
    <div className="flex flex-col items-center gap-0">
      <div className="relative inline-flex">
        {/* Drop area */}
        <button
          type="button"
          className="relative flex size-25 items-center justify-center overflow-hidden rounded-full border border-dashed border-input transition-colors outline-none hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none data-[dragging=true]:bg-accent/50"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          aria-label={previewUrl ? "Change image" : "Upload image"}
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt={files[0]?.file?.name || "Uploaded image"}
              width={64}
              height={64}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-4 opacity-60" />
            </div>
          )}
        </button>
        {previewUrl && (
          <Button
            type="button"
            onClick={() => {
              if (files.length > 0) {
                removeFile(files[0]?.id)
              }
              onChange?.(null)
            }}
            size="icon"
            className="absolute top-1 -right-4 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
            aria-label="Remove image"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
          tabIndex={-1}
        />
      </div>
      <p
        aria-live="polite"
        role="region"
        className="mt-2 text-xs text-muted-foreground"
      >
        Adicionar imagem
      </p>
    </div>
  )
}
