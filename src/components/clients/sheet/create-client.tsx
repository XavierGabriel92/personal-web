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
import { getApiClientsSuspenseQueryKey } from "@/gen/hooks/useGetApiClientsSuspense";
import { usePostApiClientCreate } from "@/gen/hooks/usePostApiClientCreate";
import { queryClient } from "@/routes/__root";
import { useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ClientFormData } from "../form";

type CreateClientSheetProps = {
  Trigger?: React.ReactNode
}

export default function CreateClientSheet({
  Trigger = <Button size="sm">
    <PlusIcon />
    Adicionar aluno
  </Button>
}: CreateClientSheetProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync: createClient, isPending } = usePostApiClientCreate();

  const handleSubmit = async (data: ClientFormData) => {
    await createClient({
      data: {
        name: data.name,
        phone: data.phone,
        goals: data.goals || undefined,
        active: data.active ?? true,
      },
    }, {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries({
          queryKey: getApiClientsSuspenseQueryKey()
        });
        setOpen(false);
        navigate({ to: "/trainer/clients/$clientId/overview", params: { clientId: res.id } });
      },
      onError: () => {
        toast.error("Erro ao criar aluno. Tente novamente.");
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {Trigger}
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
          <CreateClientButton disabled={isPending}>
            {isPending ? <><Spinner /> Criando aluno... </> : "Criar Aluno"}
          </CreateClientButton>
          <SheetClose asChild>
            <Button variant="outline" disabled={isPending}>Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
