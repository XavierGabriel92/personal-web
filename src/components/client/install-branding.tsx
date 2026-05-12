import { getApiClientMeBrandingQueryKey } from "@/gen/hooks/useGetApiClientMeBranding";
import { getApiClientMeBrandingQueryOptions } from "@/gen/hooks/useGetApiClientMeBranding";
import { clientPortalQueryOptions } from "@/lib/client-query";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const DEFAULT_TITLE = "Homug";
const DEFAULT_MANIFEST_PATH = "/api/client/me/manifest.json";
const DEFAULT_ICON_PATH = "/homug_gorilla_logo.svg";

type InstallBrandingData = {
	appName?: string | null;
	iconUrl?: string | null;
};

function upsertMeta(name: string, content: string) {
	let el = document.querySelector(
		`meta[name="${name}"]`,
	) as HTMLMetaElement | null;
	if (!el) {
		el = document.createElement("meta");
		el.setAttribute("name", name);
		document.head.appendChild(el);
	}
	el.setAttribute("content", content);
}

function upsertLink(rel: string) {
	let el = document.querySelector(
		`link[rel="${rel}"]`,
	) as HTMLLinkElement | null;
	if (!el) {
		el = document.createElement("link");
		el.rel = rel;
		document.head.appendChild(el);
	}
	return el;
}

function resolveBaseUrl(base: string) {
	return base.replace(/\/$/, "");
}

function buildManifestHref({
	apiBase,
	appName,
	iconUrl,
}: {
	apiBase: string;
	appName: string;
	iconUrl: string | null;
}) {
	const manifestUrl = new URL(
		DEFAULT_MANIFEST_PATH,
		`${resolveBaseUrl(apiBase)}/`,
	);
	const manifestVersion = [appName, iconUrl?.trim() || "default-icon"].join(
		"|",
	);
	manifestUrl.searchParams.set("v", manifestVersion);
	return manifestUrl.toString();
}

export function applyInstallBranding(
	data: InstallBrandingData,
	options?: {
		apiBase?: string;
		locationOrigin?: string;
	},
) {
	const appName = data.appName?.trim() || DEFAULT_TITLE;
	const rawIcon = data.iconUrl?.trim() || null;
	const apiBase =
		options?.apiBase?.trim() ||
		import.meta.env.VITE_API_URL ||
		window.location.origin;
	const locationOrigin =
		options?.locationOrigin?.trim() || window.location.origin;
	const iconHref =
		rawIcon && rawIcon.length > 0
			? rawIcon
			: new URL(
					DEFAULT_ICON_PATH,
					`${resolveBaseUrl(locationOrigin)}/`,
				).toString();
	const manifestHref = buildManifestHref({
		apiBase,
		appName,
		iconUrl: rawIcon,
	});

	document.title = appName;

	const linkManifest = upsertLink("manifest");
	linkManifest.href = manifestHref;
	linkManifest.type = "application/manifest+json";
	linkManifest.setAttribute("crossorigin", "use-credentials");

	const appleIcon = upsertLink("apple-touch-icon");
	appleIcon.href = iconHref;

	const iconLink = upsertLink("icon");
	iconLink.href = iconHref;

	upsertMeta("application-name", appName);
	upsertMeta("apple-mobile-web-app-title", appName);
	upsertMeta("apple-mobile-web-app-capable", "yes");
	upsertMeta("mobile-web-app-capable", "yes");
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

		applyInstallBranding(data);
	}, [data]);

	return null;
}
