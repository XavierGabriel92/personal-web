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
  currentValue,
}: VolumeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume</CardTitle>
        <div>
          <TypographyH2 className="font-semibold">{currentValue ?? "—"}</TypographyH2>
          <CardDescription>Essa semana</CardDescription>
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

