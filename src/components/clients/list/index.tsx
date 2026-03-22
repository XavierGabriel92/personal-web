import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGetApiClientsSuspense } from "@/gen/hooks/useGetApiClientsSuspense";
import { formatDateToLocaleString } from "@/lib/date";
import { useNavigate } from "@tanstack/react-router";
import { UserIcon } from "lucide-react";
import { useState } from "react";
import CreateClientSheet from "../sheet/create-client";

const filters = [
  {
    label: "Todos",
    value: "all",
  },
  {
    label: "Ativos",
    value: "active",
  },
  {
    label: "Inativos",
    value: "inactive",
  },
];

export default function ClientsList() {
  const { data } = useGetApiClientsSuspense();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const navigate = useNavigate();

  const filteredClients =
    activeFilter === "all"
      ? data.clients
      : activeFilter === "active"
        ? data.clients.filter((client) => client.active)
        : data.clients.filter((client) => !client.active);

  return (
    <>{data.clients.length > 0 ? <div className="space-y-4">
      <div className="flex gap-2">
        {filters.map((filter) => (
          <Button
            size="sm"
            key={filter.value}
            variant={activeFilter === filter.value ? "active" : "outline"}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Data de Cadastro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Nenhum aluno encontrado
              </TableCell>
            </TableRow>
          ) : (
            filteredClients.map((client) => (
              <TableRow key={client.id}
                onClick={() => navigate({ to: "/trainer/clients/$clientId/overview", params: { clientId: client.id } })}
                className="cursor-pointer hover:bg-muted">
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  <Badge variant={client.active ? "success" : "secondary"}>
                    {client.active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={client.whatsappConnected ? "success" : "secondary"}>
                    {client.whatsappConnected ? "Conectado" : "Pendente"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDateToLocaleString(client.createdAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div> :

      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UserIcon />
          </EmptyMedia>
          <EmptyTitle>Nenhum aluno criado</EmptyTitle>
          <EmptyDescription>Crie um aluno para começar a usar o sistema</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateClientSheet />
        </EmptyContent>
      </Empty>

    }</>
  );
}