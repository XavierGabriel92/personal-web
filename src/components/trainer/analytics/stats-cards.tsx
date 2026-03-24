import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsStatsCardsProps {
  total: number;
  active: number;
  inactive: number;
  periodLabel: string;
}

export default function AnalyticsStatsCards({ total, active, inactive, periodLabel }: AnalyticsStatsCardsProps) {
  const stats = [
    { label: "Total de Alunos", value: total },
    { label: `Ativos ${periodLabel}`, value: active },
    { label: `Inativos ${periodLabel}`, value: inactive },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
