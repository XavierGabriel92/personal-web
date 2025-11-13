import { createFileRoute } from "@tanstack/react-router";
import SignUpPage from "@/pages/auth/sign-up";

export const Route = createFileRoute("/_auth/sign-up")({
	component: SignUpPage,
});
