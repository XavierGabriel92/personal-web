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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { TypographyP, TypographySpan } from "@/components/ui/typography";
import { getApiClientByIdSuspenseQueryKey } from "@/gen/hooks/useGetApiClientByIdSuspense";
import { useGetApiRoutinesSuspense } from "@/gen/hooks/useGetApiRoutinesSuspense";
import { usePostApiClientByIdAssignRoutine } from "@/gen/hooks/usePostApiClientByIdAssignRoutine";
import { usePostApiRoutineCreate } from "@/gen/hooks/usePostApiRoutineCreate";
import { queryClient } from "@/routes/__root";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, CalendarPlus, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SelectRoutineForClientDialogProps {
  clientId: string;
  children?: React.ReactNode;
  requireConfirmation?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function SelectRoutineForClientDialog({
  clientId,
  children,
  requireConfirmation = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: SelectRoutineForClientDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const { data } = useGetApiRoutinesSuspense();
  const { mutateAsync: assignRoutine, isPending: isAssigning } = usePostApiClientByIdAssignRoutine();
  const { mutateAsync: createRoutine, isPending: isCreating } = usePostApiRoutineCreate();

  const isPending = isAssigning || isCreating;

  const handleConfirmClick = () => {
    if (!selectedRoutineId) return;
    if (requireConfirmation) {
      setConfirmOpen(true);
    } else {
      handleConfirm();
    }
  };

  const handleConfirm = async () => {
    if (!selectedRoutineId) return;

    await assignRoutine(
      { id: clientId, data: { routineId: selectedRoutineId } },
      {
        onSuccess: async (client) => {
          toast.success("Programa atribuído com sucesso!");
          await queryClient.invalidateQueries({
            queryKey: getApiClientByIdSuspenseQueryKey(clientId),
          });
          setOpen(false);
          setSelectedRoutineId(null);
          if (client.activeRoutineId) {
            navigate({ to: "/trainer/routines/$routineId", params: { routineId: client.activeRoutineId } });
          }
        },
        onError: () => {
          toast.error("Erro ao atribuir programa. Tente novamente.");
        },
      }
    );
  };

  const handleCreateFromScratch = async () => {
    await createRoutine(
      {
        data: {
          name: "Nova rotina",
          duration: 0,
          clientId,
        },
      },
      {
        onSuccess: async (routine) => {
          await queryClient.invalidateQueries({
            queryKey: getApiClientByIdSuspenseQueryKey(clientId),
          });
          setOpen(false);
          navigate({ to: "/trainer/routines/$routineId", params: { routineId: routine.id } });
        },
        onError: () => {
          toast.error("Erro ao criar programa. Tente novamente.");
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setSelectedRoutineId(null);
      }}
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Selecionar programa</DialogTitle>
          <DialogDescription>
            Escolha um programa da sua biblioteca para atribuir ao aluno, ou crie um do zero.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-80 overflow-y-auto space-y-2 py-2">
          {data.routines.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Calendar />
                </EmptyMedia>
                <EmptyTitle>Nenhum programa na biblioteca</EmptyTitle>
                <EmptyDescription>Crie um programa do zero para começar</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            data.routines.map((routine) => (
              <Button
                key={routine.id}
                variant={selectedRoutineId === routine.id ? "active" : "outline"}
                className="w-full justify-start h-auto p-3"
                onClick={() =>
                  setSelectedRoutineId(selectedRoutineId === routine.id ? null : routine.id)
                }
              >
                <div className="flex items-start justify-between gap-2 w-full min-w-0">
                  <div className="flex flex-col gap-1 min-w-0">
                    <TypographySpan className="font-medium wrap-break-word">{routine.name}</TypographySpan>
                    {routine.description && (
                      <TypographyP className="text-muted-foreground text-sm line-clamp-2 wrap-break-word">
                        {routine.description}
                      </TypographyP>
                    )}
                    <div className="flex gap-1 flex-wrap mt-1">
                      {routine.workouts.slice(0, 3).map((w) => (
                        <Badge key={w.id} variant="secondary" className="text-xs">
                          {w.name}
                        </Badge>
                      ))}
                      {routine.workouts.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{routine.workouts.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {routine.duration > 0 && (
                    <TypographySpan className="text-muted-foreground text-xs whitespace-nowrap">
                      {routine.duration} sem.
                    </TypographySpan>
                  )}
                </div>
              </Button>
            ))
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleCreateFromScratch}
            disabled={isPending}
            className="gap-2"
          >
            {isCreating ? <Spinner /> : <PlusIcon className="h-4 w-4" />}
            Criar programa do zero
          </Button>
          <Button
            onClick={handleConfirmClick}
            disabled={!selectedRoutineId || isPending}
            className="gap-2"
          >
            {isAssigning ? <Spinner /> : <CalendarPlus className="h-4 w-4" />}
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Trocar programa?</AlertDialogTitle>
            <AlertDialogDescription>
              O programa atual será substituído pelo selecionado. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
              {isAssigning ? <Spinner /> : null}
              Sim, trocar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
