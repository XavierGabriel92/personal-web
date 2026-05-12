import { beforeEach, describe, expect, it } from "bun:test";
import { JSDOM } from "jsdom";
import { applyInstallBranding } from "./install-branding";

function queryMeta(name: string) {
	return document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
}

describe("applyInstallBranding", () => {
	beforeEach(() => {
		const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", {
			url: "https://app.example.com/client/home",
		});

		Object.assign(globalThis, {
			window: dom.window,
			document: dom.window.document,
		});

		document.title = "";
	});

	it("applies the trainer branding to install metadata", () => {
		applyInstallBranding(
			{
				appName: " Studio Silva ",
				iconUrl: "https://cdn.example.com/icon.png ",
			},
			{
				apiBase: "https://api.example.com",
				locationOrigin: "https://app.example.com",
			},
		);

		expect(document.title).toBe("Studio Silva");

		const manifest = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
		expect(manifest).not.toBeNull();
		expect(manifest?.getAttribute("crossorigin")).toBe("use-credentials");
		expect(manifest?.type).toBe("application/manifest+json");

		const manifestUrl = new URL(manifest?.href ?? "");
		expect(manifestUrl.origin).toBe("https://api.example.com");
		expect(manifestUrl.pathname).toBe("/api/client/me/manifest.json");
		expect(manifestUrl.searchParams.get("v")).toBe(
			"Studio Silva|https://cdn.example.com/icon.png",
		);

		const appleIcon = document.querySelector(
			'link[rel="apple-touch-icon"]',
		) as HTMLLinkElement | null;
		expect(appleIcon?.href).toBe("https://cdn.example.com/icon.png");

		expect(queryMeta("application-name")?.content).toBe("Studio Silva");
		expect(queryMeta("apple-mobile-web-app-title")?.content).toBe("Studio Silva");
		expect(queryMeta("apple-mobile-web-app-capable")?.content).toBe("yes");
		expect(queryMeta("mobile-web-app-capable")?.content).toBe("yes");
	});

	it("falls back to the default title and favicon when branding is empty", () => {
		applyInstallBranding(
			{
				appName: "   ",
				iconUrl: null,
			},
			{
				apiBase: "https://api.example.com",
				locationOrigin: "https://app.example.com",
			},
		);

		expect(document.title).toBe("Homug");

		const manifest = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
		const manifestUrl = new URL(manifest?.href ?? "");
		expect(manifestUrl.searchParams.get("v")).toBe("Homug|default-icon");

		const appleIcon = document.querySelector(
			'link[rel="apple-touch-icon"]',
		) as HTMLLinkElement | null;
		expect(appleIcon?.href).toBe("https://app.example.com/favicon.ico");
	});

	it("reuses the existing manifest node and refreshes its cache key", () => {
		applyInstallBranding(
			{
				appName: "Primeiro Nome",
				iconUrl: "https://cdn.example.com/icon-a.png",
			},
			{
				apiBase: "https://api.example.com",
			},
		);

		const manifest = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
		expect(manifest).not.toBeNull();

		applyInstallBranding(
			{
				appName: "Segundo Nome",
				iconUrl: "https://cdn.example.com/icon-b.png",
			},
			{
				apiBase: "https://api.example.com",
			},
		);

		const updatedManifest = document.querySelector(
			'link[rel="manifest"]',
		) as HTMLLinkElement | null;
		expect(updatedManifest).toBe(manifest);

		const manifestUrl = new URL(updatedManifest?.href ?? "");
		expect(manifestUrl.searchParams.get("v")).toBe(
			"Segundo Nome|https://cdn.example.com/icon-b.png",
		);
	});
});
