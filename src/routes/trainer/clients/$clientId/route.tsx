import TrainerLayoutClient from '@/pages/trainer/client/layout'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/clients/$clientId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { clientId } = Route.useParams();
  return <>
    <TrainerLayoutClient clientId={clientId} />
    <Outlet />
  </>
}
