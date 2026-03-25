import QuestionList from "@/components/anamnesis/questions/question-list";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH3 } from "@/components/ui/typography";
import { useGetApiAnamnesisById } from "@/gen/hooks/useGetApiAnamnesisById";
import { getApiAnamnesisByIdSuspenseQueryKey } from "@/gen/hooks/useGetApiAnamnesisByIdSuspense";
import { usePutApiAnamnesisById } from "@/gen/hooks/usePutApiAnamnesisById";
import { queryClient } from "@/routes/__root";
import type { AnamnesisQuestion } from "@/schemas";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const DEBOUNCE_MS = 700;

interface EditTrainerAnamnesisDialogProps {
	anamnesisId: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function EditTrainerAnamnesisDialog({
	anamnesisId,
	open,
	onOpenChange,
}: EditTrainerAnamnesisDialogProps) {
	const { mutateAsync: updateAnamnesis, isPending } = usePutApiAnamnesisById();

	const queryEnabled = !!anamnesisId && open;
	const { data, isLoading } = useGetApiAnamnesisById(anamnesisId ?? "", {
		query: {
			enabled: queryEnabled,
		},
	});

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Sync state with server data
	useEffect(() => {
		if (!data) return;
		setName(data.name);
		setDescription(data.description ?? "");
	}, [data]);


	const saveChanges = (nextName: string, nextDescription: string) => {
		if (!anamnesisId) return;

		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(async () => {
			const trimmedName = nextName.trim();
			if (!trimmedName) return;

			await updateAnamnesis(
				{
					id: anamnesisId,
					data: {
						name: trimmedName,
						description: nextDescription.trim() || undefined,
					},
				},
				{
					onSuccess: (updated) => {
						queryClient.setQueryData(
							getApiAnamnesisByIdSuspenseQueryKey(anamnesisId),
							updated,
						);
						toast.success("Anamnese atualizada!");
					},
					onError: () => {
						toast.error("Erro ao salvar alterações.");
					},
				},
			);
		}, DEBOUNCE_MS);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="md:min-w-xl"
			>
				{isLoading || !data || !anamnesisId ? (
					<div className="flex items-center justify-center py-12">
						<Spinner />
					</div>
				) : (
					<>
						<DialogHeader>
							<DialogTitle className="flex items-center justify-between gap-3">
								<span>Editar anamnese</span>
								{isPending ? <Spinner className="size-4" /> : null}
							</DialogTitle>
							<DialogDescription>
								Ajuste as perguntas e os detalhes da anamnese.
							</DialogDescription>
						</DialogHeader>

						<div className="max-h-[calc(100svh-8rem)] space-y-6 overflow-y-auto py-1 sm:max-h-[70vh]">
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="anamnesis-name">Nome</Label>
									<Input
										id="anamnesis-name"
										value={name}
										onChange={(e) => {
											setName(e.target.value);
											saveChanges(e.target.value, description);
										}}
										disabled={isPending}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="anamnesis-description">
										Descrição
									</Label>
									<Textarea
										id="anamnesis-description"
										value={description}
										onChange={(e) => {
											setDescription(e.target.value);
											saveChanges(name, e.target.value);
										}}
										disabled={isPending}
										rows={3}
									/>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<TypographyH3 className="font-medium">Perguntas</TypographyH3>
									<Badge variant="secondary">
										{data.questions.length}
									</Badge>
								</div>

								<QuestionList
									anamnesisId={anamnesisId}
									questions={data.questions as AnamnesisQuestion[]}
								/>
							</div>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}

