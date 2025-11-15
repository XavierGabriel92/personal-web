import TrainerHome from "@/pages/trainer/home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trainer/home")({
	component: TrainerHome,
});


