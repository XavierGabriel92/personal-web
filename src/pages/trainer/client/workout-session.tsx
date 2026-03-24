import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import SessionCard from "@/components/workout-history/session-card";
import WeeklySessions from "@/components/workout-history/weekly-sessions";
import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Suspense, useState } from "react";

interface WorkoutSessionPageProps {
  clientId: string;
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

const MONTHS_PT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export default function WorkoutSessionPage({ clientId }: WorkoutSessionPageProps) {
  const today = new Date();
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(today, { weekStartsOn: 0 })
  );
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(() => today.getFullYear());

  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 0 });
  const monthLabel = format(currentWeekStart, "MMMM yyyy", { locale: ptBR });
  const weekStartLabel = format(currentWeekStart, "EEE d", { locale: ptBR });
  const weekEndLabel = format(weekEnd, "EEE d", { locale: ptBR });

  function selectMonth(monthIndex: number) {
    setCurrentWeekStart(
      startOfWeek(new Date(pickerYear, monthIndex, 1), { weekStartsOn: 0 })
    );
    setMonthPickerOpen(false);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="capitalize font-semibold text-base px-2 gap-1">
              {monthLabel}
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

        <p className="text-sm text-muted-foreground capitalize">
          {weekStartLabel} - {weekEndLabel}
        </p>

        <ButtonGroup>
          <Button variant="outline" size="icon-sm" onClick={() => setCurrentWeekStart((w) => subWeeks(w, 1))}>
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }))}
          >
            Hoje
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => setCurrentWeekStart((w) => addWeeks(w, 1))}>
            <ChevronRightIcon />
          </Button>
        </ButtonGroup>
      </div>

      <div className="border-t" />

      <Suspense fallback={<Spinner className="size-5 mx-auto my-4" />}>
        <WeeklySessions
          clientId={clientId}
          weekStart={currentWeekStart}
          onSessionClick={setSelectedSession}
        />
      </Suspense>

      <Dialog
        open={!!selectedSession}
        onOpenChange={(open) => {
          if (!open) setSelectedSession(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSession?.workoutName ?? "Treino livre"}</DialogTitle>
          </DialogHeader>
          {selectedSession && <SessionCard session={selectedSession} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
