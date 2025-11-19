import TrainerWorkoutPage from '@/pages/trainer/workout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/workouts/$workoutId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { workoutId } = Route.useParams();
  return <TrainerWorkoutPage workoutId={workoutId} />
}
