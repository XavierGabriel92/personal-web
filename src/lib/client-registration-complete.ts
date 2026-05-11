/**
 * Invited clients finish web onboarding via `POST /auth/api/client/set-initial-password`,
 * which persists `phone` (and name). Google-only activation links a `google` account row
 * without necessarily setting phone first — the API status route covers both.
 */
export function isClientRegistrationCompleteFromSession(user: {
	phone?: string | null;
}): boolean {
	return Boolean(user.phone && String(user.phone).trim().length > 0);
}

export async function fetchClientRegistrationComplete(): Promise<boolean> {
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
}
