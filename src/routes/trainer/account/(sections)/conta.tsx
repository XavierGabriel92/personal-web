import { TrainerAccountContaPage } from "@/pages/trainer/account/conta";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trainer/account/(sections)/conta")({
	component: TrainerAccountContaPage,
});
