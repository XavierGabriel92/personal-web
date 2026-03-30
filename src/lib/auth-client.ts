import {
	customSessionClient,
	inferAdditionalFields,
	magicLinkClient,
	organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	plugins: [
		organizationClient(),
		customSessionClient(),
		magicLinkClient(),
		inferAdditionalFields({
			user: {
				type: {
					type: "string",
					enum: ["trainer", "client"],
					defaultValue: "trainer",
				},
				onboardingFinished: {
					type: "boolean",
					defaultValue: false,
				},
				phone: {
					type: "string",
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
	revokeSession,
	organization,
} = authClient;
