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
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ClientFormData } from "../form";


const mockClient = {
  id: "5",
  name: "Carlos Ferreira",
  email: "carlos.ferreira@example.com",
  phone: "(11) 94321-0987",
  status: "pending",
  createdAt: "2024-03-25",
}

export default function EditClientSheet() {
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
          size="sm"
          variant="outline"
        >
          <PencilIcon />
          Editar aluno
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Editar Aluno</SheetTitle>
          <SheetDescription>
            Preencha os dados abaixo para editar o aluno.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <ClientForm onSubmit={handleSubmit} initialValues={mockClient} />
        </div>
        <SheetFooter>
          <CreateClientButton>Salvar Aluno</CreateClientButton>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}