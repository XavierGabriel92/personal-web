import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographySpan, TypographySpanXSmall } from "@/components/ui/typography";
import { formatRelativeDate } from "@/lib/date";
import { DumbbellIcon, WeightIcon } from "lucide-react";

interface LastActivitiesProps {
  clientId: string;
}

type ActivityType = "workout-finished" | "weight-added";

interface WorkoutFinishedData {
  workoutName: string;
  duration: number;
  weight: number;
  series: number;
}

interface WeightAddedData {
  weight: number;
  weightDifference: number;
  direction: "up" | "down";
}

interface Activity {
  id: string;
  data: WorkoutFinishedData | WeightAddedData;
  type: ActivityType;
  createdAt: string;
}

const mockActivities = [
  {
    id: "1",
    clientName: "xaviergabrielaluno",
    data: {
      workoutName: "Pull",
      duration: 52,
      weight: 1620,
      series: 5,
    },
    type: "workout-finished" as ActivityType,
    createdAt: "2025-11-14T12:30:00"
  },
  {
    id: "2",
    clientName: "xaviergabrielaluno",
    data: {
      weight: 80,
      weightDifference: 6,
      direction: "up",
    },
    type: "weight-added" as ActivityType,
    createdAt: "2025-01-01T10:15:00"
  },
];


export default function LastActivities({ clientId }: LastActivitiesProps) {
  const data = mockActivities;
  return <Card className="h-[400px] overflow-y-auto">
    <CardHeader className="items-center border-b ">
      <CardTitle>Ultimas Atividades</CardTitle>
      <CardAction>
        <Button variant="link" size="sm" className="p-0">Ver todas</Button>
      </CardAction>
    </CardHeader>
    <CardContent className="space-y-4">
      {data.map((activity) => {
        switch (activity.type) {
          case "workout-finished":
            return <WorkoutFinished key={activity.id} {...activity} data={activity.data as WorkoutFinishedData} />
          case "weight-added":
            return <WeightAdded key={activity.id} {...activity} data={activity.data as WeightAddedData} />
          default:
            return <></>
        }
      })}
    </CardContent>
  </Card>
}


function WorkoutFinished({ clientName, data, createdAt }: { clientName: string, data: WorkoutFinishedData, createdAt: string }) {
  return <div className="flex items-center gap-4">
    <div className="bg-muted p-2 rounded-full">
      <DumbbellIcon />
    </div>

    <div className="flex flex-col gap-1">
      <TypographySpan>
        <span className="font-medium">{clientName}</span> completou o treino <span className="text-primary">{data.workoutName}</span> em {data.duration}min e levantou {data.weight}kg em {data.series} series.
      </TypographySpan>
      <TypographySpanXSmall className="text-muted-foreground">{formatRelativeDate(createdAt)}</TypographySpanXSmall>
    </div>
  </div>
}

function WeightAdded({ clientName, data, createdAt }: { clientName: string, data: WeightAddedData, createdAt: string }) {
  return <div className="flex items-center gap-4">
    <div className="bg-muted p-2 rounded-full">
      <WeightIcon />
    </div>

    <div className="flex flex-col gap-1">
      <TypographySpan>
        <span className="font-medium">{clientName}</span> adicionou um novo peso: <span className="text-primary">{data.weight}kg</span>, que é {data.weightDifference}kg {data.direction === "up" ? "a mais" : "a menos"} que o peso anterior.
      </TypographySpan>
      <TypographySpanXSmall className="text-muted-foreground">{formatRelativeDate(createdAt)}</TypographySpanXSmall>
    </div>
  </div>
}