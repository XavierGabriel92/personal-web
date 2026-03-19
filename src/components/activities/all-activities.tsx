import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import type { ActivityType, WeightAddedData, WorkoutFinishedData } from "./schemas";
import WeightAdded from "./weight-added";
import WorkoutFinished from "./workout-finished";

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
  {
    id: "3",
    clientName: "joaosilva",
    data: {
      workoutName: "Push",
      duration: 45,
      weight: 1850,
      series: 6,
    },
    type: "workout-finished" as ActivityType,
    createdAt: "2025-01-15T14:20:00"
  },
  {
    id: "4",
    clientName: "mariasantos",
    data: {
      workoutName: "Legs",
      duration: 60,
      weight: 2100,
      series: 7,
    },
    type: "workout-finished" as ActivityType,
    createdAt: "2025-01-15T09:00:00"
  },
  {
    id: "5",
    clientName: "pedrooliveira",
    data: {
      weight: 75,
      weightDifference: 2,
      direction: "up",
    },
    type: "weight-added" as ActivityType,
    createdAt: "2025-01-14T18:30:00"
  },
  {
    id: "6",
    clientName: "anacosta",
    data: {
      workoutName: "Upper Body",
      duration: 50,
      weight: 1200,
      series: 4,
    },
    type: "workout-finished" as ActivityType,
    createdAt: "2025-01-14T16:45:00"
  },
  {
    id: "7",
    clientName: "carlosferreira",
    data: {
      weight: 92,
      weightDifference: 1.5,
      direction: "down",
    },
    type: "weight-added" as ActivityType,
    createdAt: "2025-01-14T08:00:00"
  },
  {
    id: "8",
    clientName: "julialima",
    data: {
      workoutName: "Full Body",
      duration: 55,
      weight: 1450,
      series: 5,
    },
    type: "workout-finished" as ActivityType,
    createdAt: "2025-01-13T19:15:00"
  },
  {
    id: "9",
    clientName: "xaviergabrielaluno",
    data: {
      workoutName: "Push",
      duration: 48,
      weight: 1750,
      series: 6,
    },
    type: "workout-finished" as ActivityType,
    createdAt: "2025-01-13T13:30:00"
  },
  {
    id: "10",
    clientName: "rafaelmartins",
    data: {
      weight: 88,
      weightDifference: 3,
      direction: "up",
    },
    type: "weight-added" as ActivityType,
    createdAt: "2025-01-13T11:20:00"
  },
  {
    id: "11",
    clientName: "fernandarodrigues",
    data: {
      workoutName: "Back & Biceps",
      duration: 58,
      weight: 1680,
      series: 5,
    },
    type: "workout-finished" as ActivityType,
    createdAt: "2025-01-12T17:00:00"
  },
  {
    id: "12",
    clientName: "mariasantos",
    data: {
      weight: 65,
      weightDifference: 0.5,
      direction: "down",
    },
    type: "weight-added" as ActivityType,
    createdAt: "2025-01-12T10:45:00"
  },
  {
    id: "13",
    clientName: "joaosilva",
    data: {
      workoutName: "Chest & Triceps",
      duration: 42,
      weight: 1950,
      series: 6,
    },
    type: "workout-finished" as ActivityType,
    createdAt: "2025-01-11T15:30:00"
  },
  {
    id: "14",
    clientName: "anacosta",
    data: {
      weight: 58,
      weightDifference: 1,
      direction: "up",
    },
    type: "weight-added" as ActivityType,
    createdAt: "2025-01-11T09:15:00"
  },
  {
    id: "15",
    clientName: "pedrooliveira",
    data: {
      workoutName: "Legs & Glutes",
      duration: 65,
      weight: 2200,
      series: 8,
    },
    type: "workout-finished" as ActivityType,
    createdAt: "2025-01-10T18:00:00"
  },
];

interface AllActivitiesSheetProps {
  clientId: string;
}
export default function AllActivitiesSheet({ clientId: _clientId }: AllActivitiesSheetProps) {
  const [open, setOpen] = useState(false);
  const data = mockActivities;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="link"
        >
          Ver todas
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Histórioco de Atividades</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 gap-4 flex flex-col">
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
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}