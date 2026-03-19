
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { TypographySpan } from "@/components/ui/typography";
import WorkoutCard from "@/components/workout/collapsible/workout";
import { calculateWeeksFromDate } from "@/lib/date";
import { Link } from "@tanstack/react-router";
import { CalendarPlusIcon, PlusIcon } from "lucide-react";

interface ActiveProgramProps {
  clientId: string;
}


const mockProgram = {
  "id": "18761fea-f6ec-4e2b-ac3f-939eadf065f0",
  "name": "Treino 4x na semana",
  "description": "This is a full body 3 day program. You should do it 3 times a week and rest between days.",
  "startDate": "2025-11-01",
  "createdAt": "2025-06-31",
  "duration": 10,
  workouts: [
    {
      id: "1",
      name: "Full Body A",
      description: "Full body workout focusing on compound movements",
      ownerId: "trainer-1",
      routineId: "18761fea-f6ec-4e2b-ac3f-939eadf065f0",
      order: 0,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
      exercises: [
        {
          id: "1",
          order: 0,
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 20,
              rest: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 40,
              rest: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 40,
              rest: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 40,
              rest: 90,
            },
          ],
          exerciseData: {
            id: "ex-1",
            exerciseId: "ex-1",
            name: "Agachamento Livre",
            thumbnailUrl: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
            setsLogged: 0,
            instructions: [],
            alternativeExercises: [],
            secondaryMuscles: [],
            equipments: [],
          },
        },
        {
          id: "2",
          order: 1,
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 20,
              rest: 60,
            },
            {
              type: "valid",
              reps: 10,
              weight: 30,
              rest: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 30,
              rest: 90,
            },
            {
              type: "valid",
              reps: 6,
              weight: 30,
              rest: 90,
            },
          ],
          exerciseData: {
            id: "ex-2",
            exerciseId: "ex-2",
            name: "Supino Reto com Barra",
            thumbnailUrl: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
            setsLogged: 0,
            instructions: [],
            alternativeExercises: [],
            secondaryMuscles: [],
            equipments: [],
          },
        },
        {
          id: "3",
          order: 2,
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 15,
              rest: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 25,
              rest: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 25,
              rest: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 25,
              rest: 90,
            },
          ],
          exerciseData: {
            id: "ex-3",
            exerciseId: "ex-3",
            name: "Remada Curvada",
            thumbnailUrl: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
            setsLogged: 0,
            instructions: [],
            alternativeExercises: [],
            secondaryMuscles: [],
            equipments: [],
          },
        },
      ],
    },
    {
      id: "2",
      name: "Full Body B",
      description: "Full body workout variation B",
      ownerId: "trainer-1",
      routineId: "18761fea-f6ec-4e2b-ac3f-939eadf065f0",
      order: 1,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
      exercises: [
        {
          id: "4",
          order: 0,
          sets: [
            {
              type: "warm-up",
              reps: 12,
              weight: 50,
              rest: 60,
            },
            {
              type: "valid",
              reps: 15,
              weight: 80,
              rest: 90,
            },
            {
              type: "valid",
              reps: 12,
              weight: 80,
              rest: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 80,
              rest: 90,
            },
          ],
          exerciseData: {
            id: "ex-4",
            exerciseId: "ex-4",
            name: "Leg Press",
            thumbnailUrl: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
            setsLogged: 0,
            instructions: [],
            alternativeExercises: [],
            secondaryMuscles: [],
            equipments: [],
          },
        },
        {
          id: "5",
          order: 1,
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 8,
              rest: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 12,
              rest: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 12,
              rest: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 12,
              rest: 90,
            },
          ],
          exerciseData: {
            id: "ex-5",
            exerciseId: "ex-5",
            name: "Desenvolvimento com Halteres",
            thumbnailUrl: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
            setsLogged: 0,
            instructions: [],
            alternativeExercises: [],
            secondaryMuscles: [],
            equipments: [],
          },
        },
        {
          id: "6",
          order: 2,
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 20,
              rest: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 35,
              rest: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 35,
              rest: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 35,
              rest: 90,
            },
          ],
          exerciseData: {
            id: "ex-6",
            exerciseId: "ex-6",
            name: "Puxada Frontal",
            thumbnailUrl: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
            setsLogged: 0,
            instructions: [],
            alternativeExercises: [],
            secondaryMuscles: [],
            equipments: [],
          },
        },
      ],
    },
    {
      id: "3",
      name: "Full Body C",
      description: "Full body workout variation C",
      ownerId: "trainer-1",
      routineId: "18761fea-f6ec-4e2b-ac3f-939eadf065f0",
      order: 2,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
      exercises: [
        {
          id: "7",
          order: 0,
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 15,
              rest: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 25,
              rest: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 25,
              rest: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 25,
              rest: 90,
            },
          ],
          exerciseData: {
            id: "ex-7",
            exerciseId: "ex-7",
            name: "Stiff com Halteres",
            thumbnailUrl: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
            setsLogged: 0,
            instructions: [],
            alternativeExercises: [],
            secondaryMuscles: [],
            equipments: [],
          },
        },
        {
          id: "8",
          order: 1,
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 12,
              rest: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 20,
              rest: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 20,
              rest: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 20,
              rest: 90,
            },
          ],
          exerciseData: {
            id: "ex-8",
            exerciseId: "ex-8",
            name: "Supino Inclinado com Halteres",
            thumbnailUrl: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
            setsLogged: 0,
            instructions: [],
            alternativeExercises: [],
            secondaryMuscles: [],
            equipments: [],
          },
        },
        {
          id: "9",
          order: 2,
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 8,
              rest: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 12,
              rest: 60,
            },
            {
              type: "valid",
              reps: 10,
              weight: 12,
              rest: 60,
            },
            {
              type: "valid",
              reps: 8,
              weight: 12,
              rest: 60,
            },
          ],
          exerciseData: {
            id: "ex-9",
            exerciseId: "ex-9",
            name: "Rosca Direta com Halteres",
            thumbnailUrl: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
            setsLogged: 0,
            instructions: [],
            alternativeExercises: [],
            secondaryMuscles: [],
            equipments: [],
          },
        },
      ],
    },
    {
      id: "4",
      name: "Upper Body Focus",
      description: "Upper body focused workout",
      ownerId: "trainer-1",
      routineId: "18761fea-f6ec-4e2b-ac3f-939eadf065f0",
      order: 3,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
      exercises: [
        {
          id: "10",
          order: 0,
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 20,
              rest: 60,
            },
            {
              type: "valid",
              reps: 10,
              weight: 35,
              rest: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 35,
              rest: 90,
            },
            {
              type: "valid",
              reps: 6,
              weight: 35,
              rest: 90,
            },
          ],
          exerciseData: {
            id: "ex-10",
            exerciseId: "ex-10",
            name: "Supino Reto com Barra",
            thumbnailUrl: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
            setsLogged: 0,
            instructions: [],
            alternativeExercises: [],
            secondaryMuscles: [],
            equipments: [],
          },
        },
        {
          id: "11",
          order: 1,
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 15,
              rest: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 30,
              rest: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 30,
              rest: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 30,
              rest: 90,
            },
          ],
          exerciseData: {
            id: "ex-11",
            exerciseId: "ex-11",
            name: "Remada Curvada",
            thumbnailUrl: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
            setsLogged: 0,
            instructions: [],
            alternativeExercises: [],
            secondaryMuscles: [],
            equipments: [],
          },
        },
        {
          id: "12",
          order: 2,
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 8,
              rest: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 14,
              rest: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 14,
              rest: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 14,
              rest: 90,
            },
          ],
          exerciseData: {
            id: "ex-12",
            exerciseId: "ex-12",
            name: "Desenvolvimento com Halteres",
            thumbnailUrl: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
            setsLogged: 0,
            instructions: [],
            alternativeExercises: [],
            secondaryMuscles: [],
            equipments: [],
          },
        },
      ],
    },
  ]
}

export default function ActiveProgram({ clientId: _clientId }: ActiveProgramProps) {
  const data = mockProgram;
  const hasActiveProgram = data.name;
  return (
    <Card>
      {hasActiveProgram ? <>
        <CardHeader className="items-center border-b ">
          <CardTitle>{data.name}</CardTitle>
          {hasActiveProgram && (
            <CardAction className="flex items-center gap-2">
              <TypographySpan className="text-muted-foreground ml-auto">
                Semana {calculateWeeksFromDate(data.startDate)} de {data.duration} -
              </TypographySpan>

              <Button variant="link"
                size="sm" className="p-0">
                <Link to="/trainer/routines/$routineId" params={{ routineId: data.id }}>
                  Editar programa
                </Link>
              </Button>
            </CardAction>
          )}

        </CardHeader>
        <CardContent className="space-y-4">
          {data.workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </CardContent>
      </> :
        <Empty className="p-0 md:p-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CalendarPlusIcon />
            </EmptyMedia>
            <EmptyTitle>Nenhum programa ativo</EmptyTitle>
            <EmptyDescription>Esse aluno ainda não possui um programa ativo</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>
              <PlusIcon />
              Criar programa
            </Button>
          </EmptyContent>
        </Empty>}
    </Card>
  )
}
