import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetApiActivitiesTrainerSuspense } from "@/gen/hooks/useGetApiActivitiesTrainerSuspense";
import type { GetApiActivitiesTrainer200 } from "@/gen/types/GetApiActivitiesTrainer";
import { AllTrainerActivitiesSheet } from "./all-activities";
import type { WeightAddedData, WorkoutFinishedData } from "./schemas";
import WeightAdded from "./weight-added";
import WorkoutFinished from "./workout-finished";

type Activity = GetApiActivitiesTrainer200["activities"][number];

export default function TrainerFeed() {
  const { data } = useGetApiActivitiesTrainerSuspense({ limit: 5, offset: 0 });
  const activities = data?.activities ?? [];

  return (
    <Card className="h-[400px] overflow-y-auto">
      <CardHeader className="items-center border-b">
        <CardTitle>Ultimas Atividades</CardTitle>
        <CardAction>
          <AllTrainerActivitiesSheet />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 && (
          <p className="text-sm text-muted-foreground text-center pt-4">Nenhuma atividade recente.</p>
        )}
        {activities.map((activity: Activity) => {
          switch (activity.type) {
            case "WORKOUT_COMPLETED":
              return (
                <WorkoutFinished
                  key={activity.id}
                  clientName={activity.clientName}
                  data={activity.payload as WorkoutFinishedData}
                  createdAt={activity.createdAt}
                />
              );
            case "WEIGHT_LOGGED":
              return (
                <WeightAdded
                  key={activity.id}
                  clientName={activity.clientName}
                  data={activity.payload as WeightAddedData}
                  createdAt={activity.createdAt}
                />
              );
            default:
              return null;
          }
        })}
      </CardContent>
    </Card>
  );
}
