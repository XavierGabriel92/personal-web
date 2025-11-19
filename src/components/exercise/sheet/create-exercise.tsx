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
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ExerciseFormData } from "../form";

interface CreateExerciseSheetProps {
  trigger?: React.ReactNode;
}

const defaultTrigger = <Button variant="ghost" className="justify-start text-primary hover:text-primary">
  <PlusIcon />
  Novo exercício
</Button>


export default function CreateExerciseSheet({ trigger = defaultTrigger }: CreateExerciseSheetProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: ExerciseFormData) => {
    console.log(data);
    setTimeout(() => {
      toast.success(`Exercício ${data.name} criado com sucesso!`);
      setOpen(false);
    }, 1000);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Criar novo exercício</SheetTitle>
          <SheetDescription>
            Preencha os dados abaixo para criar um novo exercício.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <ExerciseForm onSubmit={handleSubmit} />
        </div>
        <SheetFooter>
          <CreateExerciseButton>Criar Exercício</CreateExerciseButton>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

