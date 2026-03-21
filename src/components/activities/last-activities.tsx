import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetApiActivitiesClientByClientIdSuspense } from "@/gen/hooks/useGetApiActivitiesClientByClientIdSuspense";
import type { GetApiActivitiesClientByClientId200 } from "@/gen/types/GetApiActivitiesClientByClientId";
import AllActivitiesSheet from "./all-activities";
import type { WeightAddedData, WorkoutFinishedData } from "./schemas";
import WeightAdded from "./weight-added";
import WorkoutFinished from "./workout-finished";

interface LastActivitiesProps {
  clientId: string;
}

type Activity = GetApiActivitiesClientByClientId200["activities"][number];

export default function LastActivities({ clientId }: LastActivitiesProps) {
  const { data } = useGetApiActivitiesClientByClientIdSuspense(clientId, {
    client: { params: { limit: 5, offset: 0 } },
  });
  const activities = data?.activities ?? [];

  return <Card className="h-[400px] overflow-y-auto">
    <CardHeader className="items-center border-b ">
      <CardTitle>Ultimas Atividades</CardTitle>
      <CardAction>
        <AllActivitiesSheet clientId={clientId} />
      </CardAction>
    </CardHeader>
    <CardContent className="space-y-4">
      {activities.map((activity: Activity) => {
        switch (activity.type) {
          case "WORKOUT_COMPLETED":
            return <WorkoutFinished
              key={activity.id}
              clientName={activity.clientName}
              data={activity.payload as WorkoutFinishedData}
              createdAt={activity.createdAt}
            />
          case "WEIGHT_LOGGED":
            return <WeightAdded
              key={activity.id}
              clientName={activity.clientName}
              data={activity.payload as WeightAddedData}
              createdAt={activity.createdAt}
            />
          default:
            return null;
        }
      })}
    </CardContent>
  </Card>
}
