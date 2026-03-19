import TrainerClientOverviewPage from '@/pages/trainer/client/overview'
import { Spinner } from '@/components/ui/spinner'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/trainer/clients/$clientId/overview')({
  component: RouteComponent,
})

function RouteComponent() {
  const { clientId } = Route.useParams();
  return (
    <Suspense fallback={<Spinner className="size-8" />}>
      <TrainerClientOverviewPage clientId={clientId} />
    </Suspense>
  )
}
