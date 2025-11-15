import LastActivities from "@/components/activities/last-activities";
import ClientNotes from "@/components/clients/notes";
// import { BodyweightCard } from "@/components/measures/bodyweight";
import ProgramOverview from "@/components/program/overview";
import { TypographyH3 } from "@/components/ui/typography";
import { WorkoutCalendar } from "@/components/workout-history/calendar";
import { DurationCard } from "@/components/workout-history/duration";
import { SetCard } from "@/components/workout-history/set";
import { VolumeCard } from "@/components/workout-history/volume";

interface TrainerClientOverviewPageProps {
  clientId: string;
}

export default function TrainerClientOverviewPage({ clientId }: TrainerClientOverviewPageProps) {
  return (
    <div className="space-y-6">
      {/* Existing Content */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <ProgramOverview clientId={clientId} />
          <ClientNotes clientId={clientId} />
        </div>
        <LastActivities clientId={clientId} />
      </div>
      {/* Statistics Section */}
      <div className="space-y-4">
        <TypographyH3 className="font-semibold">Statistics</TypographyH3>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <DurationCard />
          <VolumeCard />
          <SetCard />
          <WorkoutCalendar />
          {/* <BodyweightCard /> */}
        </div>
      </div>


    </div>
  );
}