import { getApiClientMeSessionsDraft } from "@/gen/clients/getApiClientMeSessionsDraft";
import { getApiClientMeSessionsDraftQueryKey } from "@/gen/hooks/useGetApiClientMeSessionsDraft";
import {
	type ClientWorkoutSession,
	coerceDraftSession,
	isNotFoundError,
} from "@/lib/client-portal";
import { useQuery } from "@tanstack/react-query";

export function useDraftSession() {
	return useQuery<ClientWorkoutSession | null>({
		queryKey: getApiClientMeSessionsDraftQueryKey(),
		queryFn: async () => {
			try {
				const response = await getApiClientMeSessionsDraft();
				return coerceDraftSession(response);
			} catch (error) {
				if (isNotFoundError(error)) {
					return null;
				}

				throw error;
			}
		},
		retry: false,
		staleTime: 60_000,
		refetchOnWindowFocus: false,
	});
}
