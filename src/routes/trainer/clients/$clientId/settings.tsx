import TrainerClientSettingsPage from '@/pages/trainer/client/settings'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/clients/$clientId/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const { clientId } = Route.useParams();
  return <TrainerClientSettingsPage clientId={clientId} />
}
