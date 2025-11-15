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
    label: "Pendentes",
    value: "pending",
  },
];

// Mock data
const mockClients = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "(11) 98765-4321",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@example.com",
    phone: "(11) 97654-3210",
    status: "active",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@example.com",
    phone: "(11) 96543-2109",
    status: "pending",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana.costa@example.com",
    phone: "(11) 95432-1098",
    status: "active",
    createdAt: "2024-01-05",
  },
  {
    id: "5",
    name: "Carlos Ferreira",
    email: "carlos.ferreira@example.com",
    phone: "(11) 94321-0987",
    status: "pending",
    createdAt: "2024-03-25",
  },
];

export default function ClientsList() {
  const data = mockClients;
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const navigate = useNavigate();

  const filteredClients =
    activeFilter === "all"
      ? data
      : data.filter((client) => client.status === activeFilter);

  return (
    <>{data.length > 0 ? <div className="space-y-4">
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
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Status</TableHead>
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
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  <Badge variant={client.status === "active" ? "success" : "warning"}>
                    {client.status === "active" ? "Ativo" : "Pendente"}
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
          <EmptyTitle>Nenhun aluno criado</EmptyTitle>
          <EmptyDescription>Crie um aluno para começar a usar o sistema</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateClientSheet />
        </EmptyContent>
      </Empty>

    }</>
  );
}