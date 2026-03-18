import ActiveProgram from "@/components/routine/active-routine";
import { TypographyH3 } from "@/components/ui/typography";
import WorkoutHistoryList from "@/components/workout-history/list";

interface TrainerClientProgramsPageProps {
  clientId: string;
}

export default function TrainerClientProgramsPage({ clientId }: TrainerClientProgramsPageProps) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
    <div className="space-y-4 order-2 md:order-1">
      <TypographyH3 className="font-medium">Histórico de treinos</TypographyH3>
      <WorkoutHistoryList clientId={clientId} />
    </div>
    <div className="space-y-4 block md:sticky top-0 self-start order-1 md:order-2">
      <TypographyH3 className="font-medium">Programa ativo</TypographyH3>
      <ActiveProgram clientId={clientId} />
    </div>
  </div>
}