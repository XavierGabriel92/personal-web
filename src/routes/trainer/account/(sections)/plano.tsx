import { TrainerAccountPlanoPage } from "@/pages/trainer/account/plano";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trainer/account/(sections)/plano")({
	component: TrainerAccountPlanoPage,
});
