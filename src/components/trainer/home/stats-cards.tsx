import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetApiClients } from "@/gen/hooks/useGetApiClients";
import { useGetApiSessionsTrainerRecent } from "@/gen/hooks/useGetApiSessionsTrainerRecent";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export default function StatsCards() {
  const { data: clientsData } = useGetApiClients();
  const { data: recentData } = useGetApiSessionsTrainerRecent();
  const navigate = useNavigate();

  const clients = clientsData?.clients ?? [];
  const recentSessions = recentData?.sessions ?? [];

  const activeClientIds = new Set(recentSessions.map((s) => s.clientId));
  const total = clients.length;
  const active = clients.filter((c) => activeClientIds.has(c.id)).length;
  const inactive = total - active;

  const stats = [
    {
      label: "Total de Alunos",
      value: total,
      onClick: () => navigate({ to: "/trainer/analytics" }),
    },
    {
      label: "Ativos nos últimos 7 dias",
      value: active,
      onClick: () => navigate({ to: "/trainer/analytics" }),
    },
    {
      label: "Inativos nos últimos 7 dias",
      value: inactive,
      onClick: () => navigate({ to: "/trainer/analytics" }),
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={stat.onClick}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
