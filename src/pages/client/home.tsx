import { Avatar } from "@/components/ui/avatar"

import ProfileClientSheet from "@/components/trainer/sheet/profile-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AvatarImage } from "@/components/ui/avatar"
import { AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TypographyH4, TypographyH5, TypographySpan } from "@/components/ui/typography";
import { formatRelativeDate } from "@/lib/date";
import { Paperclip, UserIcon } from "lucide-react";

const mockProgram = {
  "id": "18761fea-f6ec-4e2b-ac3f-939eadf065f0",
  "name": "Treino 4x na semana",
  "description": "This is a full body 3 day program. You should do it 3 times a week and rest between days.",
  "startDate": "2025-11-01",
  "createdAt": "2025-06-31",
  "duration": 10,
  trainer: {
    id: "1",
    name: "Gabriel Xavier",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocIRDg4xyQEAaItY1oxDz3Kx7KdmtPkObulvnvbctzlmDkngNvQGQg=s96-c",
    "createdAt": "2025-06-31",
    email: "gabriel.xavier@example.com",
  },
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

export default function ClientHome() {
  const data = mockProgram;
  return <div className="flex flex-col gap-4">
    <ProfileClientSheet trainer={data.trainer} trigger={<Card>
      <CardContent className="flex items-center gap-4" >
        <Avatar className="size-20">
          <AvatarImage src={data.trainer.avatar} alt={data.trainer.name} />
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col ">
          <TypographyH4>{data.trainer.name}</TypographyH4>
          <TypographySpan className="text-muted-foreground">{data.trainer.email}</TypographySpan>
        </div>
      </CardContent>
    </Card>} />



    <div className="flex flex-col ">
      <TypographyH5>Programa: {data.name}</TypographyH5>
      <TypographySpan className="text-muted-foreground">
        Iniciou {formatRelativeDate(data.startDate)}
        {/* {data.duration && <>, semana {calculateWeeksFromDate(data.startDate)} de {data.duration}</>} */}
      </TypographySpan>
    </div>

    {data.description && <Alert variant="default">
      <Paperclip />
      <AlertTitle>Nota do treinador</AlertTitle>
      <AlertDescription>
        {data.description}
      </AlertDescription>
    </Alert>}

    {data.workouts.map((workout) => (
      <Card key={workout.id}>
        <CardContent>
          <TypographyH5>{workout.name}</TypographyH5>
          <TypographySpan className="text-muted-foreground">
            {workout.exercises.map((exercise) => exercise.name).join(", ")}
          </TypographySpan>
        </CardContent>
        <CardFooter>
          <Button className="w-full"> Iniciar Treino</Button>
        </CardFooter>
      </Card>
    ))}
  </div>
}