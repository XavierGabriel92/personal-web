import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LastWorkoutSession } from "@/lib/last-workout-session";
import SessionCard from "./session-card";

interface LastWorkoutSessionCardProps {
	session?: LastWorkoutSession;
}

export default function LastWorkoutSessionCard({
	session,
}: LastWorkoutSessionCardProps) {
	if (!session) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Ultimo treino registrado</CardTitle>
			</CardHeader>
			<CardContent>
				<SessionCard session={session} />
			</CardContent>
		</Card>
	);
}
