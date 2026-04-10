import PageTitle from "@/components/core/page-title";
import type { Exercise } from "@/components/exercise/schemas";
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

export default function TrainerExercisesPage() {
  const isLgScreen = useIsLgScreen();

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [searchKey, setSearchKey] = useState(0);

  const handleExerciseSelect = (exercise: Exercise) => {
    console.log("exercise", exercise);
    setSelectedExercise(exercise);
  };

  const onSuccess = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    // Trigger re-search by updating the searchKey
    setSearchKey((prev) => prev + 1);
  };

  return <SidebarProvider className="relative" sidebarWidth="24rem">
    <SidebarInset>
      <div className="space-y-6">
        <PageTitle title="Biblioteca de exercícios"
          description="Pesquise por exercícios existentes e crie seus próprios exercícios personalizados"
          actions={!isLgScreen && <CreateExerciseSheet trigger={<Button > <PlusIcon /> Novo exercício </Button>} onSuccess={onSuccess} />} />

        <div className="block lg:hidden space-y-2">
          <CreateExerciseSheet trigger={<Button className="w-full" variant="outline" size="sm"> <PlusIcon /> Novo exercício </Button>} />
          <ExerciseSidebarTrigger />
        </div>
        <div className="flex items-center justify-center flex-1 h-full">
          {selectedExercise ? <div className="w-full space-y-4">
            <div className="flex items-start justify-between">
              <TypographyH2 className="font-medium">{selectedExercise.name}</TypographyH2>
              {selectedExercise.ownerId && <EditExerciseSheet exercise={selectedExercise} onSuccess={onSuccess} />}
            </div>

            <Card>
              <CardContent className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex flex-col gap-1 w-full">
                  <TypographyH4 className="mb-2 font-medium">Sobre</TypographyH4>
                  <div className="flex items-center justify-start gap-2">
                    <TypographyH5>Categoria:</TypographyH5>
                    <TypographyP className="text-muted-foreground">{selectedExercise.category || "N/A"}</TypographyP>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <TypographyH5>Músculo primário:</TypographyH5>
                    <TypographyP className="text-muted-foreground">{selectedExercise.primaryMuscle || "N/A"}</TypographyP>
                  </div>
                  {selectedExercise.secondaryMuscle?.trim() ? (
                    <div className="flex items-start justify-between gap-2">
                      <TypographyH5 className="text-nowrap">Músculo secundário:</TypographyH5>
                      <TypographyP className="text-muted-foreground">{selectedExercise.secondaryMuscle}</TypographyP>
                    </div>
                  ) : null}
                  {selectedExercise.equipment?.trim() ? (
                    <div className="flex items-center justify-start gap-2">
                      <TypographyH5>Equipamento:</TypographyH5>
                      <TypographyP className="text-muted-foreground">{selectedExercise.equipment}</TypographyP>
                    </div>
                  ) : null}
                </div>
                <div className="flex justify-center items-center md:justify-end w-auto md:w-full">
                  {selectedExercise.imgSrc ? (
                    <ImageLoader
                      key={selectedExercise.imgSrc}
                      src={selectedExercise.imgSrc}
                      alt="Description of the image"
                      width={200}
                      height={200}
                    />
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {selectedExercise.howTo?.trim() ? (
              <Card>
                <CardContent>
                  <TypographyH4 className="mb-2 font-medium">Como fazer</TypographyH4>
                  {selectedExercise.howTo.split("|").map((step) => step.trim()).filter(Boolean).map((instruction, index) => (
                    <TypographyP key={`${instruction}-${index}`}>
                      {index + 1}. {instruction}
                    </TypographyP>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            <Card>
              <CardContent>
                <TypographyH4 className="mb-2 font-medium">Vídeo</TypographyH4>

                {selectedExercise.videoUrl ? <video
                  src={selectedExercise.videoUrl || ""}
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
                </video> : <TypographyP className="text-muted-foreground">Exercicio sem vídeo</TypographyP>}
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
    <ExerciseOverviewSidebar onExerciseSelect={handleExerciseSelect} searchKey={searchKey} />
  </SidebarProvider>
}