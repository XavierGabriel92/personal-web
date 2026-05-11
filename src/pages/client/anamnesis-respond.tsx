import { AnamnesisStatusBadge } from "@/components/client/anamnesis/status-badge";
import { ClientPageContainer } from "@/components/client/page-container";
import { ClientScreenHeader } from "@/components/client/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH4, TypographyP, TypographySpanXSmall } from "@/components/ui/typography";
import {
	getApiClientMeAnamnesisByClientAnamnesisIdSuspenseQueryKey,
	useGetApiClientMeAnamnesisByClientAnamnesisIdSuspense,
} from "@/gen/hooks/useGetApiClientMeAnamnesisByClientAnamnesisIdSuspense";
import { getApiClientMeAnamnesisSuspenseQueryKey } from "@/gen/hooks/useGetApiClientMeAnamnesisSuspense";
import { usePostApiClientMeAnamnesisByClientAnamnesisIdFinish } from "@/gen/hooks/usePostApiClientMeAnamnesisByClientAnamnesisIdFinish";
import { usePutApiClientMeAnamnesisByClientAnamnesisIdQuestionsByQuestionId } from "@/gen/hooks/usePutApiClientMeAnamnesisByClientAnamnesisIdQuestionsByQuestionId";
import { clientPortalQueryOptions } from "@/lib/client-query";
import { getErrorMessage } from "@/lib/client-portal";
import { queryClient } from "@/routes/__root";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const AUTO_SAVE_DELAY = 700;

interface ClientAnamnesisRespondPageProps {
	clientAnamnesisId: string;
}

export default function ClientAnamnesisRespondPage({
	clientAnamnesisId,
}: ClientAnamnesisRespondPageProps) {
	const navigate = useNavigate();
	const { data } =
		useGetApiClientMeAnamnesisByClientAnamnesisIdSuspense(clientAnamnesisId, {
			query: clientPortalQueryOptions,
		});
	const { mutateAsync: updateAnswer, isPending: isSaving } =
		usePutApiClientMeAnamnesisByClientAnamnesisIdQuestionsByQuestionId();
	const { mutateAsync: finishAnamnesis, isPending: isFinishing } =
		usePostApiClientMeAnamnesisByClientAnamnesisIdFinish();

	const [answers, setAnswers] = useState<Record<string, string>>({});
	const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

	useEffect(() => {
		setAnswers(
			Object.fromEntries(
				data.questions.map((question) => [question.id, question.answer ?? ""]),
			),
		);
	}, [data.questions]);

	const saveAnswer = async (questionId: string, answer: string) => {
		await updateAnswer(
			{
				clientAnamnesisId,
				questionId,
				data: { answer },
			},
			{
				onSuccess: (updated) => {
					queryClient.setQueryData(
						getApiClientMeAnamnesisByClientAnamnesisIdSuspenseQueryKey(
							clientAnamnesisId,
						),
						updated,
					);
					queryClient.invalidateQueries({
						queryKey: getApiClientMeAnamnesisSuspenseQueryKey(),
					});
				},
				onError: (error) => {
					toast.error(
						getErrorMessage(error, "Não foi possível salvar a resposta."),
					);
				},
			},
		);
	};

	const handleAnswerChange = (questionId: string, value: string) => {
		setAnswers((current) => ({ ...current, [questionId]: value }));

		if (debounceRef.current[questionId]) {
			clearTimeout(debounceRef.current[questionId]);
		}

		debounceRef.current[questionId] = setTimeout(() => {
			void saveAnswer(questionId, value);
		}, AUTO_SAVE_DELAY);
	};

	const handleFinish = async () => {
		await finishAnamnesis(
			{ clientAnamnesisId },
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
					await navigate({
						to: "/client/anamneses/$clientAnamnesisId",
						params: { clientAnamnesisId },
					});
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
				title={isAwaitingConfirmation ? "Confirmar anamnese" : "Responder anamnese"}
				rightSlot={
					isFinished ? null : (
						<Button
							size="sm"
							disabled={isSaving || isFinishing}
							onClick={() => void handleFinish()}
						>
							{isFinishing ? (
								<span className="flex items-center gap-2">
									<Spinner className="size-4" />
									Salvando...
								</span>
							) : isAwaitingConfirmation ? (
								"Confirmar"
							) : (
								"Enviar"
							)}
						</Button>
					)
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
							<TypographySpanXSmall className="text-muted-foreground">
								{isSaving ? "Salvando respostas..." : "As respostas são salvas automaticamente."}
							</TypographySpanXSmall>
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
											handleAnswerChange(question.id, event.target.value)
										}
										disabled={isAwaitingConfirmation || isFinished}
										placeholder="Escreva sua resposta"
									/>
								</CardContent>
							</Card>
						))}
				</div>
			</ClientPageContainer>
		</div>
	);
}
