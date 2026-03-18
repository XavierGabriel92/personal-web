import ExerciseForm, { CreateExerciseButton } from "@/components/exercise/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { usePostApiExerciseByIdVideo, usePutApiExerciseById } from "@/gen";
import { useState } from "react";
import { toast } from "sonner";
import type { ExerciseFormData } from "../form";
import type { Exercise } from "../schemas";

interface EditExerciseSheetProps {
  exercise: Exercise;
  trigger?: React.ReactNode;
  onSuccess?: (exercise: Exercise) => void;
}

const defaultTrigger = (
  <Button variant="outline" size="sm">
    Editar exercício
  </Button>
);

export default function EditExerciseSheet({
  exercise,
  trigger = defaultTrigger,
  onSuccess,
}: EditExerciseSheetProps) {
  const [open, setOpen] = useState(false);

  const updateExerciseMutation = usePutApiExerciseById();
  const uploadVideoMutation = usePostApiExerciseByIdVideo();

  const isLoading = updateExerciseMutation.isPending || uploadVideoMutation.isPending;

  const handleSubmit = async (data: ExerciseFormData) => {
    try {
      // Determine if video was removed (had a value before, now undefined/null)
      const hadVideo = exercise.videoUrl !== null && exercise.videoUrl !== undefined;
      const hasVideoNow = data.video !== undefined && data.video !== null;
      const videoRemoved = hadVideo && !hasVideoNow;

      // Extract video from data before updating exercise
      const { video, ...exerciseData } = data;

      // Update the exercise
      let updatedExercise = await updateExerciseMutation.mutateAsync({
        id: exercise.id,
        data: {
          name: exerciseData.name,
          equipmentIds: exerciseData.equipmentIds ?? [],
          primaryMuscleId: exerciseData.primaryMuscleId,
          secondaryMuscleIds: exerciseData.secondaryMuscleIds ?? [],
          instructions: exerciseData.instructions ?? [],
          deleteMedia: videoRemoved,
        },
      });

      // If there's a new video file, upload it
      if (video instanceof File) {
        const formData = new FormData();
        formData.append("video", video);

        updatedExercise = await uploadVideoMutation.mutateAsync({
          id: exercise.id,
          data: formData as unknown as { video: Blob },
        });
      }

      toast.success(`Exercício ${data.name} atualizado com sucesso!`);
      onSuccess?.(updatedExercise);
      setOpen(false);
    } catch (error) {
      console.error("Error updating exercise:", error);
      toast.error("Erro ao atualizar exercício. Tente novamente.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Editar exercício</SheetTitle>
          <SheetDescription>
            Atualize os dados do exercício abaixo.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <ExerciseForm onSubmit={handleSubmit} initialValues={exercise} />
        </div>
        <SheetFooter>
          <CreateExerciseButton disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </CreateExerciseButton>
          <SheetClose asChild>
            <Button variant="outline" disabled={isLoading}>Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

