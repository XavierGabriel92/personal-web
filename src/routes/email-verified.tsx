import EmailVerifiedPage from "@/pages/auth/email-verified";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

const emailVerifiedSearchSchema = z.object({
	error: z.string().optional(),
});

export const Route = createFileRoute("/email-verified")({
	validateSearch: (search) => emailVerifiedSearchSchema.parse(search),
	beforeLoad: ({ search }) => {
		if (!search.error) {
			throw redirect({ to: "/sign-in" });
		}
	},
	component: EmailVerifiedRoute,
});

function EmailVerifiedRoute() {
	const { error } = Route.useSearch();
	return <EmailVerifiedPage error={error} />;
}
