import { Spinner } from "@/components/ui/spinner";
import ClientWorkoutsPage from "@/pages/client/workouts";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/client/(tabs)/workouts")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Suspense fallback={<Spinner className="size-8" />}>
			<ClientWorkoutsPage />
		</Suspense>
	);
}
