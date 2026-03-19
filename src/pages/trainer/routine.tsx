import PageTitle from "@/components/core/page-title";
import type { RoutineFormData, } from "@/components/routine/form";
import ProgramForm from "@/components/routine/form";
import AssignRoutineSheet from "@/components/routine/sheet/assign-routine";
import ResumeProgramSidebar from "@/components/routine/sidebar/resume-program";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TypographyH3 } from "@/components/ui/typography";
import WorkoutListDraggable from "@/components/workout/list/draggable";
import CreateWorkoutSheet from "@/components/workout/sheet/create-workout";
import { useDeleteApiWorkoutById } from "@/gen/hooks/useDeleteApiWorkoutById";
import { getApiRoutineByIdSuspenseQueryKey } from "@/gen/hooks/useGetApiRoutineByIdSuspense";
import { useGetApiRoutineByIdSuspense } from "@/gen/hooks/useGetApiRoutineByIdSuspense";
import { usePutApiRoutineById } from "@/gen/hooks/usePutApiRoutineById";
import { usePutApiWorkoutReorder } from "@/gen/hooks/usePutApiWorkoutReorder";
import { queryClient } from "@/routes/__root";
import type { Workout } from "@/schemas";
import { DumbbellIcon } from "lucide-react";
import { toast } from "sonner";

interface TrainerRoutinePageProps {
  routineId: string;
}

export default function TrainerRoutinePage({ routineId }: TrainerRoutinePageProps) {
  const { data } = useGetApiRoutineByIdSuspense(routineId);

  const { mutateAsync: updateRoutine, isPending } = usePutApiRoutineById();
  const { mutateAsync: reorderWorkouts, isPending: isReordering } = usePutApiWorkoutReorder();
  const { mutateAsync: deleteWorkout, isPending: isDeleting } = useDeleteApiWorkoutById();

  const onFormChange = (formData: RoutineFormData) => {
    const queryKey = getApiRoutineByIdSuspenseQueryKey(routineId);

    updateRoutine(
      {
        id: routineId,
        data: {
          name: formData.name,
          description: formData.description || undefined,
          duration: formData.duration,
        },
      },
      {
        onSuccess: (updatedData) => {
          queryClient.setQueryData(queryKey, updatedData);
          toast.success(`Programa ${updatedData.name} atualizado com sucesso!`);
        },
        onError: () => {
          toast.error("Erro ao atualizar programa. Tente novamente.");
        },
      }
    );
  };

  const onDelete = (workoutId: string) => {
    const queryKey = getApiRoutineByIdSuspenseQueryKey(routineId);
    const workout = data.workouts.find((w) => w.id === workoutId);
    const workoutName = workout?.name || "";

    deleteWorkout(
      { id: workoutId },
      {
        onSuccess: (response: { workouts?: typeof data.workouts }) => {
          // Update the routine query data with the new workouts list from the API response
          queryClient.setQueryData(queryKey, (oldData: typeof data) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              workouts: response.workouts || [],
            };
          });
          toast.success(`Treino ${workoutName} excluído com sucesso!`);
        },
        onError: () => {
          toast.error("Erro ao excluir treino. Tente novamente.");
        },
      }
    );
  };

  const onCopy = (workoutId: string) => {
    // TODO: Implement copy workout API
    console.log("Copying workout:", workoutId);
  };

  const onDrag = (workouts: Workout[]) => {
    // Transform workouts to API format: { workouts: [{ id, order }] }
    const workoutsData = workouts.map((workout, index) => ({
      id: workout.id,
      order: index,
    }));

    reorderWorkouts(
      {
        data: {
          workouts: workoutsData,
        },
      },
      {
        onSuccess: async () => {
          // Invalidate the routine query to refresh the workouts list
          await queryClient.invalidateQueries({
            queryKey: getApiRoutineByIdSuspenseQueryKey(routineId),
          });
          toast.success("Ordem dos treinos atualizada com sucesso!");
        },
        onError: () => {
          toast.error("Erro ao reordenar treinos. Tente novamente.");
        },
      }
    );
  };

  return (
    <SidebarProvider className="relative" sidebarWidth="20rem">
      <SidebarInset>
        <PageTitle title="Editar programa"
          isPending={isPending || isReordering || isDeleting}
          showPendingState
          description="Gerencie o programa e veja estatísticas dos treinos"
          actions={<div className="flex items-center gap-2">
            {!data.clientId && <AssignRoutineSheet routineId={data.id} />}
          </div>}
        />
        <div className="space-y-8 pb-6">
          <ProgramForm onFormChange={onFormChange} initialValues={data} />

          {data.workouts.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2 items-center">
                  <TypographyH3 className="font-medium">Treinos  </TypographyH3>
                  <Badge variant="secondary">{data.workouts.length}</Badge>
                </div>
                <CreateWorkoutSheet routineId={data.id} workoutsCount={data.workouts.length} />
              </div>
              <WorkoutListDraggable workouts={data.workouts} onDelete={onDelete} onCopy={onCopy} onDrag={onDrag} />
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <DumbbellIcon />
                </EmptyMedia>
                <EmptyTitle>Nenhum treino criado no programa {data.name}</EmptyTitle>
                <EmptyDescription>Crie um treino para começar</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <CreateWorkoutSheet routineId={routineId} workoutsCount={data.workouts.length} />
              </EmptyContent>
            </Empty>
          )}


        </div>

      </SidebarInset>
      <ResumeProgramSidebar workouts={data.workouts || []} />

    </SidebarProvider>
  );
}