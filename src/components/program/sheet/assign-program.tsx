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
import { TypographyP, TypographySpan } from "@/components/ui/typography";
import { UserCheck } from "lucide-react";
import { useState } from "react";
import AssignStudentList from "./assisgn-student-list";

interface AssignProgramSheetProps {
  programId: string;
  trigger?: React.ReactElement;
}

const mockStudents = {
  withProgram: [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      image: "https://lh3.googleusercontent.com/a/ACg8ocLAG15CElubSuQf-_xgSNkrXM-r4tJH6owjtO06gc_Bz6dgKPkh=s96-c",
      programName: "Treino 4x na semana"
    },
    {
      id: "2",
      name: "Maria Cristina",
      email: "maria.cristina@example.com",
      image: null,
      programName: "Push pull legs"
    },
  ],
  withoutProgram: [
    {
      id: "3",
      name: "João Silva",
      email: "joao.silva@example.com",
      image: null,
      programName: null
    },
  ],
}

export default function AssignProgramSheet({ programId: _programId, trigger = <Button size="sm" variant="outline"> <UserCheck />Atribuir programa</Button> }: AssignProgramSheetProps) {
  const data = mockStudents;

  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset selection when sheet closes
      setSelectedIds(new Set());
      setConfirmDialogOpen(false);
    }
  };

  const getSelectedStudents = () => {
    return [
      ...data.withProgram.filter((s) => selectedIds.has(s.id)),
      ...data.withoutProgram.filter((s) => selectedIds.has(s.id)),
    ];
  };

  const getStudentsWithProgram = () => {
    const selectedStudents = getSelectedStudents();
    return selectedStudents.filter((s) => s.programName != null);
  };

  const hasStudentsWithProgram = () => {
    return getStudentsWithProgram().length > 0;
  };

  const handleAssignProgram = () => {
    // Check if any selected students have an existing program
    if (hasStudentsWithProgram()) {
      setConfirmDialogOpen(true);
    } else {
      proceedWithAssignment();
    }
  };

  const proceedWithAssignment = () => {
    const selectedStudents = getSelectedStudents();
    console.log("Selected users:", selectedStudents);
    // TODO: Implement actual assignment logic
    setConfirmDialogOpen(false);
    setOpen(false);
    setSelectedIds(new Set());
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
          <AssignStudentList
            students={data.withoutProgram}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            title="Alunos sem programa"
          />

          <AssignStudentList
            students={data.withProgram}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            title="Alunos com programa"
          />

        </div>
        <SheetFooter>
          <Button onClick={handleAssignProgram}>Atribuir programa</Button>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
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
                O programa atual do alunoserá substituído pelo novo programa e esta ação não pode ser revertida.
              </TypographyP>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={proceedWithAssignment}>
              Confirmar substituição
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}

