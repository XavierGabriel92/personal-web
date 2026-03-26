import AnamnesisLayoutPage from '@/pages/trainer/anamnesis/layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/anamnesis/_anamnesisLayout')({
  component: AnamnesisLayoutPage,
})
