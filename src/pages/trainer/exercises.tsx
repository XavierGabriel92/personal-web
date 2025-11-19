import PageTitle from "@/components/core/page-title";
import CreateExerciseSheet from "@/components/exercise/sheet/create-exercise";
import EditExerciseSheet from "@/components/exercise/sheet/edit-exercise";
import ExerciseOverviewSidebar, { ExerciseSidebarTrigger } from "@/components/exercise/sidebar/exercise-overview";
import { ImageLoader } from "@/components/image-loader"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TypographyH2, TypographyH4, TypographyH5, TypographyP } from "@/components/ui/typography";
import { useIsLgScreen } from "@/hooks/use-mobile";
import { DumbbellIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

type Exercise = {
  id: string;
  name: string;
  img?: string;
  type: string;
  primaryMuscle: string;
  otherMuscles?: string[];
  instructions?: string[];
  video?: string;
};

const mockExercises = [
  {
    id: "1",
    img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
    name: "Agachamento Livre",
    type: "strength",
    primaryMuscle: "quadriceps",
    otherMuscles: ["glutes", "hamstrings"],
    instructions: [
      "Fique em pé com os pés afastados na largura dos ombros",
      "Mantenha as costas retas e o peito erguido",
      "Desça como se fosse sentar em uma cadeira",
      "Volte à posição inicial",
    ],
    video: "https://minio-storage.homug.com.br/exercises/videos/dumbbell-bicep-curl.mp4",
  },
  {
    id: "2",
    thumbnail: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
    img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
    name: "Supino Reto com Barra",
    type: "strength",
    primaryMuscle: "chest",
    otherMuscles: ["triceps", "shoulders"],
    instructions: [
      "Deite-se no banco com os pés apoiados no chão",
      "Segure a barra com as mãos afastadas na largura dos ombros",
      "Desça a barra até o peito com controle",
      "Empurre a barra para cima até estender os braços",
    ],
    video: "https://minio-storage.homug.com.br/exercises/videos/dumbbell-bicep-curl.mp4",
  },
  {
    id: "3",
    thumbnail: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
    img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
    name: "Remada Curvada",
    type: "strength",
    primaryMuscle: "back",
    otherMuscles: ["biceps", "traps"],
    instructions: [
      "Fique em pé com os pés afastados na largura dos ombros",
      "Incline o tronco para frente mantendo as costas retas",
      "Puxe a barra em direção ao peito",
      "Volte à posição inicial com controle",
    ],
    video: "https://minio-storage.homug.com.br/exercises/videos/dumbbell-bicep-curl.mp4",
  },
  {
    id: "4",
    thumbnail: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
    img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
    name: "Leg Press",
    type: "strength",
    primaryMuscle: "quadriceps",
    otherMuscles: ["glutes", "calves"],
    instructions: [
      "Sente-se no aparelho com as costas apoiadas",
      "Coloque os pés na plataforma na largura dos ombros",
      "Empurre a plataforma até estender as pernas",
      "Volte à posição inicial com controle",
    ],
    video: "https://minio-storage.homug.com.br/exercises/videos/dumbbell-bicep-curl.mp4",
  },
  {
    id: "5",
    thumbnail: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
    img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
    name: "Desenvolvimento com Halteres",
    type: "strength",
    primaryMuscle: "shoulders",
    otherMuscles: ["triceps"],
    instructions: [
      "Sente-se em um banco com as costas apoiadas",
      "Segure os halteres na altura dos ombros",
      "Empurre os halteres para cima até estender os braços",
      "Volte à posição inicial com controle",
    ],
    video: "https://minio-storage.homug.com.br/exercises/videos/dumbbell-bicep-curl.mp4",
  },
  {
    id: "6",
    thumbnail: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
    img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
    name: "Puxada Frontal",
    type: "strength",
    primaryMuscle: "back",
    otherMuscles: ["biceps"],
    instructions: [
      "Sente-se no aparelho com as pernas fixadas",
      "Segure a barra com as mãos afastadas",
      "Puxe a barra em direção ao peito",
      "Volte à posição inicial com controle",
    ],
    video: "https://minio-storage.homug.com.br/exercises/videos/dumbbell-bicep-curl.mp4",
  },
  {
    id: "7",
    thumbnail: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
    img: "https://minio-storage.homug.com.br/exercises/imgs/dumbbell-bicep-curl.jpg",
    name: "Stiff com Halteres",
    type: "strength",
    primaryMuscle: "hamstrings",
    otherMuscles: ["glutes"],
    instructions: [
      "Fique em pé segurando halteres nas mãos",
      "Mantenha as pernas levemente flexionadas",
      "Incline o tronco para frente mantendo as costas retas",
      "Volte à posição inicial contraindo os posteriores",
    ],
    video: "https://minio-storage.homug.com.br/exercises/videos/dumbbell-bicep-curl.mp4",
  },
  {
    id: "8",
    thumbnail: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
    img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
    name: "Supino Inclinado com Halteres",
    type: "strength",
    primaryMuscle: "chest",
    otherMuscles: ["shoulders", "triceps"],
    instructions: [
      "Deite-se no banco inclinado",
      "Segure os halteres na altura do peito",
      "Empurre os halteres para cima até estender os braços",
      "Volte à posição inicial com controle",
    ],
    video: "https://minio-storage.homug.com.br/exercises/videos/dumbbell-bicep-curl.mp4",
  },
  {
    id: "9",
    thumbnail: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
    img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
    name: "Rosca Direta com Halteres",
    type: "strength",
    primaryMuscle: "biceps",
    otherMuscles: ["forearms"],
    instructions: [
      "Fique em pé segurando halteres nas mãos",
      "Mantenha os cotovelos fixos ao lado do corpo",
      "Flexione os braços levantando os halteres",
      "Volte à posição inicial com controle",
    ],
    video: "https://minio-storage.homug.com.br/exercises/videos/dumbbell-bicep-curl.mp4",
  },
  {
    id: "10",
    thumbnail: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
    img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
    name: "Rosca com Barra W",
    type: "strength",
    primaryMuscle: "biceps",
    otherMuscles: ["forearms"],
    instructions: [
      "Fique em pé segurando a barra W",
      "Mantenha os cotovelos fixos ao lado do corpo",
      "Flexione os braços levantando a barra",
      "Volte à posição inicial com controle",
    ],
    video: "https://minio-storage.homug.com.br/exercises/videos/dumbbell-bicep-curl.mp4",
  },
  {
    id: "11",
    thumbnail: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
    img: "https://minio-storage.homug.com.br/exercises/imgs/ez-bar-curl.jpg",
    name: "Rosca com Barra W",
    type: "strength",
    primaryMuscle: "biceps",
    otherMuscles: ["forearms"],
    instructions: [
      "Fique em pé segurando a barra W",
      "Mantenha os cotovelos fixos ao lado do corpo",
      "Flexione os braços levantando a barra",
      "Volte à posição inicial com controle",
    ],
    video: "https://minio-storage.homug.com.br/exercises/videos/dumbbell-bicep-curl.mp4",
  },
  {
    id: "12",
    thumbnail: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
    img: "https://minio-storage.homug.com.br/exercises/imgs/preacher-curl.jpg",
    name: "Rosca no Banco Scott",
    type: "strength",
    primaryMuscle: "biceps",
    otherMuscles: [],
    instructions: [
      "Sente-se no banco Scott",
      "Apoie o braço no suporte inclinado",
      "Flexione o braço levantando o halter",
      "Volte à posição inicial com controle",
    ],
    video: "https://minio-storage.homug.com.br/exercises/videos/dumbbell-bicep-curl.mp4",
  },
];

export default function TrainerExercisesPage() {
  const isLgScreen = useIsLgScreen();

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };


  return <SidebarProvider className="relative" sidebarWidth="24rem">
    <SidebarInset>
      <div className="space-y-6">
        <PageTitle title="Biblioteca de exercícios"
          description="Pesquise por exercícios existentes e crie seus próprios exercícios personalizados"
          actions={!isLgScreen && <CreateExerciseSheet trigger={<Button > <PlusIcon /> Novo exercício </Button>} />} />

        <div className="block lg:hidden space-y-2">
          <CreateExerciseSheet trigger={<Button className="w-full" variant="outline" size="sm"> <PlusIcon /> Novo exercício </Button>} />
          <ExerciseSidebarTrigger />
        </div>
        <div className="flex items-center justify-center flex-1 h-full">
          {selectedExercise ? <div className="w-full space-y-4">
            <div className="flex items-start justify-between">
              <TypographyH2 className="font-medium">{selectedExercise.name}</TypographyH2>
              <EditExerciseSheet exercise={selectedExercise as Exercise} />
            </div>

            <Card>
              <CardContent className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex flex-col gap-1 w-full">
                  <TypographyH4 className="mb-2 font-medium">Sobre</TypographyH4>

                  <div className="flex items-center justify-start gap-2">
                    <TypographyH5>Tipo:</TypographyH5>
                    <TypographyP className="text-muted-foreground">{selectedExercise.type}</TypographyP>
                  </div><div className="flex items-center justify-start gap-2">
                    <TypographyH5>Equipamento:</TypographyH5>
                    <TypographyP className="text-muted-foreground">Dumbbell</TypographyP>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <TypographyH5>Musculatura Primária:</TypographyH5>
                    <TypographyP className="text-muted-foreground">{selectedExercise.primaryMuscle}</TypographyP>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <TypographyH5 className="text-nowrap">Musculatura Secundária:</TypographyH5>
                    <TypographyP className="text-muted-foreground">{selectedExercise.otherMuscles?.join(", ")}</TypographyP>
                  </div>
                </div>
                <div className="flex justify-center items-center md:justify-end w-auto md:w-full">
                  <ImageLoader
                    src={selectedExercise.img || ""}
                    alt="Description of the image"
                    width={200}
                    height={200}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <TypographyH4 className="mb-2 font-medium">Instruções</TypographyH4>

                {selectedExercise.instructions?.map((instruction, index) => (
                  <TypographyP key={instruction}>{index + 1}. {instruction}</TypographyP>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <TypographyH4 className="mb-2 font-medium">Vídeo</TypographyH4>

                <video
                  src={selectedExercise.video || ""}
                  controls
                  className="w-full h-full max-h-full max-w-full rounded object-contain"

                  style={{
                    aspectRatio: "1 / .5",
                    objectFit: "cover",
                    maxHeight: "400px",
                    maxWidth: "100%",
                  }}
                >
                  <track kind="captions" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </CardContent>
            </Card>


          </div> :
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <DumbbellIcon />
                </EmptyMedia>
                <EmptyTitle>Nenhum exercício selecionado</EmptyTitle>
                <EmptyDescription>Selecione um exercício para ver mais detalhes</EmptyDescription>
              </EmptyHeader>
            </Empty>}
        </div>
      </div>
    </SidebarInset>
    <ExerciseOverviewSidebar exercises={mockExercises} onExerciseSelect={handleExerciseSelect} />
  </SidebarProvider>
}