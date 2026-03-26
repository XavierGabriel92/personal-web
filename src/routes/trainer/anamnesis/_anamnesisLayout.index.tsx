import TrainerAnamnesisPage from '@/pages/trainer/anamnesis/trainer-anamnesis'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/anamnesis/_anamnesisLayout/')({
  component: TrainerAnamnesisPage,
})

