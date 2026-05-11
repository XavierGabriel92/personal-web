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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TypographySpanXSmall } from "@/components/ui/typography";
import { useDeleteApiClientMeSessionsBySessionId } from "@/gen/hooks/useDeleteApiClientMeSessionsBySessionId";
import { getApiClientMeSessionsDraftQueryKey } from "@/gen/hooks/useGetApiClientMeSessionsDraft";
import { usePutApiClientMeSessionsBySessionIdExercises } from "@/gen/hooks/usePutApiClientMeSessionsBySessionIdExercises";
import { useDraftSession } from "@/hooks/use-draft-session";
import {
	type ClientSessionExerciseSummary,
	getCompletedSetCount,
	getErrorMessage,
	getSessionVolume,
	getTotalSetCount,
} from "@/lib/client-portal";
import { queryClient } from "@/routes/__root";
import { Link, useNavigate } from "@tanstack/react-router";
import { differenceInSeconds } from "date-fns";
import { ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const AUTO_SAVE_DELAY = 500;

interface ClientActiveSessionPageProps {
	addedExerciseId?: string;
	addedExerciseName?: string;
	addedExerciseImgSrc?: string;
	replaceExerciseId?: string;
	clearPendingExercise: () => Promise<void> | void;
}

function normalizeExercises(exercises?: ClientSessionExerciseSummary[]) {
	return (exercises ?? []).map((exercise) => ({
		...exercise,
		sets: exercise.sets.map((set) => ({
			reps: set.reps ?? 0,
			weight_kg: set.weight_kg ?? 0,
			done: set.done ?? false,
		})),
	}));
}

export default function ClientActiveSessionPage({
	addedExerciseId,
	addedExerciseName,
	addedExerciseImgSrc,
	replaceExerciseId,
	clearPendingExercise,
}: ClientActiveSessionPageProps) {
	const navigate = useNavigate();
	const draftQuery = useDraftSession();
	const { mutateAsync: saveExercises, isPending: isSaving } =
		usePutApiClientMeSessionsBySessionIdExercises();
	const { mutateAsync: discardSession, isPending: isDiscarding } =
		useDeleteApiClientMeSessionsBySessionId();

	const [exercises, setExercises] = useState<ClientSessionExerciseSummary[]>([]);
	const [now, setNow] = useState(Date.now());
	const [isDiscardOpen, setIsDiscardOpen] = useState(false);
	const [showHeaderSummary, setShowHeaderSummary] = useState(false);
	const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const summaryRef = useRef<HTMLDivElement | null>(null);

	const session = draftQuery.data;

	useEffect(() => {
		const interval = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (session?.status === "draft") {
			setExercises(normalizeExercises(session.exercises));
		}
	}, [session?.exercises, session?.status]);

	useEffect(() => {
		if (!addedExerciseId || !addedExerciseName) {
			return;
		}

		setExercises((current) => {
			const withoutReplaced = replaceExerciseId
				? current.filter((exercise) => exercise.exerciseId !== replaceExerciseId)
				: current;

			if (
				!replaceExerciseId &&
				withoutReplaced.some((exercise) => exercise.exerciseId === addedExerciseId)
			) {
				return withoutReplaced;
			}

			return [
				...withoutReplaced,
				{
					exerciseId: addedExerciseId,
					exerciseName: addedExerciseName,
					imgSrc: addedExerciseImgSrc,
					sets: [{ reps: 0, weight_kg: 0, done: false }],
				},
			];
		});

		void clearPendingExercise();
	}, [
		addedExerciseId,
		addedExerciseImgSrc,
		addedExerciseName,
		clearPendingExercise,
		replaceExerciseId,
	]);

	useEffect(() => {
		if (!session?.id) {
			return;
		}

		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
		}

		saveTimeoutRef.current = setTimeout(() => {
			void saveExercises(
				{
					sessionId: session.id,
					data: {
						exercises: exercises.map((exercise) => ({
							exerciseId: exercise.exerciseId,
							exerciseName: exercise.exerciseName,
							notes: exercise.notes,
							sets: exercise.sets.map((set) => ({
								reps: Number.isFinite(set.reps) ? set.reps : 0,
								weight_kg: Number.isFinite(set.weight_kg) ? set.weight_kg : 0,
								done: set.done ?? false,
							})),
						})),
					},
				},
				{
					onSuccess: () => {
						queryClient.setQueryData(getApiClientMeSessionsDraftQueryKey(), {
							...session,
							exercises,
						});
					},
					onError: (error) => {
						toast.error(
							getErrorMessage(error, "Não foi possível salvar o treino."),
						);
					},
				},
			);
		}, AUTO_SAVE_DELAY);

		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, [exercises, saveExercises, session]);

	useEffect(() => {
		if (draftQuery.isLoading) {
			return;
		}

		if (!session) {
			void navigate({ to: "/client/home", replace: true });
		}
	}, [draftQuery.isLoading, navigate, session]);

	useEffect(() => {
		const summaryElement = summaryRef.current;

		if (!summaryElement) {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				setShowHeaderSummary(!entry.isIntersecting);
			},
			{
				rootMargin: "-88px 0px 0px 0px",
				threshold: 0,
			},
		);

		observer.observe(summaryElement);

		return () => observer.disconnect();
	}, []);

	const elapsedSeconds = session?.startedAt
		? Math.max(0, differenceInSeconds(now, new Date(session.startedAt)))
		: 0;

	const volume = getSessionVolume(exercises);
	const completedSets = getCompletedSetCount(exercises);
	const totalSets = getTotalSetCount(exercises);
	const workoutName = session?.workoutName || "Treino";

	const updateSetValue = (
		exerciseIndex: number,
		setIndex: number,
		field: "reps" | "weight_kg",
		value: string,
	) => {
		const numericValue = Number(value);
		setExercises((current) =>
			current.map((exercise, currentExerciseIndex) => {
				if (currentExerciseIndex !== exerciseIndex) {
					return exercise;
				}

				return {
					...exercise,
					sets: exercise.sets.map((set, currentSetIndex) =>
						currentSetIndex === setIndex
							? {
									...set,
									[field]: Number.isFinite(numericValue) ? numericValue : 0,
								}
							: set,
					),
				};
			}),
		);
	};

	const toggleSetDone = (exerciseIndex: number, setIndex: number, checked: boolean) => {
		setExercises((current) =>
			current.map((exercise, currentExerciseIndex) => {
				if (currentExerciseIndex !== exerciseIndex) {
					return exercise;
				}

				return {
					...exercise,
					sets: exercise.sets.map((set, currentSetIndex) =>
						currentSetIndex === setIndex ? { ...set, done: checked } : set,
					),
				};
			}),
		);
	};

	const addSet = (exerciseIndex: number) => {
		setExercises((current) =>
			current.map((exercise, currentExerciseIndex) =>
				currentExerciseIndex === exerciseIndex
					? {
							...exercise,
							sets: [...exercise.sets, { reps: 0, weight_kg: 0, done: false }],
						}
					: exercise,
			),
		);
	};

	const removeExercise = (exerciseId: string) => {
		setExercises((current) =>
			current.filter((exercise) => exercise.exerciseId !== exerciseId),
		);
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
				title={workoutName}
				summarySlot={
					<ClientWorkoutSummary
						elapsedSeconds={elapsedSeconds}
						volumeKg={volume}
						completedSets={completedSets}
						totalSets={totalSets}
					/>
				}
				showSummary={showHeaderSummary}
				leftSlot={
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => navigate({ to: "/client/home" })}
					>
						<ChevronDown className="size-4" />
					</Button>
				}
				rightSlot={
					<Button asChild size="sm">
						<Link to="/client/sessions/active/save">Finalizar</Link>
					</Button>
				}
			/>
			<ClientPageContainer withBottomNav={false} className="px-0">
				<div className="space-y-6">
					<div ref={summaryRef} className="px-4">
						<ClientWorkoutSummary
							elapsedSeconds={elapsedSeconds}
							volumeKg={volume}
							completedSets={completedSets}
							totalSets={totalSets}
						/>
					</div>

					{exercises.length > 0 ? <Separator /> : null}

					<div className="space-y-8">
						{exercises.map((exercise, exerciseIndex) => (
							<div key={`${exercise.exerciseId}-${exerciseIndex}`} className="space-y-4">
								<div className="px-4">
									<div className="flex items-start justify-between gap-4">
										<div className="flex min-w-0 items-center gap-4">
											<Avatar className="size-10">
												<AvatarImage src={exercise.imgSrc} alt={exercise.exerciseName} />
												<AvatarFallback>
													{exercise.exerciseName.slice(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="min-w-0">
												<Button asChild variant="link" className="h-auto px-0">
													<Link
														to="/client/exercises/$exerciseId"
														params={{ exerciseId: exercise.exerciseId }}
													>
														{exercise.exerciseName}
													</Link>
												</Button>
											</div>
										</div>

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon-sm">
													<MoreHorizontal className="size-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() =>
														void navigate({
															to: "/client/sessions/select-exercise",
															search: {
																replaceExerciseId: exercise.exerciseId,
															},
														})
													}
												>
													Substituir
												</DropdownMenuItem>
												<DropdownMenuItem
													variant="destructive"
													onClick={() => removeExercise(exercise.exerciseId)}
												>
													Remover exercício
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>

								<Table>
									<TableHeader className="[&_th:first-child]:pl-4 [&_th:last-child]:pr-4">
										<TableRow>
											<TableHead className="text-center">Série</TableHead>
											<TableHead className="text-center">Kg</TableHead>
											<TableHead className="text-center">Reps</TableHead>
											<TableHead className="text-center">Feito</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody className="[&_tr]:border-0 [&_td:first-child]:pl-4 [&_td:last-child]:pr-4">
										{exercise.sets.map((set, setIndex) => (
											<TableRow
												key={`${exercise.exerciseId}-${setIndex}`}
												className={
													set.done
														? "bg-green-100 hover:bg-green-100 dark:bg-green-900/60 dark:hover:bg-green-900/60"
														: "odd:bg-muted/50"
												}
											>
												<TableCell className="text-center font-semibold">
													{setIndex + 1}
												</TableCell>
												<TableCell className="text-center">
													<Input
														className="border-0 bg-transparent text-center shadow-none focus-visible:border-0 focus-visible:ring-0"
														type="number"
														min="0"
														value={String(set.weight_kg)}
														onChange={(event) =>
															updateSetValue(
																exerciseIndex,
																setIndex,
																"weight_kg",
																event.target.value,
															)
														}
													/>
												</TableCell>
												<TableCell className="text-center">
													<Input
														className="border-0 bg-transparent text-center shadow-none focus-visible:border-0 focus-visible:ring-0"
														type="number"
														min="0"
														value={String(set.reps)}
														onChange={(event) =>
															updateSetValue(
																exerciseIndex,
																setIndex,
																"reps",
																event.target.value,
															)
														}
													/>
												</TableCell>
												<TableCell className="text-center">
													<div className="flex justify-center">
														<Checkbox
															className="data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 dark:data-[state=checked]:border-green-700 dark:data-[state=checked]:bg-green-700"
															checked={set.done ?? false}
															onCheckedChange={(checked) =>
																toggleSetDone(
																	exerciseIndex,
																	setIndex,
																	Boolean(checked),
																)
															}
														/>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>

								<div className="px-4">
									<Button
										variant="outline"
										className="w-full"
										onClick={() => addSet(exerciseIndex)}
									>
										<Plus className="size-4" />
										Adicionar série
									</Button>
								</div>
							</div>
						))}
					</div>

					<div className="space-y-4 px-4">
						<Button
							variant="outline"
							className="w-full"
							onClick={() => navigate({ to: "/client/sessions/select-exercise" })}
						>
							<Plus className="size-4" />
							Adicionar exercício
						</Button>

						<Button
							variant="link"
							className="w-full text-destructive"
							disabled={isDiscarding}
							onClick={() => setIsDiscardOpen(true)}
						>
							Descartar treino
						</Button>

						{isSaving ? (
							<TypographySpanXSmall className="block text-center text-muted-foreground">
								Salvando alterações...
							</TypographySpanXSmall>
						) : null}
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
