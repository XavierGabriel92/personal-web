import LastActivities from "@/components/activities/last-activities";
import ClientNotes from "@/components/clients/notes";
import ProgramOverview from "@/components/program/overview";
import { DurationCard } from "@/components/workout-history/duration";
import { SetCard } from "@/components/workout-history/set";
import { VolumeCard } from "@/components/workout-history/volume";

interface TrainerClientOverviewPageProps {
  clientId: string;
}

export default function TrainerClientOverviewPage({ clientId }: TrainerClientOverviewPageProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <ProgramOverview clientId={clientId} />
          <ClientNotes clientId={clientId} />
        </div>
        <LastActivities clientId={clientId} />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <VolumeCard />
        <SetCard />
        <DurationCard />
      </div>
    </div>
  );
}