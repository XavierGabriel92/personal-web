import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_trainer/")({
	component: TrainerHome,
});

function TrainerHome() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Today</h1>
				<p className="text-muted-foreground">
					Welcome to your trainer dashboard
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg border bg-card p-6">
					<h3 className="font-semibold">Overview</h3>
					<p className="text-sm text-muted-foreground mt-2">
						Your dashboard overview
					</p>
				</div>
				<div className="rounded-lg border bg-card p-6">
					<h3 className="font-semibold">Clients</h3>
					<p className="text-sm text-muted-foreground mt-2">
						Manage your clients
					</p>
				</div>
				<div className="rounded-lg border bg-card p-6">
					<h3 className="font-semibold">Workouts</h3>
					<p className="text-sm text-muted-foreground mt-2">
						View and create workouts
					</p>
				</div>
			</div>
		</div>
	);
}
