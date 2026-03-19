import PageTitle from "@/components/core/page-title";

export default function TrainerHome() {
	return (
		<div className="space-y-6">
			<PageTitle title="Today" description="Welcome to your trainer dashboard" />

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg border bg-card p-6">
					<h3 className="font-semibold">Overview</h3>
					<p className="text-sm text-muted-foreground mt-2">
						Testing
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
	)
}