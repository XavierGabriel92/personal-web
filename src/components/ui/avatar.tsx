
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import type * as React from "react"
import { useMemo } from "react"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  src,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  // Add cache-busting query parameter to prevent stale image cache
  const cacheBustedSrc = useMemo(() => {
    if (!src) return src
    try {
      const url = new URL(src)
      // Add timestamp to force fresh fetch
      url.searchParams.set('_t', Date.now().toString())
      return url.toString()
    } catch {
      // If src is not a valid URL, append query parameter manually
      const separator = src.includes('?') ? '&' : '?'
      return `${src}${separator}_t=${Date.now()}`
    }
  }, [src])

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      src={cacheBustedSrc}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
