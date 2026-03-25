import LastActivities from "@/components/activities/last-activities";
import ProgramOverview from "@/components/routine/overview";
import LastWorkoutSessionCard from "@/components/workout-history/last-workout-session-card";
import { useGetApiClientByIdSuspense } from "@/gen/hooks/useGetApiClientByIdSuspense";

interface TrainerClientOverviewPageProps {
	clientId: string;
}

export default function TrainerClientOverviewPage({
	clientId,
}: TrainerClientOverviewPageProps) {
	const { data: client } = useGetApiClientByIdSuspense(clientId);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-2">
				<div className="flex flex-col gap-4">
					<ProgramOverview clientId={clientId} />
					<LastActivities clientId={clientId} />
				</div>
				<div className="flex flex-col gap-4">
					<LastWorkoutSessionCard session={client.lastWorkoutSession} />
				</div>
			</div>
		</div>
	);
}
