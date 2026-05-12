import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
	TypographyH4,
	TypographyP,
	TypographySpanXSmall,
} from "@/components/ui/typography";
import type { GetApiClientMeHome200 } from "@/gen/types/GetApiClientMeHome";

interface NextWorkoutCardProps {
	workout: NonNullable<GetApiClientMeHome200["nextWorkout"]>;
	onStart: (workoutId: string) => Promise<void> | void;
	isPending?: boolean;
}

export function NextWorkoutCard({
	workout,
	onStart,
	isPending,
}: NextWorkoutCardProps) {
	const exerciseSummary =
		workout.exercises
			?.map((exercise) => exercise.exerciseData.name)
			.filter(Boolean)
			.join(", ") ?? "";

	return (
		<Card>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<TypographySpanXSmall className="text-muted-foreground">
						Próximo treino
					</TypographySpanXSmall>
					<TypographyH4>{workout.name}</TypographyH4>
					{workout.description ? (
						<TypographyP className="text-muted-foreground">
							{workout.description}
						</TypographyP>
					) : null}
					{exerciseSummary ? (
						<TypographyP className="text-muted-foreground">
							{exerciseSummary}
						</TypographyP>
					) : null}
				</div>
				<Button
					className="w-full"
					disabled={isPending}
					onClick={() => void onStart(workout.id)}
				>
					{isPending ? (
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
	);
}
