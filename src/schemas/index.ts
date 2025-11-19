export interface Set {
	type?: string;
	reps: number;
	weight: number;
	restTime: number;
	order: number;
}

export interface Exercise {
	id: string;
	name: string;
	img: string;
	order: number;
	notes?: string;
	sets: Set[];
}

export interface Workout {
	id: string;
	name: string;
	description?: string;
	order: number;
	exercises: Exercise[];
}
