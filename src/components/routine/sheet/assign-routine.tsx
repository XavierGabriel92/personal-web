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
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { TypographyP, TypographySpan } from "@/components/ui/typography";
import { useGetApiClients } from "@/gen/hooks/useGetApiClients";
import { getApiClientsSuspenseQueryKey } from "@/gen/hooks/useGetApiClientsSuspense";
import { usePostApiClientByIdAssignRoutine } from "@/gen/hooks/usePostApiClientByIdAssignRoutine";
import { queryClient } from "@/routes/__root";
import { UserCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AssignStudentList from "./assisgn-student-list";

interface AssignRoutineSheetProps {
  routineId: string;
  trigger?: React.ReactElement;
}

export default function AssignRoutineSheet({ routineId, trigger = <Button size="sm" variant="outline"><UserCheck />Atribuir programa</Button> }: AssignRoutineSheetProps) {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const { data, isLoading } = useGetApiClients();
  const { mutateAsync: assignRoutine, isPending } = usePostApiClientByIdAssignRoutine();

  const clients = data?.clients ?? [];

  const studentData = {
    withProgram: clients
      .filter((c) => !!c.activeRoutineId)
      .map((c) => ({
        id: c.id,
        name: c.name ?? "Sem nome",
        avatar: null,
        programName: "Programa ativo",
      })),
    withoutProgram: clients
      .filter((c) => !c.activeRoutineId)
      .map((c) => ({
        id: c.id,
        name: c.name ?? "Sem nome",
        avatar: null,
        programName: null,
      })),
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedIds(new Set());
      setConfirmDialogOpen(false);
    }
  };

  const getSelectedStudents = () => {
    return [
      ...studentData.withProgram.filter((s) => selectedIds.has(s.id)),
      ...studentData.withoutProgram.filter((s) => selectedIds.has(s.id)),
    ];
  };

  const getStudentsWithProgram = () => {
    return getSelectedStudents().filter((s) => s.programName != null);
  };

  const hasStudentsWithProgram = () => {
    return getStudentsWithProgram().length > 0;
  };

  const handleAssignProgram = () => {
    if (hasStudentsWithProgram()) {
      setConfirmDialogOpen(true);
    } else {
      proceedWithAssignment();
    }
  };

  const proceedWithAssignment = async () => {
    const selectedStudents = getSelectedStudents();
    try {
      await Promise.all(
        selectedStudents.map((s) =>
          assignRoutine({ id: s.id, data: { routineId } })
        )
      );
      await queryClient.invalidateQueries({ queryKey: getApiClientsSuspenseQueryKey() });
      toast.success("Programa atribuído com sucesso!");
    } catch {
      toast.error("Erro ao atribuir programa. Tente novamente.");
    } finally {
      setConfirmDialogOpen(false);
      setOpen(false);
      setSelectedIds(new Set());
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Atribuir programa</SheetTitle>
          <SheetDescription>
            Selecione os alunos para atribuir o programa.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : (
            <>
              <AssignStudentList
                students={studentData.withoutProgram}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                title="Alunos sem programa"
              />
              <AssignStudentList
                students={studentData.withProgram}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                title="Alunos com programa"
              />
            </>
          )}
        </div>
        <SheetFooter>
          <Button onClick={handleAssignProgram} disabled={selectedIds.size === 0 || isPending} className="gap-2">
            {isPending && <Spinner />}
            Atribuir programa
          </Button>
          <SheetClose asChild>
            <Button variant="outline" disabled={isPending}>Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar substituição de programa</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <TypographyP>
                Os seguintes alunos já possuem um programa atribuído:
              </TypographyP>
              <ul className="list-disc list-inside space-y-1">
                {getStudentsWithProgram().map((student) => (
                  <li key={student.id}>
                    <TypographySpan>
                      {student.name} {student.programName && `(${student.programName})`}
                    </TypographySpan>
                  </li>
                ))}
              </ul>
              <TypographyP>
                O programa atual do aluno será substituído pelo novo programa e esta ação não pode ser revertida.
              </TypographyP>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={proceedWithAssignment} disabled={isPending}>
              {isPending && <Spinner />}
              Confirmar substituição
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
