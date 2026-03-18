import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/input";
import { TypographyP, TypographySpan } from "@/components/ui/typography";
import { useGetApiRoutinesSuspense } from "@/gen/hooks/useGetApiRoutinesSuspense";
import type { Routine } from "@/schemas";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Copy, MoreVertical, Pencil, Trash, UserCheck } from "lucide-react";
import { useState } from "react";
import AssignProgramSheet from "../sheet/assign-routine";
import CreateProgramSheet from "../sheet/create-routine";

export default function TrainerRoutineList() {
  const [search, setSearch] = useState("");
  const { data } = useGetApiRoutinesSuspense();

  return (
    <div className="flex flex-col gap-4">
      {data.routines.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Calendar />
            </EmptyMedia>
            <EmptyTitle>Nenhum programa criado</EmptyTitle>
            <EmptyDescription>Crie um programa para começar</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CreateProgramSheet />
          </EmptyContent>
        </Empty>
      ) : <>
        <div className="flex items-center justify-between">
          <SearchInput
            placeholder="Pesquisar programa"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <CreateProgramSheet />
        </div>

        <div className="flex flex-col gap-4">
          {data.routines
            .filter((routine) =>
              routine.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((routine) => (
              <RoutineCard key={routine.id} routine={routine} />
            ))}

        </div>
      </>}

    </div>
  );
}


function RoutineCard({ routine }: { routine: Routine }) {
  const navigate = useNavigate();

  const navigateToRoutine = () => {
    navigate({ to: "/trainer/routines/$routineId", params: { routineId: routine.id } });
  };

  const deleteProgram = (routineId: string) => {
    console.log("Deleting program:", routineId);
  };

  return <Card className="gap-0 cursor-pointer" onClick={navigateToRoutine}>
    <CardHeader>
      <CardTitle>{routine.name}</CardTitle>
      <CardAction className="flex items-center gap-2">
        {routine.duration > 0 && (
          <TypographySpan className="text-muted-foreground">Duração: {routine.duration} semanas</TypographySpan>
        )}
        <ProgramActions routine={routine} deleteProgram={deleteProgram} />
      </CardAction>
    </CardHeader>
    <CardContent className="space-x-2 space-y-2">
      {routine.workouts.map((workout) => (
        <Badge key={workout.id} variant="secondary" >{workout.name}</Badge>
      ))}
      {routine.workouts.length === 0 && (
        <TypographyP className="text-muted-foreground">Nenhum treino adicionado no programa</TypographyP>
      )}
    </CardContent>

  </Card>
}

function DeleteProgramDialog({
  routine,
  open,
  onOpenChange,
  onConfirm,
}: {
  routine: Routine;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar programa</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar o programa "{routine.name}"? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ProgramActions({ routine, deleteProgram }: { routine: Routine, deleteProgram: (routineId: string) => void }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate({ to: "/trainer/routines/$routineId", params: { routineId: routine.id } });
  };

  const handleDelete = () => {
    deleteProgram(routine.id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            handleEdit();
          }} onClick={(e) => e.stopPropagation()}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar programa
          </DropdownMenuItem>
          <AssignProgramSheet routineId={routine.id} trigger={<DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Atribuir programa
          </DropdownMenuItem>} />

          {/* <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
          }} onClick={(e) => e.stopPropagation()}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar o programa
          </DropdownMenuItem> */}
          {/* <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.stopPropagation
              setDeleteDialogOpen(true);
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Deletar o programa
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteProgramDialog
        routine={routine}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}