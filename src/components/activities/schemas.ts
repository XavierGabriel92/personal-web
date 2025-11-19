export type ActivityType = "workout-finished" | "weight-added";

export type WorkoutFinishedData = {
	workoutName: string;
	duration: number;
	weight: number;
	series: number;
};

export type WeightAddedData = {
	weight: number;
	weightDifference: number;
	direction: "up" | "down";
};

export type Activity = {
	id: string;
	data: WorkoutFinishedData | WeightAddedData;
	type: ActivityType;
	createdAt: string;
};
