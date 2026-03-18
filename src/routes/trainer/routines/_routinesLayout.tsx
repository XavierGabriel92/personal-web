import ProgramsLayoutPage from '@/pages/trainer/routines/layout'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/routines/_routinesLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <ProgramsLayoutPage />
    <Outlet />
  </>
}
