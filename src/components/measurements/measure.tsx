import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { TypographyH3 } from "@/components/ui/typography";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Minus, MoveDownRight, MoveUpRight } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { MeasurementItem } from "./schema";

const mockChartData = [
  {
    date: format(new Date(2025, 0, 1), "d MMM", { locale: ptBR }),
    value: 100,
  },
  {
    date: format(new Date(2025, 0, 8), "d MMM", { locale: ptBR }),
    value: 96,
  },
  {
    date: format(new Date(2025, 0, 15), "d MMM", { locale: ptBR }),
    value: 92,
  },
  {
    date: format(new Date(2025, 0, 22), "d MMM", { locale: ptBR }),
    value: 88,
  },
  {
    date: format(new Date(2025, 0, 29), "d MMM", { locale: ptBR }),
    value: 93,
  },
  {
    date: format(new Date(2025, 1, 5), "d MMM", { locale: ptBR }),
    value: 91,
  },
]

export default function Measurement({ measurement }: { measurement: MeasurementItem }) {
  const data = mockChartData

  const values = data.map((item) => item.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const range = maxValue - minValue
  const padding = range * 0.1 // 10% padding
  const yAxisMin = Math.max(0, minValue - padding)
  const yAxisMax = maxValue + padding

  const chartConfig = {
    measurement: {
      label: measurement.text,
      color: "var(--color-primary)",
    },
  } satisfies ChartConfig

  return <div className="space-y-4">
    <TypographyH3 className="font-medium">{measurement.text}</TypographyH3>
    <Card>
      <CardHeader>
        <CardDescription>Ultima medida</CardDescription>
        <CardTitle>88kg</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis dataKey="value" domain={[yAxisMin, yAxisMax]} />
            <Line type="linear" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
    {data.map((item, index) => {
      const previousValue = index > 0 ? data[index - 1].value : null
      let Icon = Minus

      if (previousValue !== null) {
        if (item.value > previousValue) {
          Icon = MoveUpRight
        } else if (item.value < previousValue) {
          Icon = MoveDownRight
        }
      }

      return (
        <Card key={item.date}>
          <CardContent className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-muted p-2 rounded-full text-muted-foreground">
                <Icon className="size-4" />
              </div>
              <CardTitle>{item.value}kg</CardTitle>
            </div>
            <CardDescription>{item.date}</CardDescription>
          </CardContent>
        </Card>
      )
    })}
  </div>
}