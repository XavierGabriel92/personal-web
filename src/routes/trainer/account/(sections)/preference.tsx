import { TrainerAccountPreferencePage } from "@/pages/trainer/account/preference";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trainer/account/(sections)/preference")({
	component: TrainerAccountPreferencePage,
});
