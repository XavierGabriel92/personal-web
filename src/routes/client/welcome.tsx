import ClientWelcomePage from "@/pages/client/welcome";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/client/welcome")({
	component: ClientWelcomePage,
});
