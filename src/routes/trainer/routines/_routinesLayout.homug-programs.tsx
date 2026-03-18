import HomungRoutinesPage from '@/pages/trainer/routines/homug-routines'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/routines/_routinesLayout/homug-programs')({
  component: HomungRoutinesPage,
})
