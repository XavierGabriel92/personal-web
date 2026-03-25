import AnamnesisTemplatesPage from '@/pages/trainer/anamnesis/templates'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainer/anamnesis/_anamnesisLayout/templates')({
  component: AnamnesisTemplatesPage,
})
