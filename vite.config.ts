import "dotenv/config";
import { URL, fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { verifyEmailCallbackDevPlugin } from "./vite-verify-email-callback-plugin";

const apiTarget = process.env.VITE_API_URL || "http://localhost:3000";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		verifyEmailCallbackDevPlugin(),
		devtools(),
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			routesDirectory: "./src/routes",
			generatedRouteTree: "./src/routeTree.gen.ts",
		}),
		viteReact(),
		tailwindcss(),
		tsconfigPaths(),
	],
	build: {
		target: "es2022",
	},
	server: {
		port: process.env.PORT ? Number(process.env.PORT) : 4000,
		origin: process.env.VITE_APP_URL as string,
		// Dev-only: email links sometimes use /api/verify-email; proxy to Better Auth on the API
		proxy: {
			"/api/verify-email": {
				target: apiTarget,
				changeOrigin: true,
				rewrite: (path) =>
					path.replace(/^\/api\/verify-email/, "/auth/api/verify-email"),
			},
		},
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	optimizeDeps: {
		include: [
			"@radix-ui/react-dialog",
			"@radix-ui/react-dropdown-menu",
			"@radix-ui/react-popover",
			"@radix-ui/react-select",
			"@radix-ui/react-tooltip",
			"@radix-ui/react-tabs",
			"@radix-ui/react-checkbox",
			"@radix-ui/react-label",
			"@radix-ui/react-switch",
			"@radix-ui/react-separator",
			"@radix-ui/react-avatar",
			"@radix-ui/react-slot",
		],
	},
});
