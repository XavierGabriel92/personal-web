import TrainerExercisesPage from '@/pages/trainer/exercises'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/exercises')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TrainerExercisesPage />
}
