import PageTitle from "@/components/core/page-title";
import ExerciseListDraggable from "@/components/exercise/list/draggable";
import ExerciseSidebar, { ExerciseSidebarTrigger } from "@/components/exercise/sidebar/exercise-workout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import WorkoutForm, { type WorkoutFormData } from "@/components/workout/form";

interface TrainerWorkoutPageProps {
  workoutId: string;
}

const mockExercises = [
  {
    id: "1",
    name: "Agachamento Livre",
    img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
  },
  {
    id: "2",
    name: "Supino Reto com Barra",
    img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
  },
  {
    id: "3",
    name: "Remada Curvada",
    img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
  },
  {
    id: "4",
    name: "Leg Press",
    img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
  },
  {
    id: "5",
    name: "Desenvolvimento com Halteres",
    img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
  },
  {
    id: "6",
    name: "Puxada Frontal",
    img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
  },
  {
    id: "7",
    name: "Stiff com Halteres",
    img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
  },
  {
    id: "8",
    name: "Supino Inclinado com Halteres",
    img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
  },
  {
    id: "9",
    name: "Rosca Direta com Halteres",
    img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
  },
  {
    id: "10",
    name: "Rosca com Barra W",
    img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
  },
  {
    id: "11",
    name: "Rosca com Barra W",
    img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
  },
  {
    id: "12",
    name: "Rosca no Banco Scott",
    img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
  },
];

const mockWorkout = {
  id: "1",
  name: "Full Body A",
  description: "This is a full body workout. You should do it 3 times a week and rest between days.",
  order: 1,
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
  ],
}

export default function TrainerWorkoutPage({ workoutId: _workoutId }: TrainerWorkoutPageProps) {
  const data = mockWorkout;

  const onSubmit = (data: WorkoutFormData) => {
    console.log(data);
  };

  const handleExerciseSelect = (exercise: { id: string; name: string; img: string }) => {
    console.log("Exercise selected:", exercise);
    // TODO: Add exercise to workout
  };

  return (
    <SidebarProvider className="relative" sidebarWidth="24rem">
      <SidebarInset>
        <div className="space-y-6">
          <PageTitle title="Editar treino" actions={<ExerciseSidebarTrigger />} />
          <WorkoutForm onSubmit={onSubmit} initialValues={data} />
          <ExerciseListDraggable workoutId={data.id} exercises={data.exercises} />
        </div>
      </SidebarInset>
      <ExerciseSidebar exercises={mockExercises} onExerciseSelect={handleExerciseSelect} />
    </SidebarProvider>
  );
}