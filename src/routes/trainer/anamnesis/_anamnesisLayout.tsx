import AnamnesisLayoutPage from '@/pages/trainer/anamnesis/layout'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/anamnesis/_anamnesisLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <AnamnesisLayoutPage />
      <Outlet />
    </>
  )
}
