import { Spinner } from "@/components/ui/spinner";
import ClientExerciseDetailPage from "@/pages/client/exercise-detail";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/client/exercises/$exerciseId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { exerciseId } = Route.useParams();

	return (
		<Suspense fallback={<Spinner className="size-8" />}>
			<ClientExerciseDetailPage exerciseId={exerciseId} />
		</Suspense>
	);
}
