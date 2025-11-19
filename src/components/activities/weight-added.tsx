import { TypographySpan, TypographySpanXSmall } from "@/components/ui/typography";
import { formatRelativeDate } from "@/lib/date";
import { WeightIcon } from "lucide-react";
import type { WeightAddedData } from "./schemas";

export default function WeightAdded({ clientName, data, createdAt }: { clientName: string, data: WeightAddedData, createdAt: string }) {
  return <div className="flex items-center gap-4">
    <div className="bg-muted p-2 rounded-full">
      <WeightIcon />
    </div>

    <div className="flex flex-col gap-1">

      <TypographySpan>
        <span className="font-medium">{clientName}</span> adicionou um novo peso: <span className="text-primary">{data.weight}kg</span>, que é {data.weightDifference}kg {data.direction === "up" ? "a mais" : "a menos"} que o peso anterior.
      </TypographySpan>
      <TypographySpanXSmall className="text-muted-foreground">{formatRelativeDate(createdAt)}</TypographySpanXSmall>
    </div>
  </div>
}