import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDateToLocaleString } from "@/lib/date";
import {
	formatLastWorkoutSessionDate,
	formatWorkoutSessionName,
} from "@/lib/last-workout-session";
import type { GetApiClients200 } from "@/gen/types/GetApiClients";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

type ApiClient = GetApiClients200["clients"][number];

interface AnalyticsClientsListProps {
	clients: ApiClient[];
	activeClientIds: Set<string>;
	periodLabel: string;
}

const filters = [
	{ label: "Todos", value: "all" },
	{ label: "Ativos", value: "active" },
	{ label: "Inativos", value: "inactive" },
];

export default function AnalyticsClientsList({
	clients,
	activeClientIds,
	periodLabel,
}: AnalyticsClientsListProps) {
	const [activeFilter, setActiveFilter] = useState<string>("all");
	const navigate = useNavigate();

	const filteredClients =
		activeFilter === "all"
			? clients
			: activeFilter === "active"
				? clients.filter((c) => activeClientIds.has(c.id))
				: clients.filter((c) => !activeClientIds.has(c.id));

	return (
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
						<TableHead>Ativo {periodLabel}</TableHead>
						<TableHead>Ultimo treino registrado</TableHead>
						<TableHead>Data de Cadastro</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredClients.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={5}
								className="text-center text-muted-foreground"
							>
								Nenhum aluno encontrado
							</TableCell>
						</TableRow>
					) : (
						filteredClients.map((client) => {
							const isActive = activeClientIds.has(client.id);
							return (
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
										{client.name ?? "—"}
									</TableCell>
									<TableCell>{client.phone ?? "—"}</TableCell>
									<TableCell>
										<Badge variant={isActive ? "success" : "secondary"}>
											{isActive ? "Ativo" : "Inativo"}
										</Badge>
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
							);
						})
					)}
				</TableBody>
			</Table>
		</div>
	);
}
