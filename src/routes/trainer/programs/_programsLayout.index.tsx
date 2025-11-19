import TrainerProgramsPage from '@/pages/trainer/programs/trainer-programs'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/programs/_programsLayout/')({
  component: TrainerProgramsPage,
})
