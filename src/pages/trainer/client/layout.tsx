import EditClientSheet from "@/components/clients/sheet/edit-client";
import ClientsTab from "@/components/clients/tab";
import PageTitle from "@/components/core/page-title";
import { Badge } from "@/components/ui/badge";
import { useGetApiClientByIdSuspense } from "@/gen/hooks/useGetApiClientByIdSuspense";

interface TrainerLayoutClientProps {
	clientId: string;
}

export default function TrainerLayoutClient({ clientId }: TrainerLayoutClientProps) {
	const { data: client } = useGetApiClientByIdSuspense(clientId);

	return (
		<div className="w-full space-y-6">
			<PageTitle
				title={client.name || client.email || "Aluno sem nome"}
				description={client.goals}
				titleIcon={
					<div className="flex flex-wrap items-center gap-1">
						<Badge variant={client.active ? "success" : "secondary"}>
							{client.active ? "Ativo" : "Inativo"}
						</Badge>
					</div>
				}
				actions={<EditClientSheet clientId={clientId} />}
			/>
			{client.email ? (
				<p className="text-sm text-muted-foreground">
					Email: <span className="text-foreground">{client.email}</span>
				</p>
			) : null}
			<ClientsTab clientId={clientId} />
		</div>
	);
}
