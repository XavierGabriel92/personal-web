import { Spinner } from "@/components/ui/spinner";
import ClientHistoryPage from "@/pages/client/history";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/client/(tabs)/history")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Suspense fallback={<Spinner className="size-8" />}>
			<ClientHistoryPage />
		</Suspense>
	);
}
