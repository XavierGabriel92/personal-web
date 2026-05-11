import { Spinner } from "@/components/ui/spinner";
import EditClientProfilePage from "@/pages/client/edit-profile";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/client/profile/edit")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Suspense fallback={<Spinner className="size-8" />}>
			<EditClientProfilePage />
		</Suspense>
	);
}
