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
import { TypographyH5, TypographySpan } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { Workout } from "@/schemas";
import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { useMemo } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

interface ResumeProgramSidebarProps {
  workouts: Workout[];
}


export function ResumeProgramSidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn("absolute border p-5", className)}>
      <ChevronsLeftIcon className="size-8" />
    </Button>
  );
}

// Mapeia exercícios para grupos musculares baseado no nome
function getBodyPartFromExercise(exerciseName: string): string {
  const name = exerciseName.toLowerCase();

  // Pernas
  if (
    name.includes("agachamento") ||
    name.includes("leg press") ||
    name.includes("stiff") ||
    name.includes("extensão") ||
    name.includes("flexão") ||
    name.includes("panturrilha") ||
    name.includes("afundo") ||
    name.includes("passada")
  ) {
    return "pernas";
  }

  // Peito
  if (
    name.includes("supino") ||
    name.includes("peito") ||
    name.includes("crucifixo") ||
    name.includes("crossover")
  ) {
    return "peito";
  }

  // Costas
  if (
    name.includes("remada") ||
    name.includes("puxada") ||
    name.includes("barra") ||
    name.includes("pull") ||
    name.includes("costas")
  ) {
    return "costas";
  }

  // Ombros
  if (
    name.includes("desenvolvimento") ||
    name.includes("ombro") ||
    name.includes("elevação") ||
    name.includes("lateral") ||
    name.includes("frontal")
  ) {
    return "ombros";
  }

  // Braços
  if (
    name.includes("rosca") ||
    name.includes("tríceps") ||
    name.includes("bíceps") ||
    name.includes("curl") ||
    name.includes("braço")
  ) {
    return "braços";
  }

  // Core
  if (
    name.includes("abdominal") ||
    name.includes("prancha") ||
    name.includes("core") ||
    name.includes("abdominais") ||
    name.includes("oblíquo")
  ) {
    return "core";
  }

  // Default: distribuir entre grupos principais
  return "outros";
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
      for (const exercise of workout.exercises) {
        const bodyPart = getBodyPartFromExercise(exercise.name);

        if (bodyPart in bodyParts) {
          const validSets = exercise.sets.length;
          bodyParts[bodyPart] += validSets;
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
      <SidebarHeader className="border-b pb-4 flex items-center justify-between flex-row shrink-0 sticky top-0 bg-sidebar z-10">
        <TypographyH5>Resumo</TypographyH5>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} >
          <ChevronsRightIcon className="size-8" />
        </Button>
      </SidebarHeader>
      <SidebarContent className="w-screen sm:w-auto">
        <div className="flex items-center justify-between">
          <TypographySpan className="font-medium text-muted-foreground">Total de exercícios: </TypographySpan>
          {workouts.reduce((acc, workout) => acc + workout.exercises.length, 0)}
        </div>
        <div className="flex items-center justify-between">
          <TypographySpan className="font-medium text-muted-foreground">Total de séries: </TypographySpan>
          {workouts.reduce((acc, workout) => acc + workout.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0), 0)}
        </div>

        <div className="mt-4">
          <TypographySpan className="font-medium text-muted-foreground mb-2 block">
            Séries por Grupo Muscular
          </TypographySpan>
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
            <RadarChart data={bodyPartData}>
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
                dataKey="sets"
                fill="var(--color-sets)"
                fillOpacity={0.6}
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

  return (
    <Sidebar
      side="right"
      noOverlay={true}
      avoidFullHeight={true}
    >
      <ResumeProgramSidebarContent workouts={workouts} />
    </Sidebar>
  );
}
