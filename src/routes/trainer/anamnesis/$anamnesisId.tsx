import EditTrainerAnamnesisDialog from '@/components/anamnesis/dialog/edit-trainer-anamnesis-dialog'
import { Spinner } from '@/components/ui/spinner'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Suspense, useState } from 'react'

export const Route = createFileRoute('/trainer/anamnesis/$anamnesisId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { anamnesisId } = Route.useParams()
  const router = useRouter()
  const [open, setOpen] = useState(true)
  return (
    <Suspense fallback={<Spinner className="size-8" />}>
      <EditTrainerAnamnesisDialog
        anamnesisId={anamnesisId}
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
