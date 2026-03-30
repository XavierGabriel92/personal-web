import { cachedSession } from '@/hooks/auth'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute("/_auth")({
  component: Layout,
  beforeLoad: async () => {
    const data = await cachedSession();
    if (data?.session) {
      const redirectTo =
        data.user?.type === "client" ? "/client/home" : "/trainer/home";
      throw redirect({ to: redirectTo as never });
    }
  },
});

function Layout() {
  return (
    <Outlet />
  );
}
