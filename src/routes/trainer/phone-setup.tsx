import PhoneSetupDialog from '@/components/account/phone-setup-dialog'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/phone-setup')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <PhoneSetupDialog onSuccess={() => navigate({ to: '/trainer/home' })} />
  )
}
