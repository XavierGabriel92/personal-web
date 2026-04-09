import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/trainer/")({
	beforeLoad: () => {
		throw redirect({ to: "/trainer/home" });
	},
});
