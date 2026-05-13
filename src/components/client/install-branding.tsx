import { getApiClientMeBrandingQueryKey } from "@/gen/hooks/useGetApiClientMeBranding";
import { getApiClientMeBrandingQueryOptions } from "@/gen/hooks/useGetApiClientMeBranding";
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

	const { data } = useQuery({
		...getApiClientMeBrandingQueryOptions(),
		queryKey: getApiClientMeBrandingQueryKey(),
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
