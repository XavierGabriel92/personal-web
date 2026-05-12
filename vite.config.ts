import "dotenv/config";
import { URL, fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
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
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			// Vite's dep optimizer sometimes resolves `module` to a non-existent
			// `dist/esm/lucide-react.js`; the package only ships `lucide-react.mjs`.
			"lucide-react": fileURLToPath(
				new URL(
					"./node_modules/lucide-react/dist/esm/lucide-react.mjs",
					import.meta.url,
				),
			),
		},
	},
	optimizeDeps: {
		include: [
			"lucide-react",
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
