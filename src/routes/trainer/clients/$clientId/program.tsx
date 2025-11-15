import TrainerClientProgramPage from '@/pages/trainer/client/program'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/clients/$clientId/program')({
  component: RouteComponent,
})

function RouteComponent() {
  const { clientId } = Route.useParams();
  return <TrainerClientProgramPage clientId={clientId} />
}
