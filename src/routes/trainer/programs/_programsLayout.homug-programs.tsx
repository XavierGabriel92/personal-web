import HomungProgramsPage from '@/pages/trainer/programs/homug-programs'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/programs/_programsLayout/homug-programs')({
  component: HomungProgramsPage,
})
