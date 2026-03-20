import EditClientSheet from "@/components/clients/sheet/edit-client";
import ClientsTab from "@/components/clients/tab";
import PageTitle from "@/components/core/page-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGetApiClientByIdSuspense } from "@/gen/hooks/useGetApiClientByIdSuspense";
import { usePostApiClientByIdWhatsappInvite } from "@/gen/hooks/usePostApiClientByIdWhatsappInvite";
import { Check, Copy, HelpCircle, Share2 } from "lucide-react";
import { useState } from "react";
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
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShareWhatsapp = async () => {
    try {
      const { whatsappToken } = await generateInvite({ id: clientId });
      setInviteUrl(buildWhatsappInviteUrl(whatsappToken));
    } catch {
      toast.error("Erro ao gerar link de convite. Tente novamente.");
    }
  };

  const handleCopy = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return <>
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

    <Dialog open={!!inviteUrl} onOpenChange={(open) => { if (!open) setInviteUrl(null); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link de convite</DialogTitle>
          <DialogDescription>
            Compartilhe esse link com seu aluno para que ele conecte o WhatsApp e comece a receber acompanhamento pelo assistente.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
          <span className="flex-1 truncate text-sm text-muted-foreground">{inviteUrl}</span>
          <Button variant="ghost" size="icon" onClick={handleCopy} className="shrink-0">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </>
} 