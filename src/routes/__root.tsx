import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const queryClient = new QueryClient({});

function NotFound() {
	const navigate = useNavigate();

	useEffect(() => {
		navigate({ to: "/sign-in", replace: true });
	}, [navigate]);

	return null;
}

export const Route = createRootRoute({
	component: () => (
		<QueryClientProvider client={queryClient}>
			<Toaster richColors />
			<Outlet />
		</QueryClientProvider>
	),
	notFoundComponent: NotFound,
});
