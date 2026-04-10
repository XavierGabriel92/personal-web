import { formatDateToLocaleString, formatRelativeDate } from "@/lib/date";

export type LastWorkoutSession = {
	id: string;
	workoutId?: string;
	workoutName?: string;
	startedAt: string;
	completedAt?: string;
	duration: number;
	series: number;
	weight: number;
	createdAt: string;
	exercises?: {
		exerciseId: string;
		exerciseName: string;
		imgSrc?: string;
		sets: { reps: number; weight_kg: number }[];
		notes?: string;
	}[];
};

export function formatWorkoutSessionName(workoutName?: string) {
	return workoutName ?? "";
}

export function formatLastWorkoutSessionDate(date?: string) {
	if (!date) return "Nenhum treino registrado";
	return `${formatRelativeDate(date)} • ${formatDateToLocaleString(date)}`;
}
