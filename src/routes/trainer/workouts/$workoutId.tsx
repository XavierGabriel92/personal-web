import { Spinner } from '@/components/ui/spinner';
import TrainerWorkoutPage from '@/pages/trainer/workout'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react';

export const Route = createFileRoute('/trainer/workouts/$workoutId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { workoutId } = Route.useParams();
  return (
    <Suspense
      fallback={
        <Spinner className="size-8" />
      }
    >
      <TrainerWorkoutPage workoutId={workoutId} />
    </Suspense>
  );
}
