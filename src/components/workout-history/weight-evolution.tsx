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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getApiSessionsClientByClientIdQueryOptions } from "@/gen/hooks/useGetApiSessionsClientByClientId";
import type { GetApiSessionsClientByClientId200 } from "@/gen/types/GetApiSessionsClientByClientId";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

const MONTHS_PT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];
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
  const today = new Date();
  const [displayedMonth, setDisplayedMonth] = useState(() => new Date());
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(() => today.getFullYear());

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

  function selectMonth(monthIndex: number) {
    setDisplayedMonth(new Date(pickerYear, monthIndex, 1));
    setSelectedExerciseId(null);
    setMonthPickerOpen(false);
  }

  const monthLabel = format(displayedMonth, "MMMM yyyy", { locale: ptBR });
  const monthLabelCapitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  return (
    <div className="flex gap-6 items-start">
      <div className="flex flex-col gap-3 w-fit min-w-[200px]">
        <Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="capitalize font-semibold text-base px-2 gap-1">
              {monthLabelCapitalized}
              <ChevronDownIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-60 p-3">
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPickerYear((y) => y - 1)}
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <span className="text-sm font-medium">{pickerYear}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPickerYear((y) => y + 1)}
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {MONTHS_PT.map((month, i) => (
                <Button
                  key={month}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => selectMonth(i)}
                >
                  {month}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {exercises.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum treino realizado neste mês.</p>
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
                <p className="text-sm text-muted-foreground px-1">Nenhum treino encontrado.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {filteredExercises.map((ex) => (
                    <li key={ex.id}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start h-auto py-1.5 ${selectedExerciseId === ex.id ? "bg-primary/10 text-primary font-medium hover:bg-primary/15 hover:text-primary" : ""}`}
                        onClick={() => setSelectedExerciseId(ex.id)}
                      >
                        {ex.thumbnailUrl && (
                          <img src={ex.thumbnailUrl} alt={ex.name} className="size-10 rounded-full object-cover shrink-0 bg-muted" />
                        )}
                        <span>{ex.name}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {exercises.length > 0 &&
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
      }
    </div>
  );
}
