import { Spinner } from "@/components/ui/spinner";
import ClientProfilePage from "@/pages/client/profile";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/client/(tabs)/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Suspense fallback={<Spinner className="size-8" />}>
			<ClientProfilePage />
		</Suspense>
	);
}
