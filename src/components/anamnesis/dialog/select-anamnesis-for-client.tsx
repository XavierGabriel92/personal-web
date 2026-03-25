import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { TypographyP, TypographySpan } from "@/components/ui/typography";
import { useGetApiAnamnesisSuspense } from "@/gen/hooks/useGetApiAnamnesisSuspense";
import { getApiClientByIdAnamnesisSuspenseQueryKey } from "@/gen/hooks/useGetApiClientByIdAnamnesisSuspense";
import { usePostApiClientByIdAnamnesis } from "@/gen/hooks/usePostApiClientByIdAnamnesis";
import { queryClient } from "@/routes/__root";
import { ClipboardList } from "lucide-react";
import { Suspense, useState } from "react";
import { toast } from "sonner";

interface SelectAnamnesisForClientDialogProps {
	clientId: string;
	clientName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDone: () => void;
}

export default function SelectAnamnesisForClientDialog({
	clientId,
	clientName,
	open,
	onOpenChange,
	onDone,
}: SelectAnamnesisForClientDialogProps) {
	const [selectedAnamnesisId, setSelectedAnamnesisId] = useState<string | null>(
		null,
	);

	const handleOpenChange = (isOpen: boolean) => {
		onOpenChange(isOpen);
		if (!isOpen) setSelectedAnamnesisId(null);
	};

	const handleSkip = () => {
		handleOpenChange(false);
		onDone();
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="md:min-w-xl">
				<DialogHeader >
					<DialogTitle>
						Qual anamnese você gostaria de enviar para {clientName}?
					</DialogTitle>
					<DialogDescription>
						Escolha uma anamnese da sua biblioteca para enviar ao aluno.
					</DialogDescription>
				</DialogHeader>
				<Suspense fallback={<Spinner className="mx-auto my-4" />}>
					<AnamnesisPickerList
						clientId={clientId}
						selectedId={selectedAnamnesisId}
						onSelect={setSelectedAnamnesisId}
						onDone={onDone}
						onClose={() => handleOpenChange(false)}
						onSkip={handleSkip}
					/>
				</Suspense>
			</DialogContent>
		</Dialog>
	);
}

function AnamnesisPickerList({
	clientId,
	selectedId,
	onSelect,
	onDone,
	onClose,
	onSkip,
}: {
	clientId: string;
	selectedId: string | null;
	onSelect: (id: string | null) => void;
	onDone: () => void;
	onClose: () => void;
	onSkip: () => void;
}) {
	const { data } = useGetApiAnamnesisSuspense();
	const { mutateAsync: assign, isPending } = usePostApiClientByIdAnamnesis();

	const handleConfirm = async () => {
		if (!selectedId) return;

		await assign(
			{ id: clientId, data: { anamnesisId: selectedId } },
			{
				onSuccess: async () => {
					toast.success("Anamnese enviada com sucesso!");
					await queryClient.invalidateQueries({
						queryKey: getApiClientByIdAnamnesisSuspenseQueryKey(clientId),
					});
					onClose();
					onDone();
				},
				onError: () => {
					toast.error("Erro ao enviar anamnese. Tente novamente.");
				},
			},
		);
	};

	return (
		<>
			<div className="flex max-h-120 min-h-32 gap-2 overflow-y-auto flex-col">
				{data.anamnesis.length === 0 ? (
					<Empty className="md:col-span-2">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<ClipboardList />
							</EmptyMedia>
							<EmptyTitle>Nenhuma anamnese na biblioteca</EmptyTitle>
							<EmptyDescription>
								Crie uma nova anamnese para começar
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : (
					data.anamnesis.map((item) => (
						<Button
							key={item.id}
							variant={selectedId === item.id ? "active" : "outline"}
							className="h-auto w-full justify-start rounded-xl p-4"
							onClick={() => onSelect(selectedId === item.id ? null : item.id)}
						>
							<div className="flex w-full min-w-0 items-center justify-between gap-3">
								<TypographySpan className="font-medium">
									{item.name}
								</TypographySpan>
								<Badge variant="secondary" className="text-xs shrink-0">
									{item.questions.length}{" "}
									{item.questions.length === 1 ? "pergunta" : "perguntas"}
								</Badge>
							</div>
							{item.description && (
								<TypographyP className="text-muted-foreground text-sm text-left line-clamp-1 w-full">
									{item.description}
								</TypographyP>
							)}
						</Button>
					))
				)}
			</div>

			<DialogFooter className="border-t pt-4">
				<Button variant="ghost" onClick={onSkip}>
					Pular por agora
				</Button>
				<Button
					onClick={handleConfirm}
					disabled={!selectedId || isPending}
					className="gap-2"
				>
					{isPending ? <Spinner /> : null}
					Confirmar
				</Button>
			</DialogFooter>
		</>
	);
}
