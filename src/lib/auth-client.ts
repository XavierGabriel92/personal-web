import {
	customSessionClient,
	inferAdditionalFields,
	organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	plugins: [
		organizationClient(),
		customSessionClient(),
		inferAdditionalFields({
			user: {
				type: {
					type: "string",
					enum: ["trainer", "member"],
					defaultValue: "trainer",
				},
				onboardingFinished: {
					type: "boolean",
					defaultValue: false,
				},
			},
		}),
	],
	baseURL: import.meta.env.VITE_API_URL as string,
	basePath: "/auth/api",
});

export const {
	getSession,
	useSession,
	signIn,
	signUp,
	signOut,
	requestPasswordReset,
	resetPassword,
	revokeSession,
	organization,
} = authClient;
