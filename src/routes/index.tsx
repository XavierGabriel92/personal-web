import { useCachedSession } from "@/hooks/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
	component: App,
	notFoundComponent: () => {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center">
				<h1 className="text-4xl font-bold">404 - Page Not Found</h1>
			</div>
		);
	},
});

function App() {
	const { data: session } = useCachedSession();
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const err = params.get("error");
		// Better Auth redirects failed verify to callbackURL?error=… — default callback is "/"
		if (
			err &&
			["token_expired", "invalid_token", "user_not_found", "unauthorized"].includes(err)
		) {
			navigate({ to: "/email-verified", search: { error: err }, replace: true });
			return;
		}
		if (session?.user) {
			const redirectTo =
				session.user.type === "client" ? "/client/home" : "/trainer/home";
			navigate({ to: redirectTo as never });
		} else {
			navigate({ to: "/sign-in" });
		}
	}, [session?.user, navigate]);

	return null;
}
