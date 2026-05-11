import { queryClient } from "@/routes/__root";

/**
 * Invited clients finish web onboarding via `POST /auth/api/client/accept-invite`,
 * which may persist `phone` and/or password. The server is the source of truth for
 * whether registration is complete, since phone is now optional.
 */
export function isClientRegistrationCompleteFromSession(user: {
	phone?: string | null;
}): boolean {
	return Boolean(user.phone && String(user.phone).trim().length > 0);
}

export const clientRegistrationCompleteQueryKey = ["client-registration-complete"];

export async function fetchClientRegistrationComplete(): Promise<boolean> {
	return queryClient.fetchQuery({
		queryKey: clientRegistrationCompleteQueryKey,
		staleTime: 60_000,
		queryFn: async () => {
			const apiUrl = import.meta.env.VITE_API_URL as string;
			try {
				const res = await fetch(`${apiUrl}/auth/api/client/activation-status`, {
					method: "GET",
					credentials: "include",
				});
				const json = (await res.json()) as { ok?: boolean; complete?: boolean };
				if (!res.ok || !json.ok) return false;
				return Boolean(json.complete);
			} catch {
				return false;
			}
		},
	});
}
