import TrainerLayoutClient from '@/pages/trainer/client/layout'
import { Spinner } from '@/components/ui/spinner'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/trainer/clients/$clientId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { clientId } = Route.useParams();
  return <>
    <Suspense fallback={<Spinner className="size-8" />}>
      <TrainerLayoutClient clientId={clientId} />
    </Suspense>
    <Outlet />
  </>
}
