import ResetPasswordPage from "@/pages/auth/reset-password";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const resetPasswordSearchSchema = z.object({
	token: z.string().optional(),
	error: z.string().optional(),
});

export const Route = createFileRoute("/reset-password")({
	validateSearch: (search) => resetPasswordSearchSchema.parse(search),
	component: ResetPasswordRoute,
});

function ResetPasswordRoute() {
	const { token, error } = Route.useSearch();
	return <ResetPasswordPage token={token} error={error} />;
}
