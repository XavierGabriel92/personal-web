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
	category: string;
	imgSrc?: string | null;
	equipment: string;
	primaryMuscle: string;
	secondaryMuscle: string;
	howTo?: string | null;
	videoUrl?: string | null;
	ownerId?: string | null;
}

export interface WorkoutExercise {
	id: string;
	order: number;
	sets: Set[];
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

export interface AnamnesisQuestion {
	id: string;
	anamnesisId: string;
	text: string;
	order: number;
	createdAt: string;
	updatedAt: string;
}

export interface Anamnesis {
	id: string;
	name: string;
	description?: string;
	ownerId?: string | null;
	isTemplate?: boolean;
	category?: string | null;
	createdAt: string;
	updatedAt: string;
	questions: AnamnesisQuestion[];
}
