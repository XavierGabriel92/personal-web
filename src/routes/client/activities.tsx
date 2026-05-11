import { Spinner } from "@/components/ui/spinner";
import ClientActivitiesPage from "@/pages/client/activities";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/client/activities")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Suspense fallback={<Spinner className="size-8" />}>
			<ClientActivitiesPage />
		</Suspense>
	);
}
