import ClientSaveSessionPage from "@/pages/client/save-session";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/client/sessions/active/save")({
	component: ClientSaveSessionPage,
});
