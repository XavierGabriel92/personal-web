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
import { MessageCircle, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ClientFormData } from "../form";

type CreatedClient = { id: string; name: string; whatsappToken?: string };

function buildWhatsappInviteUrl(token: string): string {
  const botPhone = import.meta.env.VITE_WHATSAPP_BOT_PHONE as string | undefined;
  const text = encodeURIComponent(`Oi! Meu código é ${token}`);
  return `https://wa.me/${botPhone ?? ""}?text=${text}`;
}

export default function CreateClientSheet() {
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState<CreatedClient | null>(null);
  const navigate = useNavigate();

  const { mutateAsync: createClient, isPending } = usePostApiClientCreate();

  const handleSubmit = async (data: ClientFormData) => {
    await createClient({
      data: {
        name: data.name,
        phone: data.phone,
        goals: data.goals || undefined,
      },
    }, {
      onSuccess: async (res) => {
        const response = res as typeof res & { whatsappToken?: string };
        await queryClient.invalidateQueries({
          queryKey: getApiClientsSuspenseQueryKey()
        });
        setCreated({ id: response.id, name: response.name, whatsappToken: response.whatsappToken });
      },
      onError: () => {
        toast.error("Erro ao criar aluno. Tente novamente.");
      }
    });
  };

  const handleGoToProfile = () => {
    if (!created) return;
    setOpen(false);
    setCreated(null);
    navigate({ to: "/trainer/clients/$clientId/overview", params: { clientId: created.id } });
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setCreated(null);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Adicionar aluno
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        {created ? (
          <>
            <SheetHeader>
              <SheetTitle>Aluno criado! 🎉</SheetTitle>
              <SheetDescription>
                {created.name} foi adicionado com sucesso. Compartilhe o link do WhatsApp para ele começar.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
              {created.whatsappToken && (
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  asChild
                >
                  <a
                    href={buildWhatsappInviteUrl(created.whatsappToken)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Compartilhar no WhatsApp
                  </a>
                </Button>
              )}
            </div>
            <SheetFooter>
              <Button onClick={handleGoToProfile}>Ir para o perfil</Button>
              <SheetClose asChild>
                <Button variant="outline">Fechar</Button>
              </SheetClose>
            </SheetFooter>
          </>
        ) : (
          <>
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
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}