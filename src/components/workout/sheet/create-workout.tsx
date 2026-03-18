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
import WorkoutForm, { CreateWorkoutButton } from "@/components/workout/form";
import type { WorkoutFormData } from "@/components/workout/form";
import { getApiRoutineByIdSuspenseQueryKey } from "@/gen/hooks/useGetApiRoutineByIdSuspense";
import { usePostApiWorkoutCreate } from "@/gen/hooks/usePostApiWorkoutCreate";
import { queryClient } from "@/routes/__root";
import { useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateWorkoutSheetProps {
  routineId: string;
  workoutsCount?: number;
}
export default function CreateWorkoutSheet({ routineId, workoutsCount = 0 }: CreateWorkoutSheetProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { mutateAsync: createWorkout, isPending } = usePostApiWorkoutCreate();

  const handleSubmit = (data: WorkoutFormData) => {
    createWorkout({
      data: {
        name: data.name,
        description: data.description || undefined,
        routineId: routineId,
        order: workoutsCount,
      },
    }, {
      onSuccess: async (workout) => {
        toast.success(`Treino ${workout.name} criado com sucesso!`);
        navigate({ to: "/trainer/workouts/$workoutId", params: { workoutId: workout.id } });
        await queryClient.invalidateQueries({
          queryKey: getApiRoutineByIdSuspenseQueryKey(routineId),
        });

      },
      onError: () => {
        toast.error("Erro ao criar treino. Tente novamente.");
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Novo treino
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Criar novo treino</SheetTitle>
          <SheetDescription>
            Preencha os dados abaixo para criar um novo treino.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <WorkoutForm onSubmit={handleSubmit} />
        </div>
        <SheetFooter>
          <CreateWorkoutButton disabled={isPending}>
            {isPending ? <><Spinner /> Criando treino... </> : "Criar Treino"}
          </CreateWorkoutButton>
          <SheetClose asChild>
            <Button variant="outline" disabled={isPending}>Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

