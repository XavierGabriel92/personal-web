import AnamnesisAnswersDialog from "@/components/anamnesis/dialog/aswer-anamnesis-dialog";
import EditClientAnamnesisDialog from "@/components/anamnesis/dialog/edit-client-anamnesis-dialog";
import SelectAnamnesisForClientDialog from "@/components/anamnesis/dialog/select-anamnesis-for-client";
import PageTitle from "@/components/core/page-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { TypographyP } from "@/components/ui/typography";
import { getApiClientByIdAnamnesisSuspenseQueryKey } from "@/gen/hooks/useGetApiClientByIdAnamnesisSuspense";
import { useGetApiClientByIdAnamnesisSuspense } from "@/gen/hooks/useGetApiClientByIdAnamnesisSuspense";
import { useGetApiClientByIdSuspense } from "@/gen/hooks/useGetApiClientByIdSuspense";
import { usePostApiClientByIdAnamnesisByClientAnamnesisIdSend } from "@/gen/hooks/usePostApiClientByIdAnamnesisByClientAnamnesisIdSend";
import type { GetApiClientByIdAnamnesis200 } from "@/gen/types/GetApiClientByIdAnamnesis";
import { queryClient } from "@/routes/__root";
import { ClipboardList, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type ClientAnamnesis = GetApiClientByIdAnamnesis200["anamnesis"][number];

interface TrainerClientAnamnesisPageProps {
	clientId: string;
}

export default function TrainerClientAnamnesisPage({
	clientId,
}: TrainerClientAnamnesisPageProps) {
	const { data: client } = useGetApiClientByIdSuspense(clientId);
	const { data } = useGetApiClientByIdAnamnesisSuspense(clientId);
	const [selectDialogOpen, setSelectDialogOpen] = useState(false);
	const [editingAnamnesis, setEditingAnamnesis] =
		useState<ClientAnamnesis | null>(null);
	const [answersAnamnesis, setAnswersAnamnesis] =
		useState<ClientAnamnesis | null>(null);

	const sortedAnamnesis = useMemo(
		() =>
			[...data.anamnesis].sort(
				(left, right) =>
					new Date(right.createdAt).getTime() -
					new Date(left.createdAt).getTime(),
			),
		[data.anamnesis],
	);

	return (
		<>
			<div className="space-y-6">
				<PageTitle
					title="Anamnese"
					description="Acompanhe os envios, respostas e ajustes das anamneses deste aluno."
					actions={
						<Button size="sm" onClick={() => setSelectDialogOpen(true)}>
							Enviar anamnese
						</Button>
					}
				/>

				{sortedAnamnesis.length === 0 ? (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<ClipboardList />
							</EmptyMedia>
							<EmptyTitle>Nenhuma anamnese enviada</EmptyTitle>
							<EmptyDescription>
								Envie uma anamnese para começar a coletar as respostas do aluno.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button onClick={() => setSelectDialogOpen(true)}>
								Enviar anamnese
							</Button>
						</EmptyContent>
					</Empty>
				) : (
					<div className="space-y-4">
						{sortedAnamnesis.map((anamnesis) => (
							<ClientAnamnesisCard
								key={anamnesis.id}
								clientId={clientId}
								anamnesis={anamnesis}
								onOpenPending={() => setEditingAnamnesis(anamnesis)}
								onOpenFinished={() => setAnswersAnamnesis(anamnesis)}
							/>
						))}
					</div>
				)}
			</div>

			<SelectAnamnesisForClientDialog
				clientId={clientId}
				clientName={client.name}
				open={selectDialogOpen}
				onOpenChange={setSelectDialogOpen}
				onDone={() => {
					setSelectDialogOpen(false);
				}}
			/>

			<EditClientAnamnesisDialog
				clientId={clientId}
				anamnesis={editingAnamnesis}
				open={!!editingAnamnesis}
				onOpenChange={(open) => {
					if (!open) setEditingAnamnesis(null);
				}}
			/>

			<AnamnesisAnswersDialog
				anamnesis={answersAnamnesis}
				open={!!answersAnamnesis}
				onOpenChange={(open) => {
					if (!open) setAnswersAnamnesis(null);
				}}
			/>
		</>
	);
}

function ClientAnamnesisCard({
	clientId,
	anamnesis,
	onOpenPending,
	onOpenFinished,
}: {
	clientId: string;
	anamnesis: ClientAnamnesis;
	onOpenPending: () => void;
	onOpenFinished: () => void;
}) {
	const { mutateAsync: sendAnamnesis, isPending } =
		usePostApiClientByIdAnamnesisByClientAnamnesisIdSend();

	const badgeVariant = anamnesis.status === "FINISHED" ? "success" : "warning";

	const handleSend = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();

		await sendAnamnesis(
			{ id: clientId, clientAnamnesisId: anamnesis.id },
			{
				onSuccess: async () => {
					toast.success("Anamnese enviada com sucesso!");
					await queryClient.invalidateQueries({
						queryKey: getApiClientByIdAnamnesisSuspenseQueryKey(clientId),
					});
				},
				onError: (error) => {
					if (error.response?.status === 429) {
						toast.error("Aguarde 2 dias entre envios para este aluno");
						return;
					}

					toast.error(
						error.response?.data?.message ??
						"Erro ao enviar anamnese. Tente novamente.",
					);
				},
			},
		);
	};

	const handleOpen = () => {
		if (anamnesis.status === "PENDING") {
			onOpenPending();
			return;
		}

		onOpenFinished();
	};

	return (
		<Card className="group cursor-pointer gap-0" onClick={handleOpen}>
			<CardHeader>
				<div className="space-y-2">
					<CardTitle>{anamnesis.name}</CardTitle>
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant={badgeVariant}>
							{anamnesis.status === "PENDING" ? "Pendente" : "Finalizada"}
						</Badge>
						<Badge variant="secondary">
							{anamnesis.questions.length}{" "}
							{anamnesis.questions.length === 1 ? "pergunta" : "perguntas"}
						</Badge>
					</div>
				</div>

				{anamnesis.status === "PENDING" ? (
					<CardAction>
						<Button
							size="sm"
							variant="outline"
							onClick={handleSend}
							disabled={isPending}
							className="opacity-100 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
						>
							{isPending ? (
								<Spinner className="h-4 w-4" />
							) : (
								<Send className="h-4 w-4" />
							)}
							Enviar anamnese
						</Button>
					</CardAction>
				) : null}
			</CardHeader>

			<CardContent className="space-y-2">
				{anamnesis.description ? (
					<TypographyP className="text-sm text-muted-foreground">
						{anamnesis.description}
					</TypographyP>
				) : null}
				<TypographyP className="text-xs text-muted-foreground">
					{anamnesis.status === "PENDING"
						? "Clique para editar as perguntas pendentes."
						: "Clique para visualizar as respostas enviadas pelo aluno."}
				</TypographyP>
			</CardContent>
		</Card>
	);
}
