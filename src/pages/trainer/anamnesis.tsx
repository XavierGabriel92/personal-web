import QuestionList from "@/components/anamnesis/questions/question-list";
import PageTitle from "@/components/core/page-title";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH3 } from "@/components/ui/typography";
import { getApiAnamnesisByIdSuspenseQueryKey } from "@/gen/hooks/useGetApiAnamnesisByIdSuspense";
import { useGetApiAnamnesisByIdSuspense } from "@/gen/hooks/useGetApiAnamnesisByIdSuspense";
import { usePutApiAnamnesisById } from "@/gen/hooks/usePutApiAnamnesisById";
import { queryClient } from "@/routes/__root";
import type { AnamnesisQuestion } from "@/schemas";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface TrainerAnamnesisPageProps {
  anamnesisId: string;
}

const DEBOUNCE_MS = 700;

export default function TrainerAnamnesisPage({ anamnesisId }: TrainerAnamnesisPageProps) {
  const { data } = useGetApiAnamnesisByIdSuspense(anamnesisId);
  const { mutateAsync: updateAnamnesis, isPending } = usePutApiAnamnesisById();

  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description ?? "");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync state when data changes (e.g. after optimistic update)
  useEffect(() => {
    setName(data.name);
    setDescription(data.description ?? "");
  }, [data.name, data.description]);

  const saveChanges = (newName: string, newDescription: string) => {
    if (!newName.trim()) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await updateAnamnesis(
        {
          id: anamnesisId,
          data: {
            name: newName.trim(),
            description: newDescription.trim() || undefined,
          },
        },
        {
          onSuccess: (updated) => {
            queryClient.setQueryData(getApiAnamnesisByIdSuspenseQueryKey(anamnesisId), updated);
            toast.success("Anamnese atualizada!");
          },
          onError: () => {
            toast.error("Erro ao salvar alterações.");
          },
        }
      );
    }, DEBOUNCE_MS);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    saveChanges(e.target.value, description);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    saveChanges(name, e.target.value);
  };

  return (
    <div className="space-y-8 pb-6">
      <PageTitle
        title="Editar anamnese"
        description="Gerencie as perguntas da anamnese"
        isPending={isPending}
        showPendingState
      />

      <div className="space-y-4 max-w-3xl">
        <div className="space-y-2">
          <Label htmlFor="anamnesis-name">Nome</Label>
          <Input
            id="anamnesis-name"
            value={name}
            onChange={handleNameChange}
            placeholder="Nome da anamnese"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="anamnesis-description">Descrição</Label>
          <Textarea
            id="anamnesis-description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Descrição da anamnese (opcional)"
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TypographyH3 className="font-medium">Perguntas</TypographyH3>
          <Badge variant="secondary">{data.questions.length}</Badge>
        </div>
        <QuestionList
          anamnesisId={anamnesisId}
          questions={data.questions as AnamnesisQuestion[]}
        />
      </div>
    </div>
  );
}
