
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { TypographySpan } from "@/components/ui/typography";
import { useGetApiClientByIdSuspense } from "@/gen/hooks/useGetApiClientByIdSuspense";
import { useGetApiRoutineById } from "@/gen/hooks/useGetApiRoutineById";
import WorkoutCard from "@/components/workout/collapsible/workout";
import { calculateWeeksFromDate } from "@/lib/date";
import { Link } from "@tanstack/react-router";
import { CalendarPlusIcon, PlusIcon } from "lucide-react";
import SelectRoutineForClientDialog from "./sheet/select-routine-for-client";

interface ActiveProgramProps {
  clientId: string;
}

export default function ActiveProgram({ clientId }: ActiveProgramProps) {
  const { data: client } = useGetApiClientByIdSuspense(clientId);
  const activeRoutineId = client.activeRoutineId;

  const { data: routine, isLoading } = useGetApiRoutineById(activeRoutineId ?? "", {
    query: { enabled: !!activeRoutineId },
  });

  if (isLoading && activeRoutineId) {
    return (
      <Card>
        <CardContent className="flex justify-center p-8">
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  if (!activeRoutineId || !routine) {
    return (
      <Card>
        <Empty className="p-0 md:p-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CalendarPlusIcon />
            </EmptyMedia>
            <EmptyTitle>Nenhum programa ativo</EmptyTitle>
            <EmptyDescription>Esse aluno ainda não possui um programa ativo</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <SelectRoutineForClientDialog clientId={clientId}>
              <Button>
                <PlusIcon />
                Criar programa
              </Button>
            </SelectRoutineForClientDialog>
          </EmptyContent>
        </Empty>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="items-center border-b ">
        <CardTitle>{routine.name}</CardTitle>
        <CardAction className="flex items-center gap-2">
          {routine.duration > 0 && (
            <TypographySpan className="text-muted-foreground ml-auto">
              Semana {Math.min(calculateWeeksFromDate(routine.createdAt), routine.duration)} de {routine.duration} -
            </TypographySpan>
          )}
          <Button variant="link" size="sm" className="p-0">
            <Link to="/trainer/routines/$routineId" params={{ routineId: activeRoutineId }}>
              Editar programa
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {routine.workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </CardContent>
    </Card>
  );
}
