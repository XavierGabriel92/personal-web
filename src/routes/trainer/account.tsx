import AccountDialog from '@/components/account/account-dialog'
import { Spinner } from '@/components/ui/spinner'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Suspense, useState } from 'react'

export const Route = createFileRoute('/trainer/account')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  return (
    <Suspense fallback={<Spinner className="size-8" />}>
      <AccountDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) {
            router.history.back()
          }
        }}
      />
    </Suspense>
  )
}
