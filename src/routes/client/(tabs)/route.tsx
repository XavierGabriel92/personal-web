import { ActiveWorkoutPill } from "@/components/client/active-workout-pill";
import ClientNavBar from "@/components/client/nav-bar";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/client/(tabs)")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-svh bg-background">
			<Outlet />
			<ActiveWorkoutPill />
			<ClientNavBar />
		</div>
	);
}
