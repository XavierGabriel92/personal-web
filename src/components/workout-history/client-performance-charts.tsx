import type { GetApiSessionsClientByClientId200 } from "@/gen/types/GetApiSessionsClientByClientId";
import { DurationCard } from "./duration";
import { SetCard } from "./set";
import { VolumeCard } from "./volume";

type Session = GetApiSessionsClientByClientId200["sessions"][number];

interface ClientPerformanceChartsProps {
  sessions: Session[];
  weekStart: Date;
}

export default function ClientPerformanceCharts({ sessions, weekStart }: ClientPerformanceChartsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <VolumeCard sessions={sessions} weekStart={weekStart} />
      <SetCard sessions={sessions} weekStart={weekStart} />
      <DurationCard sessions={sessions} weekStart={weekStart} />
    </div>
  );
}
