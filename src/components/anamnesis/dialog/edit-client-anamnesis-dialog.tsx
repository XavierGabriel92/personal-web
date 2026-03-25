import ClientAnamnesisQuestionList from "@/components/anamnesis/questions/client-anamnesis-question-list";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH3 } from "@/components/ui/typography";
import type { GetApiClientByIdAnamnesis200 } from "@/gen/types/GetApiClientByIdAnamnesis";

type ClientAnamnesis = GetApiClientByIdAnamnesis200["anamnesis"][number];

interface EditClientAnamnesisDialogProps {
	clientId: string;
	anamnesis: ClientAnamnesis | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function EditClientAnamnesisDialog({
	clientId,
	anamnesis,
	open,
	onOpenChange,
}: EditClientAnamnesisDialogProps) {
	const isPending = anamnesis?.status === "PENDING";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl">
				{!anamnesis ? null : (
					<>
						<DialogHeader>
							<DialogTitle>Editar anamnese do aluno</DialogTitle>
							<DialogDescription>
								Ajuste as perguntas enquanto a anamnese ainda estiver pendente.
							</DialogDescription>
						</DialogHeader>

						<div className="max-h-[70vh] space-y-6 overflow-y-auto py-1">
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="client-anamnesis-name">Nome</Label>
									<Input
										id="client-anamnesis-name"
										value={anamnesis.name}
										readOnly
										className="bg-muted/30"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="client-anamnesis-description">
										Descrição
									</Label>
									<Textarea
										id="client-anamnesis-description"
										value={anamnesis.description ?? ""}
										readOnly
										className="bg-muted/30"
										rows={3}
									/>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<TypographyH3 className="font-medium">Perguntas</TypographyH3>
									<Badge variant="secondary">
										{anamnesis.questions.length}
									</Badge>
								</div>

								{isPending ? (
									<ClientAnamnesisQuestionList
										clientId={clientId}
										clientAnamnesisId={anamnesis.id}
										questions={anamnesis.questions}
									/>
								) : null}
							</div>
						</div>

						<DialogFooter>
							<Button onClick={() => onOpenChange(false)}>Concluir</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
