import { createFileRoute } from "@tanstack/react-router";
import SignIn from "@/pages/auth/sign-in";

export const Route = createFileRoute("/_auth/sign-in")({
	component: SignIn,
});
