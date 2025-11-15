import TrainerClientWorkoutMeasurementsPage from '@/pages/trainer/client/measurements'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/clients/$clientId/measurements')({
  component: RouteComponent,
})

function RouteComponent() {
  const { clientId } = Route.useParams();
  return <TrainerClientWorkoutMeasurementsPage clientId={clientId} />
}
