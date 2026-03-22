import EditClientSheet from "@/components/clients/sheet/edit-client";
import ClientsTab from "@/components/clients/tab";
import PageTitle from "@/components/core/page-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGetApiClientByIdSuspense } from "@/gen/hooks/useGetApiClientByIdSuspense";
import { usePostApiClientByIdSendInvite } from "@/gen/hooks/usePostApiClientByIdSendInvite";
import { CheckCircle2, HelpCircle, Send } from "lucide-react";
import { toast } from "sonner";

interface TrainerLayoutClientProps {
  clientId: string;
}

export default function TrainerLayoutClient({ clientId }: TrainerLayoutClientProps) {
  const { data: client, refetch } = useGetApiClientByIdSuspense(clientId);
  const { mutateAsync: sendInvite, isPending } = usePostApiClientByIdSendInvite();

  const handleSendInvite = async () => {
    try {
      await sendInvite({ id: clientId });
      toast.success("Convite enviado! O aluno receberá uma mensagem no WhatsApp.");
      refetch();
    } catch {
      toast.error("Erro ao enviar convite. Tente novamente.");
    }
  };

  return (
    <div className="space-y-6 w-full">
      <PageTitle
        title={client.name}
        description={client.phone}
        titleIcon={
          <div className="flex items-center gap-1">
            <Badge variant={client.active ? "success" : "secondary"}>
              {client.active ? "Ativo" : "Inativo"}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  Somente clientes ativos recebem comunicações via WhatsApp
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            {client.whatsappConnected ? (
              <div className="flex items-center gap-1.5 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                WhatsApp conectado
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendInvite}
                disabled={isPending}
              >
                <Send className="h-4 w-4" />
                {isPending ? "Enviando..." : "Enviar convite"}
              </Button>
            )}
            <EditClientSheet clientId={clientId} />
          </div>
        }
      />
      <ClientsTab clientId={clientId} />
    </div>
  );
}
