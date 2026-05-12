import { getApiClientMeBrandingQueryKey } from "@/gen/hooks/useGetApiClientMeBranding";
import { getApiClientMeBrandingQueryOptions } from "@/gen/hooks/useGetApiClientMeBranding";
import { clientPortalQueryOptions } from "@/lib/client-query";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const DEFAULT_TITLE = "Homug";

function upsertMeta(name: string, content: string) {
	let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
	if (!el) {
		el = document.createElement("meta");
		el.setAttribute("name", name);
		document.head.appendChild(el);
	}
	el.setAttribute("content", content);
}

export function InstallBranding() {
	const { data } = useQuery({
		...getApiClientMeBrandingQueryOptions(),
		queryKey: getApiClientMeBrandingQueryKey(),
		...clientPortalQueryOptions,
	});

	useEffect(() => {
		if (!data) {
			return;
		}

		const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(
			/\/$/,
			"",
		);
		const manifestHref = `${apiBase}/api/client/me/manifest.json`;

		const appName = data.appName?.trim() || DEFAULT_TITLE;
		const rawIcon = data.iconUrl?.trim();
		const iconHref =
			rawIcon && rawIcon.length > 0
				? rawIcon
				: `${window.location.origin}/favicon.ico`;

		document.title = appName;

		let linkManifest = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
		if (!linkManifest) {
			linkManifest = document.createElement("link");
			linkManifest.rel = "manifest";
			document.head.appendChild(linkManifest);
		}
		linkManifest.href = manifestHref;

		let appleIcon = document.querySelector(
			'link[rel="apple-touch-icon"]',
		) as HTMLLinkElement | null;
		if (!appleIcon) {
			appleIcon = document.createElement("link");
			appleIcon.rel = "apple-touch-icon";
			document.head.appendChild(appleIcon);
		}
		appleIcon.href = iconHref;

		upsertMeta("apple-mobile-web-app-title", appName);
		upsertMeta("apple-mobile-web-app-capable", "yes");
	}, [data]);

	return null;
}
