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
  volume: {
    label: "Volume",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function computeVolume(session: Session): number {
  return (session.exercises ?? []).reduce((total, ex) => {
    return total + ex.sets.reduce((s, set) => s + set.reps * set.weight_kg, 0)
  }, 0)
}

function formatVolume(kg: number): string {
  if (kg === 0) return "0kg"
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`
  return `${kg}kg`
}

interface VolumeCardProps {
  sessions: Session[]
  weekStart: Date
}

export function VolumeCard({ sessions, weekStart }: VolumeCardProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const data = days.map((day) => {
    const total = sessions
      .filter((s) => isSameDay(new Date(s.startedAt), day))
      .reduce((sum, s) => sum + computeVolume(s), 0)
    return { date: format(day, "EEE", { locale: ptBR }), volume: Math.round(total) }
  })

  const total = Math.round(sessions.reduce((sum, s) => sum + computeVolume(s), 0))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume</CardTitle>
        <div>
          <TypographyH2 className="font-semibold">{formatVolume(total)}</TypographyH2>
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
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${value / 1000}k kg`
                }
                return `${value} kg`
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="volume"
              fill="var(--color-volume)"
              radius={[4, 4, 0, 0]}
              barSize={25}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
