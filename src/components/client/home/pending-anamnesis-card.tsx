import { AnamnesisStatusBadge } from "@/components/client/anamnesis/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TypographyP, TypographySpanXSmall } from "@/components/ui/typography";
import type { GetApiClientMeHome200 } from "@/gen/types/GetApiClientMeHome";
import { Link } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";

interface PendingAnamnesisCardProps {
	anamnesis: NonNullable<GetApiClientMeHome200["pendingAnamnesis"]>;
}

export function PendingAnamnesisCard({
	anamnesis,
}: PendingAnamnesisCardProps) {
	const isPending = anamnesis.status === "PENDING";
	const hasProgress =
		anamnesis.answeredCount > 0 &&
		anamnesis.answeredCount < anamnesis.questionCount;
	const questionSummary = hasProgress
		? `${anamnesis.answeredCount} de ${anamnesis.questionCount} perguntas respondidas`
		: `${anamnesis.questionCount} ${anamnesis.questionCount === 1 ? "pergunta" : "perguntas"}`;
	const statusSummary = isPending
		? "Pendente de resposta"
		: "Aguardando confirmação";

	return (
		<Alert
			className="gap-y-2 border-dashed bg-muted/30"
		>
			<ClipboardList className="text-muted-foreground" />

			<div className="col-start-2 space-y-4">
				<div className="space-y-2">
					<div className="flex flex-wrap items-center gap-2">
						<TypographySpanXSmall className="text-muted-foreground">
							Anamnese pendente
						</TypographySpanXSmall>
						<AnamnesisStatusBadge status={anamnesis.status} />
					</div>

					<AlertTitle className="line-clamp-none">{anamnesis.name}</AlertTitle>

					<AlertDescription className="gap-2">
						<TypographyP className="text-muted-foreground">
							{statusSummary} · {questionSummary}
						</TypographyP>
					</AlertDescription>
				</div>

				<Button asChild className="w-full">
					<Link
						to="/client/anamneses/$clientAnamnesisId/respond"
						params={{ clientAnamnesisId: anamnesis.id }}
					>
						{isPending ? "Responder anamnese" : "Confirmar anamnese"}
					</Link>
				</Button>
			</div>
		</Alert>
	);
}
