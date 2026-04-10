import { Button } from "@/components/ui/button";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TypographyH5, TypographySpan } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { WorkoutExercises } from "@/schemas";
import { ChevronsLeftIcon, XIcon } from "lucide-react";
import { useMemo } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

interface ResumeProgramSidebarProps {
  workouts: WorkoutExercises[];
}


export function ResumeProgramSidebarTrigger({ className: _className }: { className?: string }) {
  const { toggleSidebar, open, openMobile, isLgScreen } = useSidebar();
  // On mobile, use openMobile; on desktop, use open
  const isOpen = isLgScreen ? openMobile : open;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-sidebar="trigger"
          data-slot="sidebar-trigger"
          variant="ghost"
          size="icon-lg"
          className="size-8"
          onClick={(_event) => {
            toggleSidebar();
          }}
        >
          {isOpen ? <ChevronsLeftIcon /> : <ChevronsLeftIcon className="size-8" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isOpen ? "Reduzir" : "Ver resumo do programa"}</TooltipContent>
    </Tooltip>
  );
}

// Mapeia categoria / músculos (texto livre do catálogo) para a chave do radar
function resolveRadarBucket(label: string | undefined): string | null {
  if (!label?.trim()) return null;
  const n = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();

  if (n.includes("peito") || n.includes("peitoral")) return "peito";
  if (n.includes("costa") || n.includes("dorsal") || n.includes("lombar"))
    return "costas";
  if (n.includes("ombro") || n.includes("delt")) return "ombros";
  if (
    n.includes("bicep") ||
    n.includes("tricep") ||
    n.includes("antebraco") ||
    (n.includes("braco") && !n.includes("antebraco"))
  )
    return "braços";
  if (
    n.includes("perna") ||
    n.includes("quadric") ||
    n.includes("posterior") ||
    n.includes("panturrilha") ||
    n.includes("gluteo") ||
    n.includes("adutor")
  )
    return "pernas";
  if (
    n.includes("abdomen") ||
    n.includes("core") ||
    n.includes("abdominal") ||
    n.includes("obliquo")
  )
    return "core";

  return null;
}

function ResumeProgramSidebarContent({
  workouts,
}: ResumeProgramSidebarProps) {
  const { toggleSidebar } = useSidebar();

  // Calcula o número de séries por grupo muscular
  const bodyPartData = useMemo(() => {
    const bodyParts: Record<string, number> = {
      core: 0,
      ombros: 0,
      braços: 0,
      pernas: 0,
      costas: 0,
      peito: 0,
    };

    for (const workout of workouts) {
      for (const exercise of workout.exercises || []) {
        const setsCount = Array.isArray(exercise.sets) ? exercise.sets.length : (exercise.sets ? 1 : 0);
        if (setsCount === 0) continue;

        const primaryBucket = resolveRadarBucket(
          exercise.exerciseData?.primaryMuscle,
        ) ?? resolveRadarBucket(exercise.exerciseData?.category);
        if (primaryBucket && primaryBucket in bodyParts) {
          bodyParts[primaryBucket] += setsCount;
        }

        const secondaryRaw = exercise.exerciseData?.secondaryMuscle?.trim();
        if (secondaryRaw) {
          for (const part of secondaryRaw.split(/[,;/]/)) {
            const secondaryBucket = resolveRadarBucket(part);
            if (secondaryBucket && secondaryBucket in bodyParts) {
              bodyParts[secondaryBucket] += setsCount * 0.5;
            }
          }
        }
      }
    }

    const order = ["core", "ombros", "braços", "pernas", "costas", "peito"];
    const chartData = order.map((key) => ({
      grupo: key,
      sets: bodyParts[key],
    }));

    return chartData;
  }, [workouts]);

  const chartConfig = {
    sets: {
      label: "Séries",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <>
      <SidebarHeader className="border-b pb-4 flex items-center justify-between flex-row shrink-0 sticky top-0 bg-sidebar z-10 h-(--header-height)">
        <TypographyH5>Resumo</TypographyH5>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="flex lg:hidden">
          <XIcon className="size-5" />
        </Button>
      </SidebarHeader>
      <SidebarContent className="w-screen sm:w-auto">
        <div className="flex items-center justify-between">
          <TypographySpan className="font-medium text-muted-foreground">Total de exercícios: </TypographySpan>
          {workouts.reduce((acc, workout) => acc + (workout.exercises || []).length, 0)}
        </div>
        <div className="flex items-center justify-between">
          <TypographySpan className="font-medium text-muted-foreground">Total de séries: </TypographySpan>
          {workouts.reduce((acc, workout) => acc + (workout.exercises || []).reduce((acc, exercise) => {
            if (Array.isArray(exercise.sets)) {
              return acc + exercise.sets.length;
            }
            // Fallback para compatibilidade
            return acc + (exercise.sets ? 1 : 0);
          }, 0), 0)}
        </div>

        <div className="mt-4">
          <TypographySpan className="font-medium text-muted-foreground mb-2 block">
            Séries por Grupo Muscular
          </TypographySpan>
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px] w-full">
            <RadarChart
              data={bodyPartData}
              outerRadius="80%"
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis
                dataKey="grupo"
                tickFormatter={(value) => {
                  const labels: Record<string, string> = {
                    core: "Core",
                    ombros: "Ombros",
                    braços: "Braços",
                    pernas: "Pernas",
                    costas: "Costas",
                    peito: "Peito",
                  };
                  return labels[value] || value;
                }}
              />
              <PolarGrid />
              <Radar
                name="Séries"
                dataKey="sets"
                stroke="var(--color-sets)"
                fill="var(--color-sets)"
                fillOpacity={0.6}
                dot={{ r: 4 }}
              />
            </RadarChart>
          </ChartContainer>
        </div>
      </SidebarContent>
    </>
  );
}

export default function ResumeProgramSidebar({
  workouts,
}: ResumeProgramSidebarProps) {
  const { openMobile, isLgScreen } = useSidebar();

  return (
    <>
      <Sidebar
        side="right"
        noOverlay={true}
      // avoidFullHeight={true}
      >
        <ResumeProgramSidebarContent workouts={workouts} />
      </Sidebar>
      {/* Trigger button - visible on mobile in both open and closed states */}
      {isLgScreen && (
        <div
          className={cn(
            "fixed top-[50%] translate-y-[-50%] z-20 lg:hidden transition-all duration-200",
            openMobile ? "right-[21rem]" : "right-0"
          )}
        >
          <ResumeProgramSidebarTrigger className="size-8" />
        </div>
      )}
    </>
  );
}
