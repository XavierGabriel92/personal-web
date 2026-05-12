import { TrainerAccountTemaPage } from "@/pages/trainer/account/tema";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trainer/account/(sections)/tema")({
	component: TrainerAccountTemaPage,
});
