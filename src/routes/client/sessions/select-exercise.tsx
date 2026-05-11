import { Spinner } from "@/components/ui/spinner";
import ClientSelectExercisePage from "@/pages/client/select-exercise";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";

const selectExerciseSearchSchema = z.object({
	replaceExerciseId: z.string().optional(),
});

export const Route = createFileRoute("/client/sessions/select-exercise")({
	validateSearch: (search) => selectExerciseSearchSchema.parse(search),
	component: RouteComponent,
});

function RouteComponent() {
	const { replaceExerciseId } = Route.useSearch();

	return (
		<Suspense fallback={<Spinner className="size-8" />}>
			<ClientSelectExercisePage replaceExerciseId={replaceExerciseId} />
		</Suspense>
	);
}
