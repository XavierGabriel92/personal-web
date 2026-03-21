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
import { Check, Copy, PlusIcon } from "lucide-react";
import { useState } from "react";

function InviteLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Compartilhe esse link com seu aluno para que ele conecte o WhatsApp e comece a receber acompanhamento pelo assistente.
      </p>
      <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
        <span className="flex-1 truncate text-sm text-muted-foreground">{url}</span>
        <Button variant="ghost" size="icon" onClick={handleCopy} className="shrink-0">
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
import { toast } from "sonner";
import type { ClientFormData } from "../form";

type CreatedClient = { id: string; name: string; whatsappToken?: string };

function buildWhatsappInviteUrl(token: string): string {
  const botPhone = import.meta.env.VITE_WHATSAPP_BOT_PHONE as string | undefined;
  const text = encodeURIComponent(`Oi! Meu código é ${token}`);
  return `https://wa.me/${botPhone ?? ""}?text=${text}`;
}

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
        {Trigger}
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
            <div className="flex-1 flex flex-col justify-center gap-3 px-4">
              {created.whatsappToken && (
                <InviteLink url={buildWhatsappInviteUrl(created.whatsappToken)} />
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