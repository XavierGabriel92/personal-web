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
import WorkoutForm, { CreateWorkoutButton } from "@/components/workout/form";
import type { WorkoutFormData } from "@/components/workout/form";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateWorkoutSheet() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: WorkoutFormData) => {
    // TODO: redirect to the workout page when done
    console.log(data);
    setTimeout(() => {
      toast.success(`Treino ${data.name} criado com sucesso!`);
      setOpen(false);
    }, 1000);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Novo treino
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Criar novo treino</SheetTitle>
          <SheetDescription>
            Preencha os dados abaixo para criar um novo treino.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <WorkoutForm onSubmit={handleSubmit} />
        </div>
        <SheetFooter>
          <CreateWorkoutButton>Criar Treino</CreateWorkoutButton>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

