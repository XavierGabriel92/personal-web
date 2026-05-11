import { cachedSession } from "@/hooks/auth";
import { fetchClientRegistrationComplete } from "@/lib/client-registration-complete";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/client")({
	component: ClientLayout,
	beforeLoad: async ({ location }) => {
		const data = await cachedSession();

		if (!data?.session) {
			throw redirect({ to: "/sign-in" });
		}

		if (data.user?.type === "trainer") {
			throw redirect({ to: "/trainer/home" });
		}

		if (data.user?.type !== "client") {
			throw redirect({ to: "/sign-in" });
		}

		const path = location.pathname.replace(/\/+$/, "") || "/";
		const complete = await fetchClientRegistrationComplete();
		const target = complete ? "/client/welcome" : "/client/set-password";
		if (path !== target) {
			throw redirect({ to: target });
		}
	},
});

function ClientLayout() {
	return <Outlet />;
}
