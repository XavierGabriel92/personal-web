import ExerciseForm, { CreateExerciseButton } from "@/components/exercise/form";
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
import { useState } from "react";
import { toast } from "sonner";
import type { ExerciseFormData } from "../form";

type Exercise = {
  id: string;
  name: string;
  img?: string;
  type: string;
  primaryMuscle: string;
  otherMuscles?: string[];
  instructions?: string[];
  video?: string;
};

interface EditExerciseSheetProps {
  exercise: Exercise;
  trigger?: React.ReactNode;
  onSubmit?: (data: ExerciseFormData) => void;
}

const defaultTrigger = (
  <Button variant="outline" size="sm">
    Editar exercício
  </Button>
);

export default function EditExerciseSheet({
  exercise,
  trigger = defaultTrigger,
  onSubmit,
}: EditExerciseSheetProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: ExerciseFormData) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log(data);
      setTimeout(() => {
        toast.success(`Exercício ${data.name} atualizado com sucesso!`);
        setOpen(false);
      }, 1000);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Editar exercício</SheetTitle>
          <SheetDescription>
            Atualize os dados do exercício abaixo.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <ExerciseForm onSubmit={handleSubmit} initialValues={exercise} />
        </div>
        <SheetFooter>
          <CreateExerciseButton>Salvar Alterações</CreateExerciseButton>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

