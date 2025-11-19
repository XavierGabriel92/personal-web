import ProgramForm, { CreateProgramButton } from "@/components/program/form";
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
import type { ProgramFormData } from "../form";


export default function CreateProgramSheet() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: ProgramFormData) => {
    console.log(data);
    setTimeout(() => {
      toast.success(`Programa ${data.name} criado com sucesso!`);
      setOpen(false);
    }, 1000);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Novo programa
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Criar novo programa</SheetTitle>
          <SheetDescription>
            Preencha os dados abaixo para criar um novo programa.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <ProgramForm onSubmit={handleSubmit} />
        </div>
        <SheetFooter>
          <CreateProgramButton>Criar Programa</CreateProgramButton>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

