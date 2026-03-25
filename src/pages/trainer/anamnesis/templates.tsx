import {
  AnamnesisTemplateList,
  type TemplateAnamnesisItem,
} from "@/components/anamnesis/list/templates";
import { Spinner } from "@/components/ui/spinner";
import { useGetApiAnamnesisTemplatesSuspense } from "@/gen/hooks/useGetApiAnamnesisTemplatesSuspense";
import { usePostApiAnamnesisTemplatesByIdClone } from "@/gen/hooks/usePostApiAnamnesisTemplatesByIdClone";
import { useNavigate } from "@tanstack/react-router";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";

function AnamnesisTemplatesContent() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data } = useGetApiAnamnesisTemplatesSuspense();
  const { mutateAsync: cloneTemplate } = usePostApiAnamnesisTemplatesByIdClone();

  const items: TemplateAnamnesisItem[] = useMemo(() => {
    return (data?.anamnesis ?? []).map((item) => ({
      id: item.id,
      title: item.name,
      description: item.description ?? "",
      category: item.category ?? "general",
      questionCount: item.questions.length,
    }));
  }, [data]);

  const handleAddToLibrary = async (id: string) => {
    setLoadingId(id);
    try {
      await cloneTemplate({ id });
      toast.success("Anamnese adicionada à sua biblioteca!");
      navigate({ to: "/trainer/anamnesis" });
    } catch {
      toast.error("Erro ao adicionar anamnese. Tente novamente.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <AnamnesisTemplateList
      items={items}
      onAddToLibrary={handleAddToLibrary}
      loadingId={loadingId}
    />
  );
}

export default function AnamnesisTemplatesPage() {
  return (
    <Suspense fallback={<Spinner className="size-8" />}>
      <AnamnesisTemplatesContent />
    </Suspense>
  );
}
