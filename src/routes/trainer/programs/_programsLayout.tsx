import ProgramsLayoutPage from '@/pages/trainer/programs/layout'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/programs/_programsLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <ProgramsLayoutPage />
    <Outlet />
  </>
}
