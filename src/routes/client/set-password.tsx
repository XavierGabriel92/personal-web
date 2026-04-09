import ClientSetPasswordPage from "@/pages/client/set-password";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/client/set-password")({
	component: ClientSetPasswordPage,
});
