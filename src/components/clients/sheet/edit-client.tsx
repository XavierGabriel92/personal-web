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
import { Spinner } from "@/components/ui/spinner";
import { getApiClientByIdSuspenseQueryKey } from "@/gen/hooks/useGetApiClientByIdSuspense";
import { useGetApiClientByIdSuspense } from "@/gen/hooks/useGetApiClientByIdSuspense";
import { getApiClientsSuspenseQueryKey } from "@/gen/hooks/useGetApiClientsSuspense";
import { usePutApiClientById } from "@/gen/hooks/usePutApiClientById";
import { queryClient } from "@/routes/__root";
import { AlertTriangle, PencilIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ClientFormData } from "../form";

interface EditClientSheetProps {
  clientId: string;
}

export default function EditClientSheet({ clientId }: EditClientSheetProps) {
  const [open, setOpen] = useState(false);
  const { data: client } = useGetApiClientByIdSuspense(clientId);
  const { mutateAsync: updateClient, isPending } = usePutApiClientById();

  const handleSubmit = async (data: ClientFormData) => {
    await updateClient({
      id: clientId,
      data: {
        name: data.name,
        phone: data.phone,
        goals: data.goals || undefined,
        active: data.active ?? true,
      },
    }, {
      onSuccess: async () => {
        toast.success(`Aluno ${data.name} atualizado com sucesso!`);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getApiClientsSuspenseQueryKey()
          }),
          queryClient.invalidateQueries({
            queryKey: getApiClientByIdSuspenseQueryKey(clientId)
          }),
        ]);
        setOpen(false);
      },
      onError: () => {
        toast.error("Erro ao atualizar aluno. Tente novamente.");
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
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
        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          {client.whatsappConnected && (
            <div className="flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Ao alterar o número, o WhatsApp será desconectado e o aluno precisará ativar novamente.</span>
            </div>
          )}
          <ClientForm
            onSubmit={handleSubmit}
            initialValues={{
              name: client.name,
              phone: client.phone,
              goals: client.goals,
              active: client.active,
            }}
          />
        </div>
        <SheetFooter>
          <CreateClientButton disabled={isPending}>
            {isPending ? <><Spinner /> Salvando... </> : "Salvar"}
          </CreateClientButton>
          <SheetClose asChild>
            <Button variant="outline" disabled={isPending}>Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
