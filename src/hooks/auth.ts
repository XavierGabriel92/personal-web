import { getSession } from "@/lib/auth-client";
import { queryClient } from "@/routes/__root";
import { useSuspenseQuery } from "@tanstack/react-query";
export const sessionQueryKey = ["session"];

const fetchSession = async () => {
	const session = await getSession();
	return session.data;
};

export const cachedSession = () => {
	return queryClient.fetchQuery({
		queryKey: sessionQueryKey,
		queryFn: fetchSession,
		staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
	});
};

export const useCachedSession = () => {
	return useSuspenseQuery({
		queryKey: sessionQueryKey,
		queryFn: fetchSession,
		staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
	});
};
