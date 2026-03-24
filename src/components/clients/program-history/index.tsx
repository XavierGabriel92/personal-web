import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { TypographySpan } from "@/components/ui/typography";
import { useGetApiClientByIdSuspense } from "@/gen/hooks/useGetApiClientByIdSuspense";
import { useGetApiRoutinesClientByClientIdSuspense } from "@/gen/hooks/useGetApiRoutinesClientByClientIdSuspense";
import { usePostApiRoutineByIdCloneToLibrary } from "@/gen/hooks/usePostApiRoutineByIdCloneToLibrary";
import type { Routine } from "@/schemas";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Copy, MoreVertical, Pencil } from "lucide-react";
import { toast } from "sonner";

export default function ProgramHistory({ clientId }: { clientId: string }) {
  const { data: clientData } = useGetApiClientByIdSuspense(clientId);
  const { data } = useGetApiRoutinesClientByClientIdSuspense(clientId);

  if (data.routines.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Calendar />
          </EmptyMedia>
          <EmptyTitle>Nenhum programa encontrado</EmptyTitle>
          <EmptyDescription>O histórico de programas do aluno aparecerá aqui</EmptyDescription>
        </EmptyHeader>
        <EmptyContent />
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.routines.map((routine) => (
        <ProgramCard
          key={routine.id}
          routine={routine}
          isActive={routine.id === clientData.activeRoutineId}
        />
      ))}
    </div>
  );
}

function ProgramCard({ routine, isActive }: { routine: Routine; isActive: boolean }) {
  const navigate = useNavigate();
  const { mutateAsync: cloneToLibrary } = usePostApiRoutineByIdCloneToLibrary();

  const handleEdit = () => {
    navigate({ to: "/trainer/routines/$routineId", params: { routineId: routine.id } });
  };

  const handleClone = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await cloneToLibrary({ id: routine.id });
    toast.success("Programa copiado para sua biblioteca!");
  };

  const formattedDate = format(new Date(routine.createdAt), "d MMM. yyyy", { locale: ptBR });

  return (
    <Card className="gap-0">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <CardTitle>{routine.name}</CardTitle>
            {isActive && <Badge variant="default">Ativo</Badge>}
          </div>
          <TypographySpan className="text-muted-foreground text-sm">
            {formattedDate}
          </TypographySpan>
        </div>
        <CardAction className="flex items-center gap-2">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {routine.duration > 0 && (
              <span>{routine.duration} semanas</span>
            )}
            <span>{routine.workouts.length} treino{routine.workouts.length !== 1 ? "s" : ""}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleEdit(); }}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar programa
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); }} onClick={handleClone}>
                <Copy className="mr-2 h-4 w-4" />
                Clonar programa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="space-x-2 space-y-2">
        {routine.workouts.map((workout) => (
          <Badge key={workout.id} variant="secondary">{workout.name}</Badge>
        ))}
        {routine.workouts.length === 0 && (
          <TypographySpan className="text-muted-foreground">Nenhum treino no programa</TypographySpan>
        )}
      </CardContent>
    </Card>
  );
}
