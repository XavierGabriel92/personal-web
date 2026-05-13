import { AnamnesisStatusBadge } from "@/components/client/anamnesis/status-badge";
import { ClientPageContainer } from "@/components/client/page-container";
import { ClientScreenHeader } from "@/components/client/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
	TypographyH4,
	TypographyP,
	TypographySpanXSmall,
} from "@/components/ui/typography";
import {
	getApiClientMeAnamnesisByClientAnamnesisIdSuspenseQueryKey,
	useGetApiClientMeAnamnesisByClientAnamnesisIdSuspense,
} from "@/gen/hooks/useGetApiClientMeAnamnesisByClientAnamnesisIdSuspense";
import { getApiClientMeAnamnesisSuspenseQueryKey } from "@/gen/hooks/useGetApiClientMeAnamnesisSuspense";
import { usePostApiClientMeAnamnesisByClientAnamnesisIdSubmit } from "@/gen/hooks/usePostApiClientMeAnamnesisByClientAnamnesisIdSubmit";
import { getErrorMessage } from "@/lib/client-portal";
import { clientPortalQueryOptions } from "@/lib/client-query";
import { queryClient } from "@/routes/__root";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface ClientAnamnesisRespondPageProps {
	clientAnamnesisId: string;
}

export default function ClientAnamnesisRespondPage({
	clientAnamnesisId,
}: ClientAnamnesisRespondPageProps) {
	const navigate = useNavigate();
	const { data } = useGetApiClientMeAnamnesisByClientAnamnesisIdSuspense(
		clientAnamnesisId,
		{
			query: clientPortalQueryOptions,
		},
	);
	const { mutateAsync: submitAnamnesis, isPending: isSubmitting } =
		usePostApiClientMeAnamnesisByClientAnamnesisIdSubmit();

	const formHydrationKey = useMemo(
		() =>
			`${clientAnamnesisId}:${[...data.questions]
				.map((q) => q.id)
				.sort()
				.join(",")}`,
		[clientAnamnesisId, data.questions],
	);

	const [answers, setAnswers] = useState<Record<string, string>>({});

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-hydrate only when anamnesis id or question id set changes; refetches must not clobber in-progress edits.
	useEffect(() => {
		setAnswers(
			Object.fromEntries(
				data.questions.map((question) => [question.id, question.answer ?? ""]),
			),
		);
	}, [formHydrationKey]);

	const handleSubmit = async () => {
		const isAwaitingConfirmation = data.status === "AWAITING_CONFIRMATION";

		if (!isAwaitingConfirmation && data.status === "PENDING") {
			const sorted = [...data.questions].sort(
				(left, right) => left.order - right.order,
			);
			for (const q of sorted) {
				if (!(answers[q.id] ?? "").trim()) {
					toast.error("Preencha todas as perguntas antes de enviar.");
					return;
				}
			}
		}

		const payload =
			data.status === "PENDING"
				? {
					answers: Object.fromEntries(
						[...data.questions]
							.sort((left, right) => left.order - right.order)
							.map((q) => [q.id, (answers[q.id] ?? "").trim()]),
					),
				}
				: {};

		await submitAnamnesis(
			{ clientAnamnesisId, data: payload },
			{
				onSuccess: async (updated) => {
					queryClient.setQueryData(
						getApiClientMeAnamnesisByClientAnamnesisIdSuspenseQueryKey(
							clientAnamnesisId,
						),
						updated,
					);
					await queryClient.invalidateQueries({
						queryKey: getApiClientMeAnamnesisSuspenseQueryKey(),
					});
					toast.success("Anamnese finalizada.");
					await navigate({ to: "/client/home", replace: true });
				},
				onError: (error) => {
					toast.error(
						getErrorMessage(error, "Não foi possível finalizar a anamnese."),
					);
				},
			},
		);
	};

	const isAwaitingConfirmation = data.status === "AWAITING_CONFIRMATION";
	const isFinished = data.status === "FINISHED";

	return (
		<div className="min-h-svh bg-background">
			<ClientScreenHeader
				title={
					isAwaitingConfirmation ? "Confirmar anamnese" : "Responder anamnese"
				}
			/>
			<ClientPageContainer withBottomNav={false}>
				<div className="space-y-4">
					<Card>
						<CardContent className="space-y-4">
							<div className="flex items-start justify-between gap-4">
								<div className="space-y-2">
									<TypographyH4>{data.name}</TypographyH4>
									{data.description ? (
										<TypographyP className="text-muted-foreground">
											{data.description}
										</TypographyP>
									) : null}
								</div>
								<AnamnesisStatusBadge status={data.status} />
							</div>
						</CardContent>
					</Card>

					{[...data.questions]
						.sort((left, right) => left.order - right.order)
						.map((question, index) => (
							<Card key={question.id}>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<TypographySpanXSmall className="text-muted-foreground">
											Pergunta {index + 1}
										</TypographySpanXSmall>
										<TypographyH4>{question.text}</TypographyH4>
									</div>
									<Textarea
										value={answers[question.id] ?? ""}
										onChange={(event) =>
											setAnswers((current) => ({
												...current,
												[question.id]: event.target.value,
											}))
										}
										disabled={isAwaitingConfirmation || isFinished}
										placeholder="Escreva sua resposta"
									/>
								</CardContent>
							</Card>
						))}

					{!isFinished ? (
						<Button
							className="w-full"
							size="lg"
							disabled={isSubmitting}
							onClick={() => void handleSubmit()}
						>
							{isSubmitting ? (
								<span className="flex items-center justify-center gap-2">
									<Spinner className="size-4" />
									Enviando...
								</span>
							) : isAwaitingConfirmation ? (
								"Confirmar"
							) : (
								"Enviar"
							)}
						</Button>
					) : null}
				</div>
			</ClientPageContainer>
		</div>
	);
}
