import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { GetApiSessionsClientByClientId200 } from "@/gen/types/GetApiSessionsClientByClientId"
import { addDays, format, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { TypographyH2 } from "../ui/typography"

type Session = GetApiSessionsClientByClientId200["sessions"][number]

const chartConfig = {
  duration: {
    label: "Duração",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function computeDuration(session: Session): number {
  if (!session.completedAt) return 0
  const diff = new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()
  return Math.max(0, Math.round(diff / 1000 / 60))
}

function formatDuration(minutes: number): string {
  if (minutes === 0) return "0 min"
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}:${String(m).padStart(2, "0")}h`
}

interface DurationCardProps {
  sessions: Session[]
  weekStart: Date
}

export function DurationCard({ sessions, weekStart }: DurationCardProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const data = days.map((day) => {
    const total = sessions
      .filter((s) => isSameDay(new Date(s.startedAt), day))
      .reduce((sum, s) => sum + computeDuration(s), 0)
    return { date: format(day, "EEE", { locale: ptBR }), duration: total }
  })

  const total = sessions.reduce((sum, s) => sum + computeDuration(s), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Duração</CardTitle>
        <div>
          <TypographyH2 className="font-semibold">{formatDuration(total)}</TypographyH2>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}min`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="duration"
              fill="var(--color-duration)"
              radius={[4, 4, 0, 0]}
              barSize={25}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
