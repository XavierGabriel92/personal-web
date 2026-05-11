import { cachedSession } from "@/hooks/auth";
import {
	fetchClientRegistrationComplete,
	isClientRegistrationCompleteFromSession,
} from "@/lib/client-registration-complete";
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

		const path = location.pathname.replace(/\/+$/, "") || "/";
		const complete =
			isClientRegistrationCompleteFromSession(data.user) ||
			(await fetchClientRegistrationComplete());

		if (!complete && path !== "/client/set-password") {
			throw redirect({ to: "/client/set-password" });
		}

		if (complete && path === "/client") {
			throw redirect({ to: "/client/home" });
		}
	},
});

function ClientLayout() {
	return <Outlet />;
}
