import TrainerRoutinesPage from '@/pages/trainer/routines/trainer-routines'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/routines/_routinesLayout/')({
  component: TrainerRoutinesPage,
})
