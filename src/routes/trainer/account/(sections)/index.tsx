import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/trainer/account/(sections)/")({
	beforeLoad: () => {
		throw redirect({ to: "/trainer/account/conta" });
	},
});
