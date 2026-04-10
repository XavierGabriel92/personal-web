import PageTitle from "@/components/core/page-title";
import { Button } from "@/components/ui/button";
import type { ExerciseFormData } from "@/components/exercise/collapsible/exercise";
import type { Exercise } from "@/components/exercise/schemas";
import ExerciseListDraggable from "@/components/exercise/list/draggable";
import ExerciseSidebar, { ExerciseSidebarTrigger } from "@/components/exercise/sidebar/exercise-workout";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TypographyH3 } from "@/components/ui/typography";
import WorkoutForm, { type WorkoutFormData } from "@/components/workout/form";
import { useDeleteApiWorkoutExerciseByExerciseWorkoutId } from "@/gen/hooks/useDeleteApiWorkoutExerciseByExerciseWorkoutId";
import { getApiWorkoutByIdSuspenseQueryKey } from "@/gen/hooks/useGetApiWorkoutByIdSuspense";
import { useGetApiWorkoutByIdSuspense } from "@/gen/hooks/useGetApiWorkoutByIdSuspense";
import { usePostApiWorkoutByIdExercise } from "@/gen/hooks/usePostApiWorkoutByIdExercise";
import { usePutApiWorkoutById } from "@/gen/hooks/usePutApiWorkoutById";
import { usePutApiWorkoutExerciseByExerciseWorkoutId } from "@/gen/hooks/usePutApiWorkoutExerciseByExerciseWorkoutId";
import { usePutApiWorkoutExerciseReorder } from "@/gen/hooks/usePutApiWorkoutExerciseReorder";
import { queryClient } from "@/routes/__root";
import type { WorkoutExercise } from "@/schemas";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeftIcon, DumbbellIcon } from "lucide-react";
import { toast } from "sonner";

interface TrainerWorkoutPageProps {
  workoutId: string;
}

export default function TrainerWorkoutPage({ workoutId }: TrainerWorkoutPageProps) {
  const router = useRouter();
  const { data: workoutData } = useGetApiWorkoutByIdSuspense(workoutId);
  const { mutateAsync: addExerciseToWorkout, isPending: isAddingExercise } = usePostApiWorkoutByIdExercise();
  const { mutateAsync: updateWorkout, isPending: isUpdatingWorkout } = usePutApiWorkoutById();
  const { mutateAsync: deleteExerciseFromWorkout, isPending: isDeletingExercise } = useDeleteApiWorkoutExerciseByExerciseWorkoutId();
  const { mutateAsync: reorderExercises, isPending: isReorderingExercises } = usePutApiWorkoutExerciseReorder();
  const { mutateAsync: updateExerciseWorkout, isPending: isUpdatingExercise } = usePutApiWorkoutExerciseByExerciseWorkoutId();

  // Map API response to form format
  const formData: WorkoutFormData = {
    name: workoutData.name,
    description: workoutData.description || "",
  };

  const onFormChange = (formData: WorkoutFormData) => {
    const queryKey = getApiWorkoutByIdSuspenseQueryKey(workoutId);

    updateWorkout(
      {
        id: workoutId,
        data: {
          name: formData.name,
          description: formData.description || undefined,
        },
      },
      {
        onSuccess: (updatedData) => {
          queryClient.setQueryData(queryKey, updatedData);
          toast.success(`Treino ${updatedData.name} atualizado com sucesso!`);
        },
        onError: () => {
          toast.error("Erro ao atualizar treino. Tente novamente.");
        },
      }
    );
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    const currentExercisesCount = workoutData.exercises?.length || 0;
    const queryKey = getApiWorkoutByIdSuspenseQueryKey(workoutId);
    const tempId = `temp-${Date.now()}-${exercise.id}`;

    // Create optimistic exercise update
    const optimisticExercise: WorkoutExercise = {
      id: tempId,
      order: currentExercisesCount,
      sets: [],
      exerciseData: {
        id: exercise.id,
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        category: exercise.category,
        imgSrc: exercise.imgSrc,
        equipment: exercise.equipment,
        primaryMuscle: exercise.primaryMuscle,
        secondaryMuscle: exercise.secondaryMuscle,
        howTo: exercise.howTo,
        videoUrl: exercise.videoUrl,
        ownerId: exercise.ownerId,
      },
    };

    // Optimistically update the cache
    queryClient.setQueryData(queryKey, (old: typeof workoutData) => {
      if (!old) return old;
      return {
        ...old,
        exercises: [...(old.exercises || []), optimisticExercise],
      };
    });

    addExerciseToWorkout(
      {
        id: workoutId,
        data: {
          exerciseId: exercise.id,
          order: currentExercisesCount,
          sets: [],
        },
      },
      {
        onSuccess: (response) => {
          // Replace optimistic update with real data from API response
          queryClient.setQueryData(queryKey, (old: typeof workoutData) => {
            if (!old) return old;
            const hasTempId = old.exercises?.some((e) => e.id === tempId);
            if (hasTempId) {
              return {
                ...old,
                exercises: old.exercises?.map((e) => (e.id === tempId ? (response as WorkoutExercise) : e)) || [],
              };
            }
            return {
              ...old,
              exercises: [...(old.exercises || []), response as WorkoutExercise],
            };
          });
          toast.success(`Exercício ${exercise.name} adicionado ao treino com sucesso!`);
        },
        onError: () => {
          queryClient.setQueryData(queryKey, (old: typeof workoutData) => {
            if (!old) return old;
            return {
              ...old,
              exercises: old.exercises?.filter((e) => e.id !== tempId) || [],
            };
          });
          toast.error("Erro ao adicionar exercício ao treino. Tente novamente.");
        },
      }
    );
  };

  const handleDeleteExercise = (exerciseWorkoutId: string) => {
    if (exerciseWorkoutId.startsWith('temp-')) return;
    const exercise = workoutData.exercises?.find((e) => e.id === exerciseWorkoutId);
    const exerciseName = exercise?.exerciseData.name || "";
    const queryKey = getApiWorkoutByIdSuspenseQueryKey(workoutId);

    const exerciseToDelete = exercise;

    queryClient.setQueryData(queryKey, (old: typeof workoutData) => {
      if (!old) return old;
      return {
        ...old,
        exercises: old.exercises?.filter((e) => e.id !== exerciseWorkoutId) || [],
      };
    });

    deleteExerciseFromWorkout(
      { exerciseWorkoutId },
      {
        onSuccess: () => {
          toast.success(`Exercício ${exerciseName} removido do treino com sucesso!`);
        },
        onError: () => {
          // Rollback optimistic update on error
          if (exerciseToDelete) {
            queryClient.setQueryData(queryKey, (old: typeof workoutData) => {
              if (!old) return old;
              // Add the exercise back and sort by order to maintain correct position
              const exercises = [...(old.exercises || []), exerciseToDelete];
              exercises.sort((a, b) => a.order - b.order);
              return {
                ...old,
                exercises,
              };
            });
          }
          toast.error("Erro ao remover exercício do treino. Tente novamente.");
        },
      }
    );
  };

  const handleDragExercises = (exercises: WorkoutExercise[]) => {
    if (exercises.some((e) => e.id.startsWith('temp-'))) return;
    const exerciseWorkoutsData = exercises.map((exercise, index) => ({
      id: exercise.id,
      order: index,
    }));
    const queryKey = getApiWorkoutByIdSuspenseQueryKey(workoutId);

    // Optimistically update the cache with new order
    queryClient.setQueryData(queryKey, (old: typeof workoutData) => {
      if (!old) return old;
      return {
        ...old,
        exercises: exercises,
      };
    });

    reorderExercises(
      {
        data: {
          exerciseWorkouts: exerciseWorkoutsData,
        },
      },
      {
        onSuccess: (response) => {
          queryClient.setQueryData(queryKey, response);
          toast.success("Ordem dos exercícios atualizada com sucesso!");
        },
        onError: () => {
          // Rollback optimistic update on error
          queryClient.setQueryData(queryKey, (old: typeof workoutData) => {
            if (!old) return old;
            // Restore original order by sorting by order property
            const sortedExercises = [...(old.exercises || [])].sort((a, b) => a.order - b.order);
            return {
              ...old,
              exercises: sortedExercises,
            };
          });
          toast.error("Erro ao reordenar exercícios. Tente novamente.");
        },
      }
    );
  };

  const handleExerciseFormChange = (exerciseWorkoutId: string, formData: ExerciseFormData) => {
    if (exerciseWorkoutId.startsWith('temp-')) return;
    const exercise = workoutData.exercises?.find((e) => e.id === exerciseWorkoutId);
    if (!exercise) return;

    const queryKey = getApiWorkoutByIdSuspenseQueryKey(workoutId);

    // Transform form data to API format: map restTime to rest and remove order
    const setsData = formData.sets.map((set) => ({
      type: set.type,
      reps: set.reps > 0 ? set.reps : undefined,
      weight: set.weight > 0 ? set.weight : undefined,
      rest: set.restTime > 0 ? set.restTime : undefined,
    }));

    // Optimistically update the cache
    queryClient.setQueryData(queryKey, (old: typeof workoutData) => {
      if (!old) return old;
      return {
        ...old,
        exercises: old.exercises?.map((e) =>
          e.id === exerciseWorkoutId
            ? {
              ...e,
              sets: setsData,
            }
            : e
        ) || [],
      };
    });

    updateExerciseWorkout(
      {
        exerciseWorkoutId,
        data: {
          exerciseId: exercise.exerciseData.id,
          sets: setsData,
        },
      },
      {
        onSuccess: (updatedExercise) => {
          queryClient.setQueryData(queryKey, (old: typeof workoutData) => {
            if (!old) return old;
            return {
              ...old,
              exercises: old.exercises?.map((e) =>
                e.id === exerciseWorkoutId ? updatedExercise : e
              ) || [],
            };
          });
          toast.success(`Exercício ${exercise.exerciseData.name} atualizado com sucesso!`);
        },
        onError: () => {
          // Rollback optimistic update on error
          queryClient.setQueryData(queryKey, (old: typeof workoutData) => {
            if (!old) return old;
            return {
              ...old,
              exercises: old.exercises?.map((e) =>
                e.id === exerciseWorkoutId ? exercise : e
              ) || [],
            };
          });
          toast.error("Erro ao atualizar exercício. Tente novamente.");
        },
      }
    );
  };

  return (
    <SidebarProvider className="relative" sidebarWidth="24rem">
      <SidebarInset>
        <PageTitle title="Editar treino"
          isPending={isAddingExercise || isUpdatingWorkout || isDeletingExercise || isReorderingExercises || isUpdatingExercise}
          showPendingState
          backButton={
            <Button variant="ghost" size="icon" onClick={() => router.history.back()}>
              <ArrowLeftIcon className="size-4" />
            </Button>
          }
        />
        <div className="space-y-8 pb-6">
          <WorkoutForm onFormChange={onFormChange} initialValues={formData} />
          <div className="flex items-center justify-between">
            <div className="flex space-x-2 items-center">
              <TypographyH3 className="font-medium">Exercícios</TypographyH3>
              <Badge variant="secondary">{workoutData.exercises?.length || 0}</Badge>
            </div>
            <ExerciseSidebarTrigger />
          </div>
          {workoutData.exercises?.length === 0 &&
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <DumbbellIcon />
                </EmptyMedia>
                <EmptyTitle>Nenhum exercicio foi adicionado ao treino {workoutData.name}</EmptyTitle>
                <EmptyDescription>Adicione um novo exercicio clicando no icone de + da lista de exercícios</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <ExerciseSidebarTrigger />
              </EmptyContent>
            </Empty>}

          <ExerciseListDraggable
            workoutId={workoutData.id}
            exercises={workoutData.exercises || []}
            onDelete={handleDeleteExercise}
            onDrag={handleDragExercises}
            onExerciseFormChange={handleExerciseFormChange}
          />
        </div>
      </SidebarInset>
      <ExerciseSidebar onExerciseSelect={handleExerciseSelect} />
    </SidebarProvider>
  );
}