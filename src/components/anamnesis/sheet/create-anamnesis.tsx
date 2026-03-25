import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import { getApiAnamnesisSuspenseQueryKey } from "@/gen/hooks/useGetApiAnamnesisSuspense";
import { usePostApiAnamnesisCreate } from "@/gen/hooks/usePostApiAnamnesisCreate";
import { queryClient } from "@/routes/__root";
import { useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateAnamnesisSheet() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const { mutateAsync: createAnamnesis, isPending } = usePostApiAnamnesisCreate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createAnamnesis(
      {
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
        },
      },
      {
        onSuccess: async (data) => {
          toast.success(`Anamnese "${data.name}" criada com sucesso!`);
          await queryClient.invalidateQueries({
            queryKey: getApiAnamnesisSuspenseQueryKey(),
          });
          setOpen(false);
          setName("");
          setDescription("");
          navigate({ to: "/trainer/anamnesis/$anamnesisId", params: { anamnesisId: data.id } });
        },
        onError: () => {
          toast.error("Erro ao criar anamnese. Tente novamente.");
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Nova anamnese
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Criar nova anamnese</SheetTitle>
          <SheetDescription>
            Preencha os dados abaixo para criar uma nova anamnese.
          </SheetDescription>
        </SheetHeader>
        <form id="anamnesis-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              placeholder="Ex: Avaliação Inicial"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o objetivo desta anamnese..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </form>
        <SheetFooter>
          <Button form="anamnesis-form" type="submit" disabled={isPending || !name.trim()}>
            {isPending ? <><Spinner /> Criando...</> : "Criar Anamnese"}
          </Button>
          <SheetClose asChild>
            <Button variant="outline" disabled={isPending}>Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
