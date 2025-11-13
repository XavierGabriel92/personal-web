import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: DashboardDecider,
	beforeLoad: async () => {
		// const data = await cachedSession();
		// if (!data?.session) {
		// 	throw redirect({ to: "/sign-in" });
		// }
	},
});

function DashboardDecider() {
	return <Outlet />;
}
