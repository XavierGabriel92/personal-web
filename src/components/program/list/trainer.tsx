import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/ui/input";
import { TypographySpan } from "@/components/ui/typography";
import { useNavigate } from "@tanstack/react-router";
import { Copy, MoreVertical, Pencil, Trash, UserCheck } from "lucide-react";
import { useState } from "react";
import AssignProgramSheet from "../sheet/assign-program";
import CreateProgramSheet from "../sheet/create-program";

const mockPrograms = [
  {
    "id": "18761fea-f6ec-4e2b-ac3f-939eadf065f0",
    "title": "Treino 4x na semana",
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
  },
  {
    "id": "a8b9c0d1-e2f3-4a5b-6c7d-8e9f0a1b2c3d",
    "title": "Programa Push/Pull/Legs",
    "notes": "This is a 6-day push/pull/legs split program. Train 6 days a week with one rest day. Focus on progressive overload.",
    "startDate": "2025-12-01",
    "createdAt": "2025-07-15",
    "duration": 0,
    workouts: [
      {
        id: "1",
        name: "Push Day A",
        exercises: [
          {
            id: "1",
            name: "Supino Reto com Barra",
            img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
            sets: [
              {
                type: "warm-up",
                reps: 10,
                weight: 30,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 8,
                weight: 50,
                restTime: 120,
              },
              {
                type: "valid",
                reps: 6,
                weight: 50,
                restTime: 120,
              },
              {
                type: "valid",
                reps: 5,
                weight: 50,
                restTime: 120,
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
                weight: 10,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 10,
                weight: 18,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 8,
                weight: 18,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 6,
                weight: 18,
                restTime: 90,
              },
            ],
          },
          {
            id: "3",
            name: "Tríceps Pulley",
            img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
            sets: [
              {
                type: "warm-up",
                reps: 12,
                weight: 15,
                restTime: 45,
              },
              {
                type: "valid",
                reps: 12,
                weight: 25,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 10,
                weight: 25,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 8,
                weight: 25,
                restTime: 60,
              },
            ],
          },
        ],
      },
      {
        id: "2",
        name: "Pull Day A",
        exercises: [
          {
            id: "1",
            name: "Barra Fixa",
            img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
            sets: [
              {
                type: "warm-up",
                reps: 5,
                weight: 0,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 8,
                weight: 0,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 6,
                weight: 0,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 5,
                weight: 0,
                restTime: 90,
              },
            ],
          },
          {
            id: "2",
            name: "Remada Curvada com Barra",
            img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
            sets: [
              {
                type: "warm-up",
                reps: 10,
                weight: 25,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 10,
                weight: 45,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 8,
                weight: 45,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 6,
                weight: 45,
                restTime: 90,
              },
            ],
          },
          {
            id: "3",
            name: "Rosca Direta com Barra",
            img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
            sets: [
              {
                type: "warm-up",
                reps: 12,
                weight: 10,
                restTime: 45,
              },
              {
                type: "valid",
                reps: 10,
                weight: 20,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 8,
                weight: 20,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 6,
                weight: 20,
                restTime: 60,
              },
            ],
          },
        ],
      },
      {
        id: "3",
        name: "Leg Day A",
        exercises: [
          {
            id: "1",
            name: "Agachamento Livre",
            img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
            sets: [
              {
                type: "warm-up",
                reps: 10,
                weight: 30,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 10,
                weight: 60,
                restTime: 120,
              },
              {
                type: "valid",
                reps: 8,
                weight: 60,
                restTime: 120,
              },
              {
                type: "valid",
                reps: 6,
                weight: 60,
                restTime: 120,
              },
            ],
          },
          {
            id: "2",
            name: "Leg Press",
            img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
            sets: [
              {
                type: "warm-up",
                reps: 15,
                weight: 60,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 12,
                weight: 100,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 10,
                weight: 100,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 8,
                weight: 100,
                restTime: 90,
              },
            ],
          },
          {
            id: "3",
            name: "Extensão de Pernas",
            img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
            sets: [
              {
                type: "warm-up",
                reps: 12,
                weight: 20,
                restTime: 45,
              },
              {
                type: "valid",
                reps: 12,
                weight: 40,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 10,
                weight: 40,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 8,
                weight: 40,
                restTime: 60,
              },
            ],
          },
        ],
      },
      {
        id: "4",
        name: "Push Day B",
        exercises: [
          {
            id: "1",
            name: "Supino Inclinado com Halteres",
            img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
            sets: [
              {
                type: "warm-up",
                reps: 10,
                weight: 12,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 10,
                weight: 24,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 8,
                weight: 24,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 6,
                weight: 24,
                restTime: 90,
              },
            ],
          },
          {
            id: "2",
            name: "Elevação Lateral",
            img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
            sets: [
              {
                type: "warm-up",
                reps: 12,
                weight: 5,
                restTime: 45,
              },
              {
                type: "valid",
                reps: 12,
                weight: 10,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 10,
                weight: 10,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 8,
                weight: 10,
                restTime: 60,
              },
            ],
          },
          {
            id: "3",
            name: "Tríceps Testa",
            img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
            sets: [
              {
                type: "warm-up",
                reps: 10,
                weight: 15,
                restTime: 45,
              },
              {
                type: "valid",
                reps: 10,
                weight: 25,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 8,
                weight: 25,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 6,
                weight: 25,
                restTime: 60,
              },
            ],
          },
        ],
      },
      {
        id: "5",
        name: "Pull Day B",
        exercises: [
          {
            id: "1",
            name: "Puxada Frontal",
            img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
            sets: [
              {
                type: "warm-up",
                reps: 10,
                weight: 25,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 10,
                weight: 45,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 8,
                weight: 45,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 6,
                weight: 45,
                restTime: 90,
              },
            ],
          },
          {
            id: "2",
            name: "Remada Unilateral",
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
                reps: 10,
                weight: 28,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 8,
                weight: 28,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 6,
                weight: 28,
                restTime: 90,
              },
            ],
          },
          {
            id: "3",
            name: "Rosca Martelo",
            img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
            sets: [
              {
                type: "warm-up",
                reps: 12,
                weight: 8,
                restTime: 45,
              },
              {
                type: "valid",
                reps: 10,
                weight: 14,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 8,
                weight: 14,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 6,
                weight: 14,
                restTime: 60,
              },
            ],
          },
        ],
      },
      {
        id: "6",
        name: "Leg Day B",
        exercises: [
          {
            id: "1",
            name: "Stiff com Barra",
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
                weight: 40,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 8,
                weight: 40,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 6,
                weight: 40,
                restTime: 90,
              },
            ],
          },
          {
            id: "2",
            name: "Agachamento Búlgaro",
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
                reps: 10,
                weight: 16,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 8,
                weight: 16,
                restTime: 90,
              },
              {
                type: "valid",
                reps: 6,
                weight: 16,
                restTime: 90,
              },
            ],
          },
          {
            id: "3",
            name: "Cadeira Flexora",
            img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
            sets: [
              {
                type: "warm-up",
                reps: 12,
                weight: 20,
                restTime: 45,
              },
              {
                type: "valid",
                reps: 12,
                weight: 35,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 10,
                weight: 35,
                restTime: 60,
              },
              {
                type: "valid",
                reps: 8,
                weight: 35,
                restTime: 60,
              },
            ],
          },
        ],
      },
    ]
  }
]

interface Program {
  id: string;
  title: string;
  notes: string;
  startDate: string;
  createdAt: string;
  duration: number;
  workouts: Workout[];
}

interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}

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

export default function TrainerProgramList() {
  const [search, setSearch] = useState("");
  const data = mockPrograms;
  return <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <SearchInput
        placeholder="Pesquisar programa"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <CreateProgramSheet />
    </div>

    <div className="flex flex-col gap-4">
      {data.filter((program) => program.title.toLowerCase().includes(search.toLowerCase())).map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  </div>
}


function ProgramCard({ program }: { program: Program }) {
  return <Card className="gap-0">
    <CardHeader>
      <CardTitle>{program.title}</CardTitle>
      <CardAction className="flex items-center gap-2">
        {program.duration > 0 && (
          <TypographySpan className="text-muted-foreground">Duração: {program.duration} semanas</TypographySpan>
        )}
        <ProgramActions program={program} />
      </CardAction>
    </CardHeader>
    <CardContent className="space-x-2 space-y-2">
      {program.workouts.map((workout) => (
        <Badge key={workout.id} variant="secondary" >{workout.name}</Badge>
      ))}
    </CardContent>

  </Card>
}

function DeleteProgramDialog({
  program,
  open,
  onOpenChange,
  onConfirm,
}: {
  program: Program;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar programa</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar o programa "{program.title}"? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ProgramActions({ program }: { program: Program }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate({ to: "/trainer/programs/$programId", params: { programId: program.id } });
  };

  const handleDelete = () => {
    console.log("Deleting program:", program.id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar programa
          </DropdownMenuItem>
          <AssignProgramSheet programId={program.id} trigger={<DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}>
            <UserCheck className="mr-2 h-4 w-4" />
            Atribuir programa
          </DropdownMenuItem>} />

          <DropdownMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            Copiar o programa
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault();
              setDeleteDialogOpen(true);
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Deletar o programa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteProgramDialog
        program={program}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}