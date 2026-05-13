import type { GetApiClientMeBrandingQueryResponse } from "@/gen/types/GetApiClientMeBranding";
import {
	applyHomugPublicInstallBranding,
	applyInstallBranding,
	cacheClientBrandingForQueryInit,
	isClientInstallPath,
} from "@/lib/install-branding-dom";

function resolveApiBase() {
	const fromEnv = import.meta.env.VITE_API_URL as string | undefined;
	if (fromEnv?.trim()) {
		return fromEnv.trim();
	}
	return window.location.origin;
}

/**
 * Runs before router/render so iOS Safari sees trainer manifest + apple meta
 * before Add to Home Screen (static Homug manifest is never parsed first).
 */
export async function bootstrapInstallBranding() {
	const apiBase = resolveApiBase();

	if (!isClientInstallPath()) {
		applyHomugPublicInstallBranding();
		return;
	}

	try {
		const brandingUrl = new URL(
			"/api/client/me/branding",
			`${apiBase.replace(/\/$/, "")}/`,
		);
		const res = await fetch(brandingUrl.toString(), {
			credentials: "include",
			mode: "cors",
		});
		if (res.ok) {
			const data = (await res.json()) as GetApiClientMeBrandingQueryResponse;
			applyInstallBranding(data, { apiBase });
			cacheClientBrandingForQueryInit(data);
		} else {
			applyHomugPublicInstallBranding();
		}
	} catch {
		applyHomugPublicInstallBranding();
	}
}
