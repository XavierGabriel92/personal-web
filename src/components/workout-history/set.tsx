import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { TypographyH2 } from "../ui/typography"

const chartConfig = {
  sets: {
    label: "Séries",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface SetCardProps {
  data?: Array<{ date: string; sets: number }>
  currentValue?: string
  timeframe?: string
}

export function SetCard({
  data = [],
}: SetCardProps) {
  // Default data if none provided
  const chartData = data.length > 0 ? data : [
    { date: format(new Date(2024, 7, 17), "d MMM", { locale: ptBR }), sets: 45 },
    { date: format(new Date(2024, 8, 7), "d MMM", { locale: ptBR }), sets: 50 },
    { date: format(new Date(2024, 8, 28), "d MMM", { locale: ptBR }), sets: 48 },
    { date: format(new Date(2024, 9, 19), "d MMM", { locale: ptBR }), sets: 52 },
    { date: format(new Date(2024, 10, 9), "d MMM", { locale: ptBR }), sets: 45 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Séries</CardTitle>
        <div>
          <TypographyH2 className="font-semibold">45 séries</TypographyH2>
          <CardDescription>Essa semana</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={chartData}>
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

