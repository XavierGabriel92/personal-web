import { ClientPageContainer } from "@/components/client/page-container";
import { ReplaceDraftWorkoutDialog } from "@/components/client/replace-draft-workout-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Spinner } from "@/components/ui/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	TypographyH1,
	TypographyH4,
	TypographyP,
	TypographySpanXSmall,
} from "@/components/ui/typography";
import { useGetApiClientMeHomeSuspense } from "@/gen/hooks/useGetApiClientMeHomeSuspense";
import { useGetApiClientMeRoutineWorkoutsSuspense } from "@/gen/hooks/useGetApiClientMeRoutineWorkoutsSuspense";
import type { GetApiClientMeRoutineWorkouts200 } from "@/gen/types/GetApiClientMeRoutineWorkouts";
import { useStartWorkoutWithDraftGuard } from "@/hooks/use-start-workout-with-draft-guard";
import { getClientTimeZone } from "@/lib/client-portal";
import { clientPortalQueryOptions } from "@/lib/client-query";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

type WorkoutExercise = NonNullable<
	GetApiClientMeRoutineWorkouts200["workouts"][number]["exercises"]
>[number];

function PrescribedExerciseItem({
	exercise,
}: {
	exercise: WorkoutExercise;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Collapsible open={open} onOpenChange={setOpen}>
			<CollapsibleTrigger asChild>
				<Button
					variant="ghost"
					className="h-auto w-full justify-between px-0 py-2"
				>
					<div className="flex min-w-0 items-center gap-4">
						<Avatar className="size-10">
							<AvatarImage
								src={exercise.exerciseData.imgSrc ?? undefined}
								alt={exercise.exerciseData.name}
							/>
							<AvatarFallback>
								{exercise.exerciseData.name.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="min-w-0 text-left">
							<TypographyP className="truncate font-medium">
								{exercise.exerciseData.name}
							</TypographyP>
							<TypographySpanXSmall className="text-muted-foreground">
								{exercise.exerciseData.primaryMuscle}
							</TypographySpanXSmall>
						</div>
					</div>
					<ChevronDown
						className={
							open
								? "size-4 rotate-180 transition-transform"
								: "size-4 transition-transform"
						}
					/>
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="pb-2">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-center">Peso</TableHead>
							<TableHead className="text-center">Reps</TableHead>
							<TableHead className="text-center">Descanso</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{exercise.sets.length === 0 ? (
							<TableRow>
								<TableCell
									className="text-center text-muted-foreground"
									colSpan={3}
								>
									Nenhuma série prescrita.
								</TableCell>
							</TableRow>
						) : (
							exercise.sets.map(
								(set: WorkoutExercise["sets"][number], index: number) => (
									<TableRow key={`${exercise.id}-${index}`}>
										<TableCell className="text-center">
											{set.weight != null ? `${set.weight}kg` : "—"}
										</TableCell>
										<TableCell className="text-center">
											{set.reps != null ? set.reps : "—"}
										</TableCell>
										<TableCell className="text-center">
											{set.rest != null ? `${set.rest}s` : "—"}
										</TableCell>
									</TableRow>
								),
							)
						)}
					</TableBody>
				</Table>
				<div className="pt-2">
					<Button asChild variant="link" className="px-0">
						<Link
							to="/client/exercises/$exerciseId"
							params={{ exerciseId: exercise.exerciseData.id }}
						>
							Ver exercício
						</Link>
					</Button>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}

export default function ClientWorkoutsPage() {
	const { data: home } = useGetApiClientMeHomeSuspense(
		{
			timeZone: getClientTimeZone(),
		},
		{
			query: clientPortalQueryOptions,
		},
	);
	const { data: routine } = useGetApiClientMeRoutineWorkoutsSuspense({
		query: clientPortalQueryOptions,
	});
	const {
		requestStartWorkout,
		isStartWorkoutPending,
		pendingWorkoutId,
		replaceDraftDialogProps,
	} = useStartWorkoutWithDraftGuard();

	const workouts = useMemo(
		() => [...routine.workouts].sort((left, right) => left.order - right.order),
		[routine.workouts],
	);

	return (
		<ClientPageContainer>
			<div className="space-y-4">
				<TypographyH1 className="text-2xl">Treinos</TypographyH1>

				{home.program ? (
					<Card>
						<CardContent className="space-y-2">
							<TypographyH4>{home.program.name}</TypographyH4>
							{home.program.description ? (
								<TypographyP className="text-muted-foreground">
									{home.program.description}
								</TypographyP>
							) : null}
							<TypographySpanXSmall className="text-muted-foreground">
								{home.program.weeksRemaining} semanas restantes
							</TypographySpanXSmall>
						</CardContent>
					</Card>
				) : null}

				{!home.program ? (
					<Card>
						<CardContent>
							<TypographyP className="text-muted-foreground">
								Seu treinador ainda não atribuiu um programa. Quando estiver
								pronto, ele aparecerá aqui automaticamente.
							</TypographyP>
						</CardContent>
					</Card>
				) : workouts.length === 0 ? (
					<Card>
						<CardContent>
							<TypographyP className="text-muted-foreground">
								Os treinos deste programa não estão disponíveis no momento.
								Fale com seu treinador.
							</TypographyP>
						</CardContent>
					</Card>
				) : (
					workouts.map((workout) => (
						<Card key={workout.id}>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<TypographyH4>{workout.name}</TypographyH4>
									{workout.description ? (
										<TypographyP className="text-muted-foreground">
											{workout.description}
										</TypographyP>
									) : null}
								</div>

								<div className="space-y-2">
									{[...(workout.exercises ?? [])]
										.sort((left, right) => left.order - right.order)
										.map((exercise) => (
											<PrescribedExerciseItem
												key={exercise.id}
												exercise={exercise}
											/>
										))}
								</div>

								<Button
									className="w-full"
									disabled={isStartWorkoutPending}
									onClick={() => void requestStartWorkout(workout.id)}
								>
									{isStartWorkoutPending && pendingWorkoutId === workout.id ? (
										<>
											<Spinner className="size-4" />
											Iniciando...
										</>
									) : (
										"Iniciar treino"
									)}
								</Button>
							</CardContent>
						</Card>
					))
				)}

				<ReplaceDraftWorkoutDialog {...replaceDraftDialogProps} />
			</div>
		</ClientPageContainer>
	);
}
