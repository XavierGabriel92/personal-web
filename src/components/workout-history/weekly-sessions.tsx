import { getApiSessionsClientByClientIdQueryOptions } from "@/gen/hooks/useGetApiSessionsClientByClientId";
import { useSuspenseQuery } from "@tanstack/react-query";
import { endOfWeek, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ClientPerformanceCharts from "./client-performance-charts";

type Session = {
  id: string;
  workoutName?: string;
  completedAt?: string;
  createdAt: string;
  startedAt: string;
  exercises?: {
    exerciseId: string;
    exerciseName: string;
    thumbnailUrl?: string;
    sets: { reps: number; weight_kg: number }[];
    notes?: string;
  }[];
};

interface SessionListProps {
  sessions: Session[];
  onSessionClick: (session: Session) => void;
}

function SessionList({ sessions, onSessionClick }: SessionListProps) {
  return (
    <div className="flex flex-col gap-2">
      {sessions.map((session) => {
        const dateLabel = format(new Date(session.startedAt), "EEEE 'às' HH:mm", {
          locale: ptBR,
        });
        return (
          <button
            type="button"
            key={session.id}
            onClick={() => onSessionClick(session)}
            className="flex items-center gap-3 rounded-md border px-4 py-3 text-left hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="size-2 rounded-full bg-primary shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">
                {session.workoutName}
              </span>
              <span className="text-xs text-muted-foreground capitalize">{dateLabel}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

interface WeeklySessionsProps {
  clientId: string;
  weekStart: Date;
  onSessionClick: (session: Session) => void;
}

export default function WeeklySessions({ clientId, weekStart, onSessionClick }: WeeklySessionsProps) {
  const since = weekStart.toISOString();
  const until = endOfWeek(weekStart, { weekStartsOn: 0 }).toISOString();

  const { data } = useSuspenseQuery(
    getApiSessionsClientByClientIdQueryOptions(clientId, { since, until })
  );

  const sessions = [...data.sessions].sort(
    (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
  );

  return (
    <>
      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">
          Nenhum treino nesta semana
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          <SessionList sessions={sessions} onSessionClick={onSessionClick} />
          <ClientPerformanceCharts sessions={sessions} weekStart={weekStart} />
        </div>
      )}
    </>
  );
}
