import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { getApiSessionsClientByClientIdQueryOptions } from "@/gen/hooks/useGetApiSessionsClientByClientId";
import type { GetApiSessionsClientByClientId200 } from "@/gen/types/GetApiSessionsClientByClientId";
import { useSuspenseQuery } from "@tanstack/react-query";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type Session = GetApiSessionsClientByClientId200["sessions"][number];

function getMonthRange(month: Date): { since: string; until: string } {
  const since = new Date(month.getFullYear(), month.getMonth(), 1);
  const until = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);
  return { since: since.toISOString(), until: until.toISOString() };
}

/**
 * Extracts unique exercises from a list of sessions.
 * Returns them sorted alphabetically by name.
 */
export function extractUniqueExercises(sessions: Session[]): { id: string; name: string; thumbnailUrl?: string }[] {
  const map = new Map<string, { name: string; thumbnailUrl?: string }>();
  for (const session of sessions) {
    for (const ex of session.exercises ?? []) {
      if (!map.has(ex.exerciseId)) {
        map.set(ex.exerciseId, { name: ex.exerciseName, thumbnailUrl: ex.thumbnailUrl });
      }
    }
  }
  return Array.from(map.entries())
    .map(([id, { name, thumbnailUrl }]) => ({ id, name, thumbnailUrl }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

/**
 * Builds a weight evolution series for a given exercise.
 * Each point is the maximum weight (kg) lifted in a session, ordered by date.
 * Sessions where all sets have weight_kg === 0 are excluded.
 */
export function buildWeightEvolution(
  sessions: Session[],
  exerciseId: string
): { date: string; weight: number }[] {
  return sessions
    .filter((s) => s.exercises?.some((e) => e.exerciseId === exerciseId))
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
    .flatMap((s) => {
      const ex = s.exercises?.find((e) => e.exerciseId === exerciseId);
      if (!ex) return [];
      const maxWeight = Math.max(...ex.sets.map((set) => set.weight_kg));
      if (maxWeight === 0) return [];
      return [{ date: format(new Date(s.startedAt), "d MMM", { locale: ptBR }), weight: maxWeight }];
    });
}

const chartConfig = {
  weight: {
    label: "Carga máx.",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface WeightEvolutionProps {
  clientId: string;
}

export default function WeightEvolution({ clientId }: WeightEvolutionProps) {
  const [displayedMonth, setDisplayedMonth] = useState(() => new Date());
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { since, until } = getMonthRange(displayedMonth);
  const { data } = useSuspenseQuery(
    getApiSessionsClientByClientIdQueryOptions(clientId, { since, until })
  );

  const sessions = data.sessions;
  const exercises = extractUniqueExercises(sessions);
  const filteredExercises = search.trim()
    ? exercises.filter((ex) => ex.name.toLowerCase().includes(search.toLowerCase()))
    : exercises;
  const chartData = selectedExerciseId ? buildWeightEvolution(sessions, selectedExerciseId) : [];
  const selectedExercise = exercises.find((e) => e.id === selectedExerciseId);

  const goToPrevMonth = () => {
    setDisplayedMonth((m) => subMonths(m, 1));
    setSelectedExerciseId(null);
  };

  const goToNextMonth = () => {
    setDisplayedMonth((m) => addMonths(m, 1));
    setSelectedExerciseId(null);
  };

  const goToToday = () => {
    setDisplayedMonth(new Date());
    setSelectedExerciseId(null);
  };

  const monthLabel = format(displayedMonth, "MMMM yyyy", { locale: ptBR });
  const monthLabelCapitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  return (
    <div className="flex gap-6 items-start">
      <div className="flex flex-col gap-3 w-fit min-w-[200px]">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToPrevMonth}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm font-medium flex-1 text-center">{monthLabelCapitalized}</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToNextMonth}>
            <ChevronRight className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={goToToday}>
            Hoje
          </Button>
        </div>

        {exercises.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum exercício neste mês.</p>
        ) : (
          <Card>
            <CardContent className=" flex flex-col gap-2">
              <Input
                placeholder="Buscar exercício..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 text-sm"
              />
              {filteredExercises.length === 0 ? (
                <p className="text-sm text-muted-foreground px-1">Nenhum exercício encontrado.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {filteredExercises.map((ex) => (
                    <li key={ex.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedExerciseId(ex.id)}
                        className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors hover:bg-accent cursor-pointer ${selectedExerciseId === ex.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          {ex.thumbnailUrl && (
                            <img src={ex.thumbnailUrl} alt={ex.name} className="size-10 rounded-full object-cover shrink-0 bg-muted" />
                          )}
                          <span>{ex.name}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex-1">
        {!selectedExerciseId ? (
          <p className="text-sm text-muted-foreground">
            Selecione um exercício para ver a evolução.
          </p>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem dados para este mês.</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{selectedExercise?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <LineChart data={chartData}>
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
                    tickFormatter={(value) => `${value}kg`}
                    domain={[(min: number) => Math.floor(min * 0.9), (max: number) => Math.ceil(max * 1.1)]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    dataKey="weight"
                    stroke="var(--color-weight)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "var(--color-weight)", strokeWidth: 0 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
