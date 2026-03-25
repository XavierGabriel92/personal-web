import { Spinner } from '@/components/ui/spinner'
import TrainerAnamnesisPage from '@/pages/trainer/anamnesis'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/trainer/anamnesis/$anamnesisId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { anamnesisId } = Route.useParams()
  return (
    <Suspense fallback={<Spinner className="size-8" />}>
      <TrainerAnamnesisPage anamnesisId={anamnesisId} />
    </Suspense>
  )
}
