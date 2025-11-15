import TrainerClientOverviewPage from '@/pages/trainer/client/overview'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/clients/$clientId/overview')({
  component: RouteComponent,
})

function RouteComponent() {
  const { clientId } = Route.useParams();
  return <TrainerClientOverviewPage clientId={clientId} />
}
