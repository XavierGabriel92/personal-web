import ProgramForm, { CreateProgramButton } from "@/components/routine/form";
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
import { getApiRoutinesSuspenseQueryKey } from "@/gen/hooks/useGetApiRoutinesSuspense";
import { usePostApiRoutineCreate } from "@/gen/hooks/usePostApiRoutineCreate";
import { queryClient } from "@/routes/__root";
import { useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { RoutineFormData } from "../form";


export default function CreateRoutineSheet() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync: createRoutine, isPending } = usePostApiRoutineCreate();

  const handleSubmit = async (data: RoutineFormData) => {
    await createRoutine({
      data: {
        name: data.name,
        description: data.description || undefined,
        duration: data.duration,
      },
    }, {
      onSuccess: async (data) => {
        toast.success(`Programa ${data.name} criado com sucesso!`);
        await queryClient.invalidateQueries({
          queryKey: getApiRoutinesSuspenseQueryKey()
        });
        navigate({ to: "/trainer/routines/$routineId", params: { routineId: data.id } });
      },
      onError: () => {
        toast.error("Erro ao criar programa. Tente novamente.");
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Novo programa
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Criar novo programa</SheetTitle>
          <SheetDescription>
            Preencha os dados abaixo para criar um novo programa.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <ProgramForm onSubmit={handleSubmit} />
        </div>
        <SheetFooter>
          <CreateProgramButton disabled={isPending}>
            {isPending ? <><Spinner /> Criando programa... </> : "Criar Programa"}
          </CreateProgramButton>
          <SheetClose asChild>
            <Button variant="outline" disabled={isPending}>Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

