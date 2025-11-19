import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AllActivitiesSheet from "./all-activities";
import type { ActivityType, WeightAddedData, WorkoutFinishedData } from "./schemas";
import WeightAdded from "./weight-added";
import WorkoutFinished from "./workout-finished";

interface LastActivitiesProps {
  clientId: string;
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
        <AllActivitiesSheet clientId={clientId} />
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


