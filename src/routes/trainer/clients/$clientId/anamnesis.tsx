import { Spinner } from "@/components/ui/spinner";
import TrainerClientAnamnesisPage from "@/pages/trainer/client/anamnesis";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/trainer/clients/$clientId/anamnesis")({
	component: RouteComponent,
});

function RouteComponent() {
	const { clientId } = Route.useParams();

	return (
		<Suspense fallback={<Spinner className="size-8" />}>
			<TrainerClientAnamnesisPage clientId={clientId} />
		</Suspense>
	);
}
