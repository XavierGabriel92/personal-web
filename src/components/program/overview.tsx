import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { TypographySpan, TypographySpanXSmall } from "@/components/ui/typography";
import { calculateWeeksFromDate, formatDateToText } from "@/lib/date";
import { Link } from "@tanstack/react-router";
import { CalendarIcon, CalendarPlusIcon, PlusIcon } from "lucide-react";

interface ProgramOverviewProps {
  clientId: string;
}

const mockProgram = {
  "id": "18761fea-f6ec-4e2b-ac3f-939eadf065f0",
  "title": "Full Body x3",
  "notes": "This is a full body 3 day program. You should do it 3 times a week and rest between days.",
  "startDate": "2025-11-01",
  "createdAt": "2025-06-31",
  "duration": 10,
  workouts: [
    {
      id: "1",
      name: "Full Body A",
      exercises: [
        {
          id: "1",
          name: "Agachamento Livre",
          img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 20,
              restTime: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 40,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 40,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 40,
              restTime: 90,
            },
          ],
        },
        {
          id: "2",
          name: "Supino Reto com Barra",
          img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 20,
              restTime: 60,
            },
            {
              type: "valid",
              reps: 10,
              weight: 30,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 30,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 6,
              weight: 30,
              restTime: 90,
            },
          ],
        },
        {
          id: "3",
          name: "Remada Curvada",
          img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 15,
              restTime: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 25,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 25,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 25,
              restTime: 90,
            },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Full Body B",
      exercises: [
        {
          id: "1",
          name: "Leg Press",
          img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
          sets: [
            {
              type: "warm-up",
              reps: 12,
              weight: 50,
              restTime: 60,
            },
            {
              type: "valid",
              reps: 15,
              weight: 80,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 12,
              weight: 80,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 80,
              restTime: 90,
            },
          ],
        },
        {
          id: "2",
          name: "Desenvolvimento com Halteres",
          img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 8,
              restTime: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 12,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 12,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 12,
              restTime: 90,
            },
          ],
        },
        {
          id: "3",
          name: "Puxada Frontal",
          img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 20,
              restTime: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 35,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 35,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 35,
              restTime: 90,
            },
          ],
        },
      ],
    },
    {
      id: "3",
      name: "Full Body C",
      exercises: [
        {
          id: "1",
          name: "Stiff com Halteres",
          img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 15,
              restTime: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 25,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 25,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 25,
              restTime: 90,
            },
          ],
        },
        {
          id: "2",
          name: "Supino Inclinado com Halteres",
          img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 12,
              restTime: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 20,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 20,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 20,
              restTime: 90,
            },
          ],
        },
        {
          id: "3",
          name: "Rosca Direta com Halteres",
          img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 8,
              restTime: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 12,
              restTime: 60,
            },
            {
              type: "valid",
              reps: 10,
              weight: 12,
              restTime: 60,
            },
            {
              type: "valid",
              reps: 8,
              weight: 12,
              restTime: 60,
            },
          ],
        },
      ],
    },
    {
      id: "4",
      name: "Upper Body Focus",
      exercises: [
        {
          id: "1",
          name: "Supino Reto com Barra",
          img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 20,
              restTime: 60,
            },
            {
              type: "valid",
              reps: 10,
              weight: 35,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 35,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 6,
              weight: 35,
              restTime: 90,
            },
          ],
        },
        {
          id: "2",
          name: "Remada Curvada",
          img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 15,
              restTime: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 30,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 30,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 30,
              restTime: 90,
            },
          ],
        },
        {
          id: "3",
          name: "Desenvolvimento com Halteres",
          img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
          sets: [
            {
              type: "warm-up",
              reps: 10,
              weight: 8,
              restTime: 60,
            },
            {
              type: "valid",
              reps: 12,
              weight: 14,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 10,
              weight: 14,
              restTime: 90,
            },
            {
              type: "valid",
              reps: 8,
              weight: 14,
              restTime: 90,
            },
          ],
        },
      ],
    },
  ]
}


export default function ProgramOverview({ clientId }: ProgramOverviewProps) {
  const data = mockProgram;
  const hasActiveProgram = data.title;
  return (
    <Card>
      {hasActiveProgram ? <>
        <CardHeader className="items-center border-b ">
          <CardTitle>Programa ativo</CardTitle>
          {hasActiveProgram && (
            <CardAction>
              <Button variant="link"
                size="sm" className="p-0">
                <Link to="/trainer/programs/$programId" params={{ programId: data.id }}>
                  Editar programa
                </Link>
              </Button>
            </CardAction>
          )}

        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-start">
            <div className="bg-muted p-4 rounded-full text-muted-foreground">
              <CalendarIcon />
            </div>
            <div className="flex flex-col gap-1">
              <TypographySpan className="font-medium">
                {data.title}
              </TypographySpan>
              <TypographySpan className="text-muted-foreground">
                {`${data.workouts.length} treinos - Data de início: ${formatDateToText(data.startDate)}`}
              </TypographySpan>
            </div>
            <TypographySpanXSmall className="text-muted-foreground ml-auto">
              Semana {calculateWeeksFromDate(data.startDate)} de {data.duration}
            </TypographySpanXSmall>
          </div>
        </CardContent>
      </> :
        <Empty className="p-0 md:p-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CalendarPlusIcon />
            </EmptyMedia>
            <EmptyTitle>Nenhum programa ativo</EmptyTitle>
            <EmptyDescription>Esse cliente ainda não possui um programa ativo</EmptyDescription>
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