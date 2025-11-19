import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TypographyH5, TypographySpan, TypographySpanXSmall } from "@/components/ui/typography";
import { formatRelativeDate } from "@/lib/date";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

const mockWorkoutHistory = [
  {
    id: "1",
    name: "Treino de Bíceps",
    finishedAt: "2025-11-15T15:00:00",
    duration: 60,
    volume: 660,
    sets: 10,
    exercises: [
      {
        id: "1",
        name: "Rosca Direta com Halteres",
        sets: [
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
        ],
        img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg"
      },
      {
        id: "2",
        name: "Rosca com Barra W",
        img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
        sets: [
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },

        ],
      },
      {
        id: "3",
        name: "Rosca no Banco Scott",
        img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
        sets: [
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },

        ],
      },
    ],
  },
  {
    id: "1",
    name: "Treino de Pernas",
    finishedAt: "2025-11-14T15:00:00",
    duration: 60,
    volume: 660,
    sets: 10,
    exercises: [
      {
        id: "1",
        name: "Rosca Direta com Halteres",
        sets: [
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
        ],
        img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg"
      },
      {
        id: "2",
        name: "Rosca com Barra W",
        img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
        sets: [
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },

        ],
      },
      {
        id: "3",
        name: "Rosca no Banco Scott",
        img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
        sets: [
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },

        ],
      },
    ],
  },
  {
    id: "3",
    name: "Treino de Ombros",
    finishedAt: "2025-11-13T15:00:00",
    duration: 60,
    volume: 660,
    sets: 10,
    exercises: [
      {
        id: "1",
        name: "Rosca Direta com Halteres",
        sets: [
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
        ],
        img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg"
      },
      {
        id: "2",
        name: "Rosca com Barra W",
        img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
        sets: [
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },

        ],
      },
      {
        id: "3",
        name: "Rosca no Banco Scott",
        img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
        sets: [
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },

        ],
      },
    ],
  },
  {
    id: "4",
    name: "Treino de Peito",
    finishedAt: "2025-11-11T15:00:00",
    duration: 60,
    volume: 660,
    sets: 10,
    exercises: [
      {
        id: "1",
        name: "Rosca Direta com Halteres",
        sets: [
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
        ],
        img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg"
      },
      {
        id: "2",
        name: "Rosca com Barra W",
        img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
        sets: [
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },

        ],
      },
      {
        id: "3",
        name: "Rosca no Banco Scott",
        img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
        sets: [
          {
            type: "warm-up",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },
          {
            type: "valid",
            reps: 10,
            weight: 10,
            restTime: 10,
          },

        ],
      },
    ],
  },
]

interface Set {
  type: string;
  reps: number;
  weight: number;
  restTime: number;
}
interface Exercise {
  id: string;
  name: string;
  img: string;
  sets: Set[];
}

interface WorkoutHistoryListProps {
  clientId: string;
}
export default function WorkoutHistoryList({ clientId }: WorkoutHistoryListProps) {
  const data = mockWorkoutHistory;
  return (
    <div className="space-y-4">
      {data.map((workout) => (
        <Card key={workout.id}>
          <CardHeader className="gap-4">
            <div className="flex gap-2 items-center ">
              <TypographyH5 className="font-medium">{workout.name}</TypographyH5>
              <TypographySpanXSmall className="text-muted-foreground">Feito {formatRelativeDate(workout.finishedAt)}</TypographySpanXSmall>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <TypographySpanXSmall className="text-muted-foreground">Duração</TypographySpanXSmall>
                <TypographySpan className="font-medium">{workout.duration}min</TypographySpan>
              </div>
              <div className="flex flex-col gap-2">
                <TypographySpanXSmall className="text-muted-foreground">Volume</TypographySpanXSmall>
                <TypographySpan className="font-medium">{workout.volume}kg</TypographySpan>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 border-t pt-4">

            <TypographyH5 className="font-medium">Exercícios</TypographyH5>

            {workout.exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}

          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={exercise.img} alt={exercise.name} />
          <AvatarFallback>{exercise.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <TypographySpan>{exercise.name}</TypographySpan>
        <CollapsibleTrigger>
          <Button
            variant="ghost"
            size="icon-sm"
          >
            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>

        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Série</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Peso</TableHead>
              <TableHead>Reps</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercise.sets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhuma série realizada para o exercício {exercise.name}
                </TableCell>
              </TableRow>
            ) : (
              exercise.sets.map((set, index) => (
                <TableRow key={`${exercise.id}-${index}`}
                  className="hover:bg-muted">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{set.type}</TableCell>
                  <TableCell>{set.weight}kg</TableCell>
                  <TableCell>{set.reps}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CollapsibleContent>
    </Collapsible>
  )
}