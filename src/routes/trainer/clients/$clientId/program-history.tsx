import ProgramHistoryPage from '@/pages/trainer/client/program-history'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/clients/$clientId/program-history')({
  component: RouteComponent,
})

function RouteComponent() {
  const { clientId } = Route.useParams();
  return <ProgramHistoryPage clientId={clientId} />
}
