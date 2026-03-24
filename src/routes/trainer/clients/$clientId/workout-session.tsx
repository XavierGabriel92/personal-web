import WorkoutSessionPage from '@/pages/trainer/client/workout-session'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/clients/$clientId/workout-session')({
  component: RouteComponent,
})

function RouteComponent() {
  const { clientId } = Route.useParams();
  return <WorkoutSessionPage clientId={clientId} />
}
