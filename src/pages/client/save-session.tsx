import { ClientPageContainer } from "@/components/client/page-container";
import { ClientScreenHeader } from "@/components/client/screen-header";
import { ClientWorkoutSummary } from "@/components/client/workout-summary";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
	TypographyH3,
	TypographyH4,
	TypographyP,
	TypographySpanXSmall,
} from "@/components/ui/typography";
import { useDeleteApiClientMeSessionsBySessionId } from "@/gen/hooks/useDeleteApiClientMeSessionsBySessionId";
import { getApiClientMeActivitiesSuspenseQueryKey } from "@/gen/hooks/useGetApiClientMeActivitiesSuspense";
import { getApiClientMeHomeSuspenseQueryKey } from "@/gen/hooks/useGetApiClientMeHomeSuspense";
import { getApiClientMeRoutineWorkoutsSuspenseQueryKey } from "@/gen/hooks/useGetApiClientMeRoutineWorkoutsSuspense";
import { getApiClientMeSessionsDraftQueryKey } from "@/gen/hooks/useGetApiClientMeSessionsDraft";
import { usePostApiClientMeSessionsBySessionIdFinish } from "@/gen/hooks/usePostApiClientMeSessionsBySessionIdFinish";
import { useDraftSession } from "@/hooks/use-draft-session";
import {
	getClientTimeZone,
	getCompletedSetCount,
	getErrorMessage,
	getSessionVolume,
	getTotalSetCount,
} from "@/lib/client-portal";
import { queryClient } from "@/routes/__root";
import { useNavigate } from "@tanstack/react-router";
import { differenceInSeconds } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function formatSessionDateTime(value?: string) {
	if (!value) {
		return null;
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return null;
	}

	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date);
}

export default function ClientSaveSessionPage() {
	const navigate = useNavigate();
	const draftQuery = useDraftSession();
	const { mutateAsync: finishSession, isPending: isFinishing } =
		usePostApiClientMeSessionsBySessionIdFinish();
	const { mutateAsync: discardSession, isPending: isDiscarding } =
		useDeleteApiClientMeSessionsBySessionId();

	const [notes, setNotes] = useState("");
	const [isDiscardOpen, setIsDiscardOpen] = useState(false);

	const session = draftQuery.data;

	useEffect(() => {
		if (session?.notes) {
			setNotes(session.notes);
		}
	}, [session?.notes]);

	useEffect(() => {
		if (draftQuery.isLoading) {
			return;
		}

		if (!session) {
			void navigate({ to: "/client/home", replace: true });
		}
	}, [draftQuery.isLoading, navigate, session]);

	const totalSets = useMemo(
		() => getTotalSetCount(session?.exercises ?? []),
		[session?.exercises],
	);
	const totalVolume = useMemo(
		() => getSessionVolume(session?.exercises ?? []),
		[session?.exercises],
	);
	const completedSets = useMemo(
		() => getCompletedSetCount(session?.exercises ?? []),
		[session?.exercises],
	);
	const elapsedSeconds = session?.startedAt
		? Math.max(0, differenceInSeconds(Date.now(), new Date(session.startedAt)))
		: 0;
	const startedAtLabel = formatSessionDateTime(session?.startedAt);

	const invalidateClientQueries = async () => {
		await Promise.all([
			queryClient.invalidateQueries({
				queryKey: getApiClientMeHomeSuspenseQueryKey({
					timeZone: getClientTimeZone(),
				}),
			}),
			queryClient.invalidateQueries({
				queryKey: getApiClientMeRoutineWorkoutsSuspenseQueryKey(),
			}),
			queryClient.invalidateQueries({
				queryKey: getApiClientMeActivitiesSuspenseQueryKey(),
			}),
			queryClient.invalidateQueries({ queryKey: ["client-session-history"] }),
			queryClient.invalidateQueries({ queryKey: ["client-activities"] }),
		]);
	};

	if (draftQuery.isLoading || !session) {
		return (
			<div className="flex min-h-svh items-center justify-center">
				<Spinner className="size-8" />
			</div>
		);
	}

	return (
		<div className="min-h-svh bg-background">
			<ClientScreenHeader
				title="Salvar treino"
				rightSlot={
					<Button
						size="sm"
						disabled={isFinishing}
						onClick={() =>
							void finishSession(
								{
									sessionId: session.id,
									data: { notes: notes.trim() || undefined },
								},
								{
									onSuccess: async () => {
										queryClient.setQueryData(
											getApiClientMeSessionsDraftQueryKey(),
											null,
										);
										await invalidateClientQueries();
										toast.success("Treino salvo com sucesso.");
										await navigate({ to: "/client/home" });
									},
									onError: (error) => {
										toast.error(
											getErrorMessage(
												error,
												"Não foi possível salvar o treino.",
											),
										);
									},
								},
							)
						}
					>
						{isFinishing ? (
							<span className="flex items-center gap-2">
								<Spinner className="size-4" />
								Salvando...
							</span>
						) : (
							"Salvar"
						)}
					</Button>
				}
			/>
			<ClientPageContainer withBottomNav={false} className="px-0">
				<div className="space-y-6 pb-6">
					<div className="space-y-2 px-4">
						<TypographyH3 className="font-semibold tracking-tight">
							{session.workoutName}
						</TypographyH3>
						<TypographyP className="text-muted-foreground">
							Confira o resumo do treino e adicione uma observação, se quiser,
							antes de salvar.
						</TypographyP>
					</div>

					<div className="border-y">
						<div className="px-4 py-4">
							<ClientWorkoutSummary
								elapsedSeconds={elapsedSeconds}
								volumeKg={totalVolume}
								completedSets={completedSets}
								totalSets={totalSets}
							/>
						</div>
					</div>

					<div className="space-y-4">
						<div className="space-y-3 px-4">
							<div className="space-y-1">
								<TypographySpanXSmall className="uppercase tracking-[0.12em] text-muted-foreground">
									Detalhes
								</TypographySpanXSmall>
								<TypographyP className="text-muted-foreground">
									Um resumo simples do que vai ser salvo nesta sessão.
								</TypographyP>
							</div>

							<div className="space-y-4">
								<div className="flex items-start justify-between gap-4">
									<TypographyP className="text-muted-foreground">
										Exercícios
									</TypographyP>
									<TypographyP className="text-right font-medium">
										{session.exercises?.length ?? 0}
									</TypographyP>
								</div>

								{startedAtLabel ? (
									<div className="flex items-start justify-between gap-4">
										<TypographyP className="text-muted-foreground">
											Iniciado em
										</TypographyP>
										<TypographyP className="text-right font-medium">
											{startedAtLabel}
										</TypographyP>
									</div>
								) : null}
							</div>
						</div>

						<Separator />

						<div className="space-y-3 px-4">
							<div className="space-y-1">
								<TypographyH4>Observações</TypographyH4>
								<TypographyP className="text-muted-foreground">
									Esse campo é opcional e pode te ajudar a lembrar como foi o
									treino depois.
								</TypographyP>
							</div>
							<Textarea
								value={notes}
								onChange={(event) => setNotes(event.target.value)}
								placeholder="Como foi o treino? Algo que vale lembrar na próxima vez?"
								className="min-h-32 resize-none bg-muted/40"
							/>
						</div>

						<Separator />

						<div className="space-y-2 px-4">
							<Button
								variant="link"
								className="h-auto justify-start px-0 text-destructive"
								disabled={isDiscarding}
								onClick={() => setIsDiscardOpen(true)}
							>
								Descartar treino
							</Button>
							<TypographySpanXSmall className="block text-muted-foreground">
								Essa ação apaga o treino em andamento e não pode ser desfeita.
							</TypographySpanXSmall>
						</div>
					</div>
				</div>
			</ClientPageContainer>

			<AlertDialog open={isDiscardOpen} onOpenChange={setIsDiscardOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Descartar treino atual?</AlertDialogTitle>
						<AlertDialogDescription>
							O treino em andamento será apagado e não poderá ser recuperado.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDiscarding}>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-white hover:bg-destructive/90"
							disabled={isDiscarding}
							onClick={async () => {
								await discardSession(
									{ sessionId: session.id },
									{
										onSuccess: async () => {
											queryClient.setQueryData(
												getApiClientMeSessionsDraftQueryKey(),
												null,
											);
											toast.success("Treino descartado.");
											await navigate({ to: "/client/home" });
										},
										onError: (error) => {
											toast.error(
												getErrorMessage(
													error,
													"Não foi possível descartar o treino.",
												),
											);
										},
									},
								);
							}}
						>
							Descartar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
