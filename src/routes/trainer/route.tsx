import AppSidebar from "@/components/trainer/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cachedSession } from "@/hooks/auth";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/trainer")({
	component: TrainerDashboardLayout,
	beforeLoad: async () => {
		const data = await cachedSession();

		if (!data?.session) {
			throw redirect({ to: "/sign-in" });
		}

		// if (!data.user?.phone && location.pathname !== '/trainer/phone-setup') {
		// 	throw redirect({ to: "/trainer/phone-setup" });
		// }
	},
});

function TrainerDashboardLayout() {
	return (
		<SidebarProvider className="h-svh overflow-hidden">
			<AppSidebar />
			<SidebarInset className="overflow-hidden">
				<div className="flex flex-1 flex-col gap-4 px-5 md:px-10 py-6 text-sm overflow-y-auto overflow-x-hidden">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
