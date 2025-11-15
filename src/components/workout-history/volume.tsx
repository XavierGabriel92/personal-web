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
  volume: {
    label: "Volume",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface VolumeCardProps {
  data?: Array<{ date: string; volume: number }>
  currentValue?: string
  timeframe?: string
}

export function VolumeCard({
  data = [],
}: VolumeCardProps) {
  // Default data if none provided
  const chartData = data.length > 0 ? data : [
    { date: format(new Date(2024, 7, 17), "d MMM", { locale: ptBR }), volume: 909 },
    { date: format(new Date(2024, 8, 7), "d MMM", { locale: ptBR }), volume: 1200 },
    { date: format(new Date(2024, 8, 28), "d MMM", { locale: ptBR }), volume: 450 },
    { date: format(new Date(2024, 9, 19), "d MMM", { locale: ptBR }), volume: 600 },
    { date: format(new Date(2024, 10, 9), "d MMM", { locale: ptBR }), volume: 1620 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume</CardTitle>
        <div>
          <TypographyH2 className="font-semibold">1620kg</TypographyH2>
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

