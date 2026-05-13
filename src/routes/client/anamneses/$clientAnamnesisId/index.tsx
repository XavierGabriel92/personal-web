import { Spinner } from "@/components/ui/spinner";
import ClientAnamnesisDetailPage from "@/pages/client/anamnesis-detail";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/client/anamneses/$clientAnamnesisId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { clientAnamnesisId } = Route.useParams();

	return (
		<Suspense fallback={<Spinner className="size-8" />}>
			<ClientAnamnesisDetailPage clientAnamnesisId={clientAnamnesisId} />
		</Suspense>
	);
}
