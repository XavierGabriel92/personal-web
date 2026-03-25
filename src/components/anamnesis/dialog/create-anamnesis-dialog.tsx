import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { getApiAnamnesisSuspenseQueryKey } from "@/gen/hooks/useGetApiAnamnesisSuspense";
import { usePostApiAnamnesisCreate } from "@/gen/hooks/usePostApiAnamnesisCreate";
import { queryClient } from "@/routes/__root";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface CreateAnamnesisDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Called with the new anamnesisId after creation (selection mode). */
	onCreated?: (anamnesisId: string) => void;
}

export default function CreateAnamnesisDialog({
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
	onCreated,
}: CreateAnamnesisDialogProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const open = controlledOpen ?? internalOpen;
	const setOpen = controlledOnOpenChange ?? setInternalOpen;

	const { mutateAsync: createAnamnesis, isPending } =
		usePostApiAnamnesisCreate();

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		await createAnamnesis(
			{
				data: {
					name: name.trim(),
					description: description.trim() || undefined,
				},
			},
			{
				onSuccess: async (data) => {
					await queryClient.invalidateQueries({
						queryKey: getApiAnamnesisSuspenseQueryKey(),
					});
					setOpen(false);
					onCreated?.(data.id);
					resetState();
				},
				onError: () => {
					toast.error("Erro ao criar anamnese. Tente novamente.");
				},
			},
		);
	};

	const resetState = useCallback(() => {
		setName("");
		setDescription("");
	}, []);

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) resetState();
	};

	useEffect(() => {
		if (!open) resetState();
	}, [open, resetState]);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			{controlledOpen === undefined ? (
				<Button size="sm" onClick={() => setOpen(true)}>
					<PlusIcon />
					Nova anamnese
				</Button>
			) : null}
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>Nova anamnese</DialogTitle>
					<DialogDescription>
						Dê um nome e descrição para a anamnese.
					</DialogDescription>
				</DialogHeader>

				<form
					id="create-anamnesis-form"
					onSubmit={handleCreate}
					className="space-y-4 py-2"
				>
					<div className="space-y-2">
						<Label htmlFor="anamnesis-name">Nome *</Label>
						<Input
							id="anamnesis-name"
							placeholder="Ex: Avaliação Inicial"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							autoFocus
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="anamnesis-description">Descrição</Label>
						<Textarea
							id="anamnesis-description"
							placeholder="Descreva o objetivo desta anamnese..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
						/>
					</div>
				</form>

				<DialogFooter>
					<Button
						form="create-anamnesis-form"
						type="submit"
						disabled={isPending || !name.trim()}
					>
						{isPending ? (
							<>
								<Spinner /> Criando...
							</>
						) : (
							"Criar"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

/** Convenience trigger button — same style as the old sheet trigger */
export function CreateAnamnesisButton() {
	return (
		<Button size="sm" type="button">
			<PlusIcon />
			Nova anamnese
		</Button>
	);
}
