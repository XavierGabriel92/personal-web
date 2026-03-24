import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import SessionCard from "@/components/workout-history/session-card";
import { getApiSessionsClientByClientIdQueryOptions } from "@/gen/hooks/useGetApiSessionsClientByClientId";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface WorkoutFrequencyCalendarProps {
  clientId: string;
}

function toDateKey(dateStr: string): string {
  return new Date(dateStr).toISOString().slice(0, 10);
}

function getMonthRange(month: Date): { since: string; until: string } {
  const since = new Date(month.getFullYear(), month.getMonth(), 1);
  const until = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);
  return { since: since.toISOString(), until: until.toISOString() };
}

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

export default function WorkoutFrequencyCalendar({ clientId }: WorkoutFrequencyCalendarProps) {
  const [displayedMonth, setDisplayedMonth] = useState(() => new Date());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const { since, until } = getMonthRange(displayedMonth);

  const { data } = useSuspenseQuery(
    getApiSessionsClientByClientIdQueryOptions(clientId, { since, until })
  );

  const sessionsByDate = new Map<string, Session[]>();
  for (const session of data.sessions) {
    const key = toDateKey(session.completedAt ?? session.createdAt);
    const list = sessionsByDate.get(key) ?? [];
    list.push(session);
    sessionsByDate.set(key, list);
  }

  const workoutDays = Array.from(sessionsByDate.keys()).map((key) => new Date(`${key}T12:00:00`));

  const totalSessions = data.sessions.length;
  const monthName = displayedMonth.toLocaleString("pt-BR", { month: "long" });

  return (
    <div className="flex gap-6 items-start">
      <div className="flex flex-col gap-2 w-fit">
        <Calendar
          month={displayedMonth}
          onMonthChange={setDisplayedMonth}
          modifiers={{ workout: workoutDays }}
          modifiersClassNames={{
            workout: "bg-primary/20 text-primary font-semibold rounded-md",
          }}
          onDayClick={(day) => {
            const key = day.toISOString().slice(0, 10);
            const sessions = sessionsByDate.get(key);
            if (sessions && sessions.length > 0) {
              setSelectedSession(sessions[0]);
            } else {
              setSelectedSession(null);
            }
          }}
          locale={ptBR}
          className="rounded-md border shrink-0"
          footer={
            <div className="pt-3 mt-1 border-t flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-3 rounded-sm bg-primary/20 shrink-0" />
                Clique para ver os detalhes
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={() => setDisplayedMonth(new Date())}
              >
                Hoje
              </Button>
            </div>
          }
        />
        <p className="text-sm font-medium">
          {totalSessions} treino{totalSessions !== 1 ? "s" : ""} em {monthName}
        </p>
      </div>

      {selectedSession && (
        <div className="flex-1">
          <SessionCard session={selectedSession} />
        </div>
      )}
    </div>
  );
}
