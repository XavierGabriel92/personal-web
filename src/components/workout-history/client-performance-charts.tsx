import { useGetApiSessionsClientByClientId } from "@/gen/hooks/useGetApiSessionsClientByClientId";
import type { GetApiSessionsClientByClientId200 } from "@/gen/types/GetApiSessionsClientByClientId";
import { endOfWeek, format, isWithinInterval, startOfWeek, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DurationCard } from "./duration";
import { SetCard } from "./set";
import { VolumeCard } from "./volume";

type Session = GetApiSessionsClientByClientId200["sessions"][number];

function getLastFiveWeeks() {
  const now = new Date();
  return Array.from({ length: 5 }, (_, i) => {
    const weekStart = startOfWeek(subWeeks(now, 4 - i), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    return {
      weekStart,
      weekEnd,
      label: format(weekStart, "d MMM", { locale: ptBR }),
    };
  });
}

function computeSessionVolume(session: Session): number {
  return (session.exercises ?? []).reduce((total, ex) => {
    return total + ex.sets.reduce((s, set) => s + set.reps * set.weight_kg, 0);
  }, 0);
}

function computeSessionSets(session: Session): number {
  return (session.exercises ?? []).reduce((total, ex) => total + ex.sets.length, 0);
}

function computeSessionDuration(session: Session): number {
  if (!session.completedAt) return 0;
  const diff = new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime();
  return Math.max(0, Math.round(diff / 1000 / 60));
}

function buildWeeklyStats(sessions: Session[]) {
  const weeks = getLastFiveWeeks();

  const volumeData = weeks.map(({ weekStart, weekEnd, label }) => {
    const total = sessions
      .filter((s) => isWithinInterval(new Date(s.createdAt), { start: weekStart, end: weekEnd }))
      .reduce((sum, s) => sum + computeSessionVolume(s), 0);
    return { date: label, volume: Math.round(total) };
  });

  const setsData = weeks.map(({ weekStart, weekEnd, label }) => {
    const total = sessions
      .filter((s) => isWithinInterval(new Date(s.createdAt), { start: weekStart, end: weekEnd }))
      .reduce((sum, s) => sum + computeSessionSets(s), 0);
    return { date: label, sets: total };
  });

  const durationData = weeks.map(({ weekStart, weekEnd, label }) => {
    const total = sessions
      .filter((s) => isWithinInterval(new Date(s.createdAt), { start: weekStart, end: weekEnd }))
      .reduce((sum, s) => sum + computeSessionDuration(s), 0);
    return { date: label, duration: total };
  });

  return { volumeData, setsData, durationData };
}

function formatVolume(kg: number): string {
  if (kg === 0) return "0kg";
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`;
  return `${kg}kg`;
}

function formatDuration(minutes: number): string {
  if (minutes === 0) return "0 min";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}:${String(m).padStart(2, "0")}h`;
}

function getCurrentWeekStats(sessions: Session[]) {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const thisWeek = sessions.filter((s) =>
    isWithinInterval(new Date(s.createdAt), { start: weekStart, end: weekEnd })
  );

  const volume = thisWeek.reduce((sum, s) => sum + computeSessionVolume(s), 0);
  const sets = thisWeek.reduce((sum, s) => sum + computeSessionSets(s), 0);
  const duration = thisWeek.reduce((sum, s) => sum + computeSessionDuration(s), 0);

  return {
    volume: formatVolume(Math.round(volume)),
    sets: sets > 0 ? `${sets} séries` : "0 séries",
    duration: formatDuration(duration),
  };
}

interface ClientPerformanceChartsProps {
  clientId: string;
}

export default function ClientPerformanceCharts({ clientId }: ClientPerformanceChartsProps) {
  const until = new Date().toISOString();
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = useGetApiSessionsClientByClientId(clientId, { since, until });
  const sessions = data?.sessions ?? [];

  const { volumeData, setsData, durationData } = buildWeeklyStats(sessions);
  const current = getCurrentWeekStats(sessions);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <VolumeCard data={volumeData} currentValue={current.volume} />
      <SetCard data={setsData} currentValue={current.sets} />
      <DurationCard data={durationData} currentValue={current.duration} />
    </div>
  );
}
