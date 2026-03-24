import { Spinner } from "@/components/ui/spinner";
import WorkoutFrequencyCalendar from "@/components/workout-history/frequency-calendar";
import { Suspense } from "react";

interface TrainerClientProgramsPageProps {
  clientId: string;
}

export default function TrainerClientProgramsPage({ clientId }: TrainerClientProgramsPageProps) {
  return (
    <Suspense fallback={<Spinner className="size-6" />}>
      <WorkoutFrequencyCalendar clientId={clientId} />
    </Suspense>
  );
}
