import EmailVerifiedPage from "@/pages/auth/email-verified";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const emailVerifiedSearchSchema = z.object({
	error: z.string().optional(),
});

export const Route = createFileRoute("/email-verified")({
	validateSearch: (search) => emailVerifiedSearchSchema.parse(search),
	component: EmailVerifiedRoute,
});

function EmailVerifiedRoute() {
	const { error } = Route.useSearch();
	return <EmailVerifiedPage error={error} />;
}
