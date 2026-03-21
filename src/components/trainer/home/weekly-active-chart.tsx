import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useGetApiSessionsTrainerRecent } from "@/gen/hooks/useGetApiSessionsTrainerRecent";
import { format, startOfDay, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  activeClients: {
    label: "Alunos ativos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function WeeklyActiveChart() {
  const { data } = useGetApiSessionsTrainerRecent();
  const sessions = data?.sessions ?? [];

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = startOfDay(subDays(new Date(), 6 - i));
    return { day, label: format(day, "EEE", { locale: ptBR }) };
  });

  const chartData = days.map(({ day, label }) => {
    const nextDay = new Date(day.getTime() + 24 * 60 * 60 * 1000);
    const uniqueClients = new Set(
      sessions
        .filter((s) => {
          const d = new Date(s.createdAt);
          return d >= day && d < nextDay;
        })
        .map((s) => s.clientId)
    );
    return { date: label, activeClients: uniqueClients.size };
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Alunos ativos por dia (7 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="activeClients" fill="var(--color-activeClients)" radius={[4, 4, 0, 0]} barSize={25} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
