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
import {
  usePostApiExerciseByIdVideo,
  usePostApiExerciseCreate,
} from "@/gen";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ExerciseFormData } from "../form";
import type { Exercise } from "../schemas";

interface CreateExerciseSheetProps {
  trigger?: React.ReactNode;
  onSuccess?: (exercise: Exercise) => void;
}

const defaultTrigger = <Button variant="ghost" className="justify-start text-primary hover:text-primary">
  <PlusIcon />
  Novo exercício
</Button>


export default function CreateExerciseSheet({ trigger = defaultTrigger, onSuccess }: CreateExerciseSheetProps) {
  const [open, setOpen] = useState(false);

  const createExerciseMutation = usePostApiExerciseCreate();
  const uploadVideoMutation = usePostApiExerciseByIdVideo();

  const isLoading = createExerciseMutation.isPending || uploadVideoMutation.isPending;

  const handleSubmit = async (data: ExerciseFormData) => {
    try {
      // Extract video from data before creating exercise
      const { video, ...exerciseData } = data;

      // Create the exercise first
      let createdExercise = await createExerciseMutation.mutateAsync({
        data: {
          name: exerciseData.name,
          equipmentIds: exerciseData.equipmentIds,
          primaryMuscleId: exerciseData.primaryMuscleId,
          secondaryMuscleIds: exerciseData.secondaryMuscleIds ?? [],
          instructions: exerciseData.instructions ?? [],
        },
      });

      // If there's a video, upload it
      if (video instanceof File) {
        // Create FormData for multipart/form-data request
        const formData = new FormData();
        formData.append("video", video);

        // Pass FormData directly - axios will handle multipart/form-data
        createdExercise = await uploadVideoMutation.mutateAsync({
          id: createdExercise.id,
          data: formData as unknown as { video: Blob },
        });
      }

      onSuccess?.(createdExercise);

      toast.success(`Exercício ${data.name} criado com sucesso!`);
      setOpen(false);
    } catch (error) {
      console.error("Error creating exercise:", error);
      toast.error("Erro ao criar exercício. Tente novamente.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Criar novo exercício</SheetTitle>
          <SheetDescription>
            Preencha os dados abaixo para criar um novo exercício.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <ExerciseForm onSubmit={handleSubmit} />
        </div>
        <SheetFooter>
          <CreateExerciseButton disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Criando exercício...
              </>
            ) : (
              "Criar exercício"
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

