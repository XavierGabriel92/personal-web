import { Spinner } from "@/components/ui/spinner";
import ClientAnamnesisRespondPage from "@/pages/client/anamnesis-respond";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute(
	"/client/anamneses/$clientAnamnesisId/respond",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { clientAnamnesisId } = Route.useParams();

	return (
		<Suspense fallback={<Spinner className="size-8" />}>
			<ClientAnamnesisRespondPage clientAnamnesisId={clientAnamnesisId} />
		</Suspense>
	);
}
