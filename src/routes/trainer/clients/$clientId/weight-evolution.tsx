import WeightEvolutionPage from '@/pages/trainer/client/weight-evolution'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/clients/$clientId/weight-evolution')({
  component: RouteComponent,
})

function RouteComponent() {
  const { clientId } = Route.useParams();
  return <WeightEvolutionPage clientId={clientId} />
}
