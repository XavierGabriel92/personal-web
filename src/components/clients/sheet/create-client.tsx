import ClientForm, { CreateClientButton } from "@/components/clients/form";
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
import type { ClientFormData } from "../form";

export default function CreateClientSheet() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: ClientFormData) => {
    console.log(data);
    // TODO: Handle API call to create client
    // After successful creation, close the sheet
    toast.success(`Aluno ${data.name} atualizado com sucesso!`);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="sm">
          <PlusIcon />
          Adicionar aluno
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Criar novo aluno</SheetTitle>
          <SheetDescription>
            Preencha os dados abaixo para criar um novo aluno.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <ClientForm onSubmit={handleSubmit} />
        </div>
        <SheetFooter>
          <CreateClientButton>Criar Aluno</CreateClientButton>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}