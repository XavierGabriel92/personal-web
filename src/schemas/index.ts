export interface Set {
	type?: string;
	reps?: number;
	weight?: number;
	rest?: number;
}

export interface ExerciseData {
	id: string;
	exerciseId: string;
	name: string;
	videoUrl?: string;
	thumbnailUrl?: string;
	setsLogged: number;
	instructions: string[];
	alternativeExercises: string[];
	primaryMuscle?: {
		id: string;
		name: string;
	};
	secondaryMuscles: {
		id: string;
		name: string;
	}[];
	equipments: {
		id: string;
		name: string;
	}[];
	ownerId?: string;
	bodyPart?: string;
}

export interface WorkoutExercise {
	id: string;
	order: number;
	sets: Set[]; // Array of sets
	exerciseData: ExerciseData;
}

export interface Workout {
	id: string;
	name: string;
	description?: string;
	ownerId?: string | null;
	routineId: string;
	order: number;
	createdAt: string;
	updatedAt: string;
}

export interface WorkoutExercises extends Workout {
	exercises?: WorkoutExercise[];
}

export interface Routine {
	id: string;
	name: string;
	description?: string;
	duration: number;
	ownerId?: string | null;
	clientId?: string;
	isTemplate?: boolean;
	category?: string | null;
	createdAt: string;
	updatedAt: string;
	workouts: Workout[];
}
