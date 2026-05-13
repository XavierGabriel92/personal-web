import type { GetApiClientMeBrandingQueryResponse } from "@/gen/types/GetApiClientMeBranding";

export const DEFAULT_INSTALL_TITLE = "Homug";
export const DEFAULT_MANIFEST_PATH = "/api/client/me/manifest.json";
export const DEFAULT_ICON_PATH = "/homug_gorilla_logo.svg";
export const DEFAULT_PUBLIC_APPLE_TOUCH_ICON = "/homug_gorilla_logo_white_bg.svg";
export const DEFAULT_PUBLIC_FAVICON = "/favicon.ico";
export const PUBLIC_MANIFEST_PATH = "/manifest.json";

export type InstallBrandingPayload = {
	appName?: string | null;
	iconUrl?: string | null;
};

declare global {
	interface Window {
		__HOMUG_CLIENT_BRANDING_INIT__?: GetApiClientMeBrandingQueryResponse | null;
		__HOMUG_CLIENT_BRANDING_INIT_AT__?: number;
	}
}

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

export function buildManifestHref({
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

function resolveApiBase(explicit?: string) {
	const trimmed = explicit?.trim();
	if (trimmed) {
		return trimmed;
	}
	const fromEnv = import.meta.env.VITE_API_URL as string | undefined;
	if (fromEnv?.trim()) {
		return fromEnv.trim();
	}
	return window.location.origin;
}

/**
 * Homug defaults + same-origin public manifest (no auth).
 * Used for non-client routes and when client branding fetch fails.
 */
export function applyHomugPublicInstallBranding(options?: {
	locationOrigin?: string;
}) {
	const locationOrigin =
		options?.locationOrigin?.trim() || window.location.origin;
	const originBase = `${resolveBaseUrl(locationOrigin)}/`;

	document.title = DEFAULT_INSTALL_TITLE;

	const linkManifest = upsertLink("manifest");
	linkManifest.href = new URL(PUBLIC_MANIFEST_PATH, originBase).toString();
	linkManifest.type = "application/manifest+json";
	linkManifest.removeAttribute("crossorigin");

	const appleIcon = upsertLink("apple-touch-icon");
	appleIcon.href = new URL(DEFAULT_PUBLIC_APPLE_TOUCH_ICON, originBase).toString();

	const iconLink = upsertLink("icon");
	iconLink.href = new URL(DEFAULT_PUBLIC_FAVICON, originBase).toString();

	upsertMeta("application-name", DEFAULT_INSTALL_TITLE);
	upsertMeta("apple-mobile-web-app-title", DEFAULT_INSTALL_TITLE);
	upsertMeta("apple-mobile-web-app-capable", "yes");
	upsertMeta("mobile-web-app-capable", "yes");
}

export function applyInstallBranding(
	data: InstallBrandingPayload,
	options?: {
		apiBase?: string;
		locationOrigin?: string;
	},
) {
	const appName = data.appName?.trim() || DEFAULT_INSTALL_TITLE;
	const rawIcon = data.iconUrl?.trim() || null;
	const apiBase = resolveApiBase(options?.apiBase);
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

export function isClientInstallPath(pathname = window.location.pathname) {
	const p = pathname.replace(/\/+$/, "") || "/";
	return p === "/client" || p.startsWith("/client/");
}

export function cacheClientBrandingForQueryInit(
	data: GetApiClientMeBrandingQueryResponse,
) {
	window.__HOMUG_CLIENT_BRANDING_INIT__ = data;
	window.__HOMUG_CLIENT_BRANDING_INIT_AT__ = Date.now();
}

export function readCachedClientBrandingForQueryInit():
	| GetApiClientMeBrandingQueryResponse
	| undefined {
	const raw = window.__HOMUG_CLIENT_BRANDING_INIT__;
	return raw === null || raw === undefined ? undefined : raw;
}

export function readCachedClientBrandingInitAt(): number | undefined {
	return window.__HOMUG_CLIENT_BRANDING_INIT_AT__;
}
