import TrainerProgramPage from '@/pages/trainer/program';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/programs/$programId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { programId } = Route.useParams();
  return <TrainerProgramPage programId={programId} />
}
