import { Spinner } from "@/components/ui/spinner";
import ClientAnamnesesPage from "@/pages/client/anamneses";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/client/anamneses/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Suspense fallback={<Spinner className="size-8" />}>
			<ClientAnamnesesPage />
		</Suspense>
	);
}
