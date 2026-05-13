import TrainerHeader from "@/components/trainer/header";
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

		if (data.user?.type !== "trainer") {
			throw redirect({ to: "/client/home" });
		}
	},
});

function TrainerDashboardLayout() {
	return (
		<SidebarProvider className="h-svh overflow-hidden">
			<AppSidebar />
			<SidebarInset className="min-h-0 overflow-hidden">
				<div className=" lg:hidden">
					<TrainerHeader />
				</div>
				<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto px-5 py-0 lg:py-6 text-sm md:px-10">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
