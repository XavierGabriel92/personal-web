import { registerSW } from "virtual:pwa-register";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";
import { ThemeProvider } from "./components/theme-provider/index.tsx";
import reportWebVitals from "./reportWebVitals.ts";
import { bootstrapInstallBranding } from "./install-branding-bootstrap";

await bootstrapInstallBranding();

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
				<RouterProvider router={router} />
			</ThemeProvider>
		</StrictMode>,
	);
}

if (import.meta.env.PROD) {
	registerSW({ immediate: true });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
