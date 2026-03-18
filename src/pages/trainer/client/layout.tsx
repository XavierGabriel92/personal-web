import EditClientSheet from "@/components/clients/sheet/edit-client";
import ClientsTab from "@/components/clients/tab";
import PageTitle from "@/components/core/page-title";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGetApiClientByIdSuspense } from "@/gen/hooks/useGetApiClientByIdSuspense";
import { HelpCircle } from "lucide-react";

interface TrainerLayoutClientProps {
  clientId: string;
}

export default function TrainerLayoutClient({ clientId }: TrainerLayoutClientProps) {
  const { data: client } = useGetApiClientByIdSuspense(clientId);

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
      actions={<EditClientSheet clientId={clientId} />}
    />
    <ClientsTab clientId={clientId} />
  </div>
} 