import PageTitle from "@/components/core/page-title";
import type { ProgramFormData, } from "@/components/program/form";
import ProgramForm from "@/components/program/form";
import AssignProgramSheet from "@/components/program/sheet/assign-program";
import ResumeProgramSidebar from "@/components/program/sidebar/resume-program";
import { ResumeProgramSidebarTrigger } from "@/components/program/sidebar/resume-program";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TypographyH3 } from "@/components/ui/typography";
import WorkoutListDraggable from "@/components/workout/list/draggable";
import CreateWorkoutSheet from "@/components/workout/sheet/create-workout";

interface TrainerProgramPageProps {
  programId: string;
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
      order: 0,
      exercises: [
        {
          id: "1",
          name: "Agachamento Livre",
          img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
          order: 0,
          sets: [
            {
              order: 0,
              type: "warm-up",
              reps: 10,
              weight: 20,
              restTime: 60,
            },
            {
              order: 1,
              type: "valid",
              reps: 12,
              weight: 40,
              restTime: 90,
            },
            {
              order: 2,
              type: "valid",
              reps: 10,
              weight: 40,
              restTime: 90,
            },
            {
              order: 3,
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
          order: 1,
          sets: [
            {
              order: 0,
              type: "warm-up",
              reps: 10,
              weight: 20,
              restTime: 60,
            },
            {
              order: 1,
              type: "valid",
              reps: 10,
              weight: 30,
              restTime: 90,
            },
            {
              order: 2,
              type: "valid",
              reps: 8,
              weight: 30,
              restTime: 90,
            },
            {
              order: 3,
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
          order: 2,
          sets: [
            {
              order: 0,
              type: "warm-up",
              reps: 15,
              weight: 15,
              restTime: 60,
            },
            {
              order: 1,
              type: "valid",
              reps: 12,
              weight: 25,
              restTime: 90,
            },
            {
              order: 2,
              type: "valid",
              reps: 10,
              weight: 25,
              restTime: 90,
            },
            {
              order: 3,
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
      order: 1,
      exercises: [
        {
          id: "1",
          name: "Leg Press",
          img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
          order: 0,
          sets: [
            {
              order: 0,
              type: "warm-up",
              reps: 12,
              weight: 50,
              restTime: 60,
            },
            {
              order: 1,
              type: "valid",
              reps: 15,
              weight: 80,
              restTime: 90,
            },
            {
              order: 2,
              type: "valid",
              reps: 12,
              weight: 80,
              restTime: 90,
            },
            {
              order: 3,
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
          order: 1,
          sets: [
            {
              order: 0,
              type: "warm-up",
              reps: 10,
              weight: 8,
              restTime: 60,
            },
            {
              order: 1,
              type: "valid",
              reps: 12,
              weight: 12,
              restTime: 90,
            },
            {
              order: 2,
              type: "valid",
              reps: 10,
              weight: 12,
              restTime: 90,
            },
            {
              order: 3,
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
          order: 2,
          sets: [
            {
              order: 0,
              type: "warm-up",
              reps: 10,
              weight: 20,
              restTime: 60,
            },
            {
              order: 1,
              type: "valid",
              reps: 12,
              weight: 35,
              restTime: 90,
            },
            {
              order: 2,
              type: "valid",
              reps: 10,
              weight: 35,
              restTime: 90,
            },
            {
              order: 3,
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
      order: 2,
      exercises: [
        {
          id: "1",
          name: "Stiff com Halteres",
          img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
          order: 0,
          sets: [
            {
              order: 0,
              type: "warm-up",
              reps: 10,
              weight: 15,
              restTime: 60,
            },
            {
              order: 1,
              type: "valid",
              reps: 12,
              weight: 25,
              restTime: 90,
            },
            {
              order: 2,
              type: "valid",
              reps: 10,
              weight: 25,
              restTime: 90,
            },
            {
              order: 3,
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
          order: 1,
          sets: [
            {
              order: 0,
              type: "warm-up",
              reps: 10,
              weight: 12,
              restTime: 60,
            },
            {
              order: 1,
              type: "valid",
              reps: 12,
              weight: 20,
              restTime: 90,
            },
            {
              order: 2,
              type: "valid",
              reps: 10,
              weight: 20,
              restTime: 90,
            },
            {
              order: 3,
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
          order: 2,
          sets: [
            {
              order: 0,
              type: "warm-up",
              reps: 10,
              weight: 8,
              restTime: 60,
            },
            {
              order: 1,
              type: "valid",
              reps: 12,
              weight: 12,
              restTime: 60,
            },
            {
              order: 2,
              type: "valid",
              reps: 10,
              weight: 12,
              restTime: 60,
            },
            {
              order: 3,
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
      order: 3,
      exercises: [
        {
          id: "1",
          name: "Supino Reto com Barra",
          img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
          order: 0,
          sets: [
            {
              order: 0,
              type: "warm-up",
              reps: 10,
              weight: 20,
              restTime: 60,
            },
            {
              order: 1,
              reps: 10,
              weight: 35,
              restTime: 60,
            },
          ],
        },
        {
          id: "2",
          name: "Remada Curvada",
          img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
          order: 1,
          sets: [
            {
              order: 0,
              type: "warm-up",
              reps: 0,
              weight: 15,
              restTime: 60,
            },
            {
              order: 1,
              type: "valid",
              reps: 12,
              weight: 30,
              restTime: 90,
            },
            {
              order: 2,
              type: "valid",
              reps: 10,
              weight: 30,
              restTime: 90,
            },
            {
              order: 3,
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
          order: 2,
          sets: [
            {
              order: 0,
              type: "warm-up",
              reps: 10,
              weight: 8,
              restTime: 60,
            },
            {
              order: 1,
              type: "valid",
              reps: 12,
              weight: 14,
              restTime: 90,
            },
            {
              order: 2,
              type: "valid",
              reps: 10,
              weight: 14,
              restTime: 90,
            },
            {
              order: 3,
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

export default function TrainerProgramPage({ programId }: TrainerProgramPageProps) {
  const data = mockProgram;

  const onSubmit = (data: ProgramFormData) => {
    console.log(data);
  };

  return (
    <SidebarProvider className="relative" sidebarWidth="20rem">
      <SidebarInset>
        <PageTitle title="Editar programa"
          description="Gerencie o programa e veja estatísticas dos treinos"
          actions={
            !data.startDate && <AssignProgramSheet programId={data.id} />
          } />

        <div className="space-y-8 pb-6">
          <ProgramForm onSubmit={onSubmit} initialValues={data} />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2 items-center">
                <TypographyH3 className="font-medium">Treinos  </TypographyH3>
                <Badge variant="secondary">{data.workouts.length}</Badge>
              </div>
              <CreateWorkoutSheet />
            </div>
            <WorkoutListDraggable workouts={data.workouts} />
          </div>
        </div>
      </SidebarInset>
      <ResumeProgramSidebar workouts={data.workouts} />
      <ResumeProgramSidebarTrigger className="top-[-25px] right-[-25px] md:right-[-40px]" />
    </SidebarProvider>
  );
}