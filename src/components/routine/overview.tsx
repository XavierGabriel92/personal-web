import { calculateWeeksFromDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { TypographySpan, TypographySpanXSmall } from "@/components/ui/typography";
import { useGetApiClientByIdSuspense } from "@/gen/hooks/useGetApiClientByIdSuspense";
import { useGetApiRoutineById } from "@/gen/hooks/useGetApiRoutineById";
import { usePostApiRoutineByIdCloneToLibrary } from "@/gen/hooks/usePostApiRoutineByIdCloneToLibrary";
import { Link } from "@tanstack/react-router";
import { CalendarIcon, CalendarPlusIcon, Copy, MoreHorizontalIcon, PlusIcon, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SelectRoutineForClientDialog from "./sheet/select-routine-for-client";

interface ProgramOverviewProps {
  clientId: string;
}

export default function ProgramOverview({ clientId }: ProgramOverviewProps) {
  const [trocarOpen, setTrocarOpen] = useState(false);
  const { data: client } = useGetApiClientByIdSuspense(clientId);
  const { mutateAsync: cloneToLibrary } = usePostApiRoutineByIdCloneToLibrary();
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

  if (activeRoutineId && routine) {
    return (
      <Card>
        <CardHeader className="items-center border-b">
          <CardTitle>Programa ativo</CardTitle>
          <CardAction className="flex items-center gap-2">
            <Button variant="link" size="sm" className="p-0">
              <Link to="/trainer/routines/$routineId" params={{ routineId: activeRoutineId }}>
                Editar programa
              </Link>
            </Button>
            <SelectRoutineForClientDialog
              clientId={clientId}
              requireConfirmation
              open={trocarOpen}
              onOpenChange={setTrocarOpen}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setTrocarOpen(true)}>
                  <RefreshCw className="h-4 w-4" />
                  Trocar programa
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={async () => {
                  await cloneToLibrary({ id: activeRoutineId });
                  toast.success("Programa copiado para sua biblioteca!");
                }}>
                  <Copy className="h-4 w-4" />
                  Clonar programa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-start">
            <div className="bg-muted p-4 rounded-full text-muted-foreground">
              <CalendarIcon />
            </div>
            <div className="flex flex-col gap-1">
              <TypographySpan className="font-medium">{routine.name}</TypographySpan>
              <TypographySpan className="text-muted-foreground">
                {`${routine.workouts.length} treinos`}
              </TypographySpan>
            </div>
            {routine.duration > 0 && (
              <TypographySpanXSmall className="text-muted-foreground ml-auto">
                {`Semana ${Math.min(calculateWeeksFromDate(routine.createdAt), routine.duration)} de ${routine.duration}`}
              </TypographySpanXSmall>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

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
