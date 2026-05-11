import ClientActiveSessionPage from "@/pages/client/active-session";
import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { z } from "zod";

const activeSessionSearchSchema = z.object({
	addedExerciseId: z.string().optional(),
	addedExerciseName: z.string().optional(),
	addedExerciseImgSrc: z.string().optional(),
	replaceExerciseId: z.string().optional(),
});

export const Route = createFileRoute("/client/sessions/active")({
	validateSearch: (search) => activeSessionSearchSchema.parse(search),
	component: RouteComponent,
});

function RouteComponent() {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const isActiveIndexRoute = pathname === "/client/sessions/active";

	if (!isActiveIndexRoute) {
		return <Outlet />;
	}

	return (
		<ClientActiveSessionPage
			addedExerciseId={search.addedExerciseId}
			addedExerciseImgSrc={search.addedExerciseImgSrc}
			addedExerciseName={search.addedExerciseName}
			replaceExerciseId={search.replaceExerciseId}
			clearPendingExercise={() =>
				navigate({
					to: "/client/sessions/active",
					search: {},
					replace: true,
				})
			}
		/>
	);
}
