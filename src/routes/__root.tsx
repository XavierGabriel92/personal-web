import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const queryClient = new QueryClient({});

export const Route = createRootRoute({
	component: () => (
		<QueryClientProvider client={queryClient}>
			<Toaster richColors />
			<Outlet />
		</QueryClientProvider>
	),
});
