import { TypographySpan, TypographySpanXSmall } from "@/components/ui/typography";
import { formatRelativeDate } from "@/lib/date";
import { DumbbellIcon } from "lucide-react";
import type { WorkoutFinishedData } from "./schemas";

export default function WorkoutFinished({ clientName, data, createdAt }: { clientName: string, data: WorkoutFinishedData, createdAt: string }) {
  return <div className="flex items-center gap-4">
    <div className="bg-muted p-2 rounded-full">
      <DumbbellIcon />
    </div>

    <div className="flex flex-col gap-1">
      <TypographySpan>
        <span className="font-medium">{clientName}</span> completou o treino <span className="text-primary">{data.workoutName}</span> em {data.duration}min e levantou {data.weight}kg em {data.series} series.
      </TypographySpan>
      <TypographySpanXSmall className="text-muted-foreground">{formatRelativeDate(createdAt)}</TypographySpanXSmall>
    </div>
  </div>
}