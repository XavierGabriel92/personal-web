import { Spinner } from "@/components/ui/spinner";
import ClientHomePage from "@/pages/client/home";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/client/(tabs)/home")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Suspense fallback={<Spinner className="size-8" />}>
			<ClientHomePage />
		</Suspense>
	);
}
