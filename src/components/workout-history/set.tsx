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
  sets: {
    label: "Séries",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function computeSets(session: Session): number {
  return (session.exercises ?? []).reduce((total, ex) => total + ex.sets.length, 0)
}

interface SetCardProps {
  sessions: Session[]
  weekStart: Date
}

export function SetCard({ sessions, weekStart }: SetCardProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const data = days.map((day) => {
    const total = sessions
      .filter((s) => isSameDay(new Date(s.startedAt), day))
      .reduce((sum, s) => sum + computeSets(s), 0)
    return { date: format(day, "EEE", { locale: ptBR }), sets: total }
  })

  const total = sessions.reduce((sum, s) => sum + computeSets(s), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Séries</CardTitle>
        <div>
          <TypographyH2 className="font-semibold">
            {total > 0 ? `${total} séries` : "0 séries"}
          </TypographyH2>
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
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="sets"
              fill="var(--color-sets)"
              radius={[4, 4, 0, 0]}
              barSize={25}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
