import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
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
import {
	formatLastWorkoutSessionDate,
	formatWorkoutSessionName,
} from "@/lib/last-workout-session";
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
		<>
			{data.clients.length > 0 ? (
				<div className="space-y-4">
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
								<TableHead>Conta no app</TableHead>
								<TableHead>Ultimo treino registrado</TableHead>
								<TableHead>Data de Cadastro</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredClients.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className="text-center text-muted-foreground"
									>
										Nenhum aluno encontrado
									</TableCell>
								</TableRow>
							) : (
								filteredClients.map((client) => (
									<TableRow
										key={client.id}
										onClick={() =>
											navigate({
												to: "/trainer/clients/$clientId/overview",
												params: { clientId: client.id },
											})
										}
										className="cursor-pointer hover:bg-muted"
									>
									<TableCell className="font-medium">
										{client.name || client.email || "—"}
									</TableCell>
									<TableCell>
										{client.phone || "Aguardando"}
									</TableCell>
										<TableCell>
											<Badge variant={client.active ? "success" : "secondary"}>
												{client.active ? "Ativo" : "Inativo"}
											</Badge>
										</TableCell>
										<TableCell>
											{!client.userId ? (
												<Badge variant="outline">Sem app</Badge>
											) : client.emailVerified ? (
												<Badge variant="success">Confirmado</Badge>
											) : (
												<Badge variant="secondary">Email pendente</Badge>
											)}
										</TableCell>
										<TableCell>
											<div className="min-w-[220px]">
												<p className="font-medium">
													{formatWorkoutSessionName(
														client.lastWorkoutSession?.workoutName,
													)}
												</p>
												<p className="text-xs text-muted-foreground">
													{formatLastWorkoutSessionDate(
														client.lastWorkoutSession?.createdAt,
													)}
												</p>
											</div>
										</TableCell>
										<TableCell>
											{formatDateToLocaleString(client.createdAt)}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			) : (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<UserIcon />
						</EmptyMedia>
						<EmptyTitle>Nenhum aluno criado</EmptyTitle>
						<EmptyDescription>
							Crie um aluno para começar a usar o sistema
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<CreateClientSheet />
					</EmptyContent>
				</Empty>
			)}
		</>
	);
}
