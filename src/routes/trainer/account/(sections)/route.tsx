import { Spinner } from "@/components/ui/spinner";
import { AccountSettingsLayout } from "@/pages/trainer/account/layout";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/trainer/account/(sections)")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Suspense fallback={<Spinner className="size-8" />}>
			<AccountSettingsLayout>
				<Outlet />
			</AccountSettingsLayout>
		</Suspense>
	);
}
