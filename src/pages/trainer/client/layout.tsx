import EditClientSheet from "@/components/clients/sheet/edit-client";
import ClientsTab from "@/components/clients/tab";
import PageTitle from "@/components/core/page-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGetApiClientByIdSuspense } from "@/gen/hooks/useGetApiClientByIdSuspense";
import { usePostApiClientByIdWhatsappInvite } from "@/gen/hooks/usePostApiClientByIdWhatsappInvite";
import { HelpCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

function buildWhatsappInviteUrl(token: string): string {
  const botPhone = import.meta.env.VITE_WHATSAPP_BOT_PHONE as string | undefined;
  const text = encodeURIComponent(`Oi! Meu código é ${token}`);
  return `https://wa.me/${botPhone ?? ""}?text=${text}`;
}

interface TrainerLayoutClientProps {
  clientId: string;
}

export default function TrainerLayoutClient({ clientId }: TrainerLayoutClientProps) {
  const { data: client } = useGetApiClientByIdSuspense(clientId);
  const { mutateAsync: generateInvite, isPending } = usePostApiClientByIdWhatsappInvite();

  const handleShareWhatsapp = async () => {
    try {
      const { whatsappToken } = await generateInvite({ id: clientId });
      window.open(buildWhatsappInviteUrl(whatsappToken), "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Erro ao gerar link de convite. Tente novamente.");
    }
  };

  return <div className="space-y-6 w-full">
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareWhatsapp}
            disabled={isPending}
          >
            <Share2 className="h-4 w-4" />
            Convidar via WhatsApp
          </Button>
          <EditClientSheet clientId={clientId} />
        </div>
      }
    />
    <ClientsTab clientId={clientId} />
  </div>
} 