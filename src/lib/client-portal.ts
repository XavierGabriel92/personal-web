import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface ClientSessionExerciseSummary {
	exerciseId: string;
	exerciseName: string;
	imgSrc?: string;
	sets: Array<{ reps: number; weight_kg: number; done?: boolean }>;
	notes?: string;
}

export interface ClientWorkoutSession {
	id: string;
	clientId: string;
	workoutName: string;
	source: "whatsapp" | "app";
	status: "draft" | "finished";
	notes?: string;
	startedAt: string;
	completedAt?: string;
	createdAt: string;
	exercises?: ClientSessionExerciseSummary[];
}

export type ClientActivity =
	| {
			id: string;
			type: "WORKOUT_COMPLETED";
			clientId: string;
			clientName: string;
			payload: {
				workoutName?: string;
				duration: number;
				weight: number;
				series: number;
			};
			createdAt: string;
	  }
	| {
			id: string;
			type: "WEIGHT_LOGGED";
			clientId: string;
			clientName: string;
			payload: {
				weight: number;
				weightDifference: number;
				direction: "up" | "down";
			};
			createdAt: string;
	  }
	| {
			id: string;
			type: "ROUTINE_ASSIGNED";
			clientId: string;
			clientName: string;
			payload: {
				routineName?: string;
			};
			createdAt: string;
	  };

type HistoryResponse = {
	sessions?: ClientWorkoutSession[];
};

type HttpErrorLike = {
	response?: {
		status?: number;
		data?: {
			message?: string;
		};
	};
	message?: string;
};

export function getClientTimeZone() {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function coerceHistoryResponse(data: unknown): HistoryResponse {
	if (!data || typeof data !== "object") {
		return { sessions: [] };
	}

	return data as HistoryResponse;
}

export function coerceDraftSession(data: unknown): ClientWorkoutSession | null {
	if (!data || typeof data !== "object") {
		return null;
	}

	return data as ClientWorkoutSession;
}

export function formatRelativeDate(value: string | Date) {
	return formatDistanceToNow(new Date(value), {
		addSuffix: true,
		locale: ptBR,
	});
}

export function formatWeekdayShortPtBr(value: string | Date) {
	return format(new Date(value), "EEE", { locale: ptBR })
		.replace(".", "")
		.slice(0, 3);
}

export function formatDuration(totalSeconds: number) {
	if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
		return "0min";
	}

	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);

	if (hours > 0) {
		return `${hours}h ${minutes}min`;
	}

	return `${minutes}min`;
}

export function getSessionVolume(exercises: ClientSessionExerciseSummary[] = []) {
	return exercises.reduce(
		(total, exercise) =>
			total +
			exercise.sets.reduce(
				(setTotal, set) => setTotal + set.reps * set.weight_kg,
				0,
			),
		0,
	);
}

export function getCompletedSetCount(exercises: ClientSessionExerciseSummary[] = []) {
	return exercises.reduce(
		(total, exercise) =>
			total + exercise.sets.filter((set) => set.done !== false).length,
		0,
	);
}

export function getTotalSetCount(exercises: ClientSessionExerciseSummary[] = []) {
	return exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
}

export function getErrorMessage(
	error: unknown,
	fallback = "Não foi possível concluir a ação. Tente novamente.",
) {
	const message =
		(error as HttpErrorLike | undefined)?.response?.data?.message ??
		(error as HttpErrorLike | undefined)?.message;

	return message || fallback;
}

export function isNotFoundError(error: unknown) {
	return (error as HttpErrorLike | undefined)?.response?.status === 404;
}
