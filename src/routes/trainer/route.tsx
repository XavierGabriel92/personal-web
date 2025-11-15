import TrainerHeader from "@/components/trainer/header";
import AppSidebar from "@/components/trainer/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trainer")({
	component: TrainerDashboardLayout,
});

function TrainerDashboardLayout() {
	return (
		<SidebarProvider className="h-svh overflow-hidden">
			<AppSidebar />
			<SidebarInset className="overflow-hidden">
				<TrainerHeader />
				<div className="flex flex-1 flex-col gap-4 px-5 md:px-10 py-6 text-sm overflow-y-auto overflow-x-hidden">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
