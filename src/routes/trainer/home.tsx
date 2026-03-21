import TrainerHome from "@/pages/trainer/home";
import { Spinner } from "@/components/ui/spinner";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/trainer/home")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Suspense fallback={<Spinner className="size-8" />}>
			<TrainerHome />
		</Suspense>
	);
}
