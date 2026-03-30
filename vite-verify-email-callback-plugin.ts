import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

/**
 * Rewrites `callbackURL=/` (Better Auth default) on dev verify links before the proxy forwards
 * to the API, so the final redirect targets `/email-verified` instead of `/` → sign-in.
 */
function fixVerifyEmailCallback() {
	return (req: IncomingMessage, _res: ServerResponse, next: () => void) => {
		const url = req.url;
		if (!url?.startsWith("/api/verify-email")) {
			next();
			return;
		}
		if (req.method !== "GET" && req.method !== "HEAD") {
			next();
			return;
		}
		try {
			const u = new URL(url, "http://vite.local");
			const cb = u.searchParams.get("callbackURL");
			const dec = cb ? decodeURIComponent(cb) : "";
			const isRootCallback =
				!cb ||
				cb === "/" ||
				dec === "/" ||
				(dec.startsWith("http") &&
					(() => {
						try {
							const p = new URL(dec).pathname.replace(/\/+$/, "") || "/";
							return p === "/" || p === "";
						} catch {
							return false;
						}
					})());
			if (isRootCallback && !dec.includes("email-verified")) {
				const raw = process.env.VITE_APP_URL || "http://localhost:4000";
				const href = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`;
				const appOrigin = new URL(href).origin;
				u.searchParams.set("callbackURL", `${appOrigin}/email-verified`);
				req.url = u.pathname + u.search;
			}
		} catch {
			/* ignore */
		}
		next();
	};
}

export function verifyEmailCallbackDevPlugin(): Plugin {
	return {
		name: "verify-email-callback-dev",
		configureServer(server) {
			server.middlewares.use(fixVerifyEmailCallback());
		},
	};
}
