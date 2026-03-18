import { Spinner } from '@/components/ui/spinner';
import TrainerRoutinePage from '@/pages/trainer/routine';
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react';

export const Route = createFileRoute('/trainer/routines/$routineId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { routineId } = Route.useParams();
  return (
    <Suspense
      fallback={
        <Spinner className="size-8" />
      }
    >
      <TrainerRoutinePage routineId={routineId} />
    </Suspense>
  );
}
