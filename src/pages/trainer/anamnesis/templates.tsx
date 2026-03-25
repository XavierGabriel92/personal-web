import {
  AnamnesisCategories,
  AnamnesisTemplateList,
  type AnamnesisCategory,
  type TemplateAnamnesisItem,
} from "@/components/anamnesis/list/templates";
import { Spinner } from "@/components/ui/spinner";
import { useGetApiAnamnesisTemplatesSuspense } from "@/gen/hooks/useGetApiAnamnesisTemplatesSuspense";
import { usePostApiAnamnesisTemplatesByIdClone } from "@/gen/hooks/usePostApiAnamnesisTemplatesByIdClone";
import { useNavigate } from "@tanstack/react-router";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";

const CATEGORY_LABELS: Record<string, string> = {
  general: "Geral",
  health: "Saúde",
  sports: "Esportes",
  nutrition: "Nutrição",
  mental: "Saúde Mental",
};

function AnamnesisTemplatesContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
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

  const categories: AnamnesisCategory[] = useMemo(() => {
    const seen = new Set<string>();
    const dynamic: AnamnesisCategory[] = [];
    for (const item of items) {
      if (!seen.has(item.category)) {
        seen.add(item.category);
        dynamic.push({
          value: item.category,
          label: CATEGORY_LABELS[item.category] ?? item.category,
        });
      }
    }
    return [{ value: "all", label: "Todas as Anamneses" }, ...dynamic];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

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
    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
      <aside className="w-full md:w-64 shrink-0">
        <AnamnesisCategories
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </aside>
      <main className="flex-1">
        <AnamnesisTemplateList
          items={filteredItems}
          onAddToLibrary={handleAddToLibrary}
          loadingId={loadingId}
        />
      </main>
    </div>
  );
}

export default function AnamnesisTemplatesPage() {
  return (
    <Suspense fallback={<Spinner className="size-8" />}>
      <AnamnesisTemplatesContent />
    </Suspense>
  );
}
