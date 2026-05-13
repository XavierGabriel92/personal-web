import { getApiClientMeBrandingQueryKey } from "@/gen/hooks/useGetApiClientMeBranding";
import { getApiClientMeBrandingQueryOptions } from "@/gen/hooks/useGetApiClientMeBranding";
import { useSession } from "@/lib/auth-client";
import { clientPortalQueryOptions } from "@/lib/client-query";
import {
	applyInstallBranding,
	readCachedClientBrandingForQueryInit,
	readCachedClientBrandingInitAt,
} from "@/lib/install-branding-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function InstallBranding() {
	const brandingInit = readCachedClientBrandingForQueryInit();
	const brandingInitAt = readCachedClientBrandingInitAt();
	const { data: sessionData } = useSession();
	const hasSession = Boolean(sessionData?.session);

	const { data } = useQuery({
		...getApiClientMeBrandingQueryOptions(),
		queryKey: getApiClientMeBrandingQueryKey(),
		enabled: hasSession,
		...clientPortalQueryOptions,
		...(brandingInit !== undefined
			? { initialData: brandingInit }
			: {}),
		...(brandingInitAt !== undefined
			? { initialDataUpdatedAt: brandingInitAt }
			: {}),
	});

	useEffect(() => {
		if (!data) {
			return;
		}

		applyInstallBranding(data);
	}, [data]);

	return null;
}
