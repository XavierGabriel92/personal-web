import { useCachedSession } from "@/hooks/auth";

export function useClientSession() {
	const { data: session, ...rest } = useCachedSession();
	const user = session?.user?.type === "client" ? session.user : null;

	return {
		...rest,
		session,
		user,
	};
}
