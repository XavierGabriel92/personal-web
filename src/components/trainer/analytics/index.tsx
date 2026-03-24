import { useGetApiClients } from "@/gen/hooks/useGetApiClients";
import { useGetApiSessionsTrainerRecent } from "@/gen/hooks/useGetApiSessionsTrainerRecent";
import { startOfDay } from "date-fns";
import { useState } from "react";
import AnalyticsClientsList from "./clients-list";
import AnalyticsStatsCards from "./stats-cards";

type Period = "hoje" | 7 | 30 | 90;

const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: "Hoje", value: "hoje" },
  { label: "7 dias", value: 7 },
  { label: "30 dias", value: 30 },
  { label: "90 dias", value: 90 },
];

function periodLabel(period: Period): string {
  return period === "hoje" ? "hoje" : `nos últimos ${period} dias`;
}

function apiDays(period: Period): number {
  return period === "hoje" ? 1 : period;
}

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState<Period>(7);

  const { data: clientsData } = useGetApiClients();
  const { data: sessionsData } = useGetApiSessionsTrainerRecent({ days: apiDays(period) });

  const clients = clientsData?.clients ?? [];
  const allSessions = sessionsData?.sessions ?? [];

  const sessions =
    period === "hoje"
      ? allSessions.filter((s) => new Date(s.createdAt) >= startOfDay(new Date()))
      : allSessions;

  const activeClientIds = new Set(sessions.map((s) => s.clientId));
  const total = clients.length;
  const active = clients.filter((c) => activeClientIds.has(c.id)).length;
  const inactive = total - active;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {PERIOD_OPTIONS.map((option) => (
          <button
            type="button"
            key={option.value}
            onClick={() => setPeriod(option.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              period === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <AnalyticsStatsCards total={total} active={active} inactive={inactive} periodLabel={periodLabel(period)} />
      <AnalyticsClientsList clients={clients} activeClientIds={activeClientIds} periodLabel={periodLabel(period)} />
    </div>
  );
}
