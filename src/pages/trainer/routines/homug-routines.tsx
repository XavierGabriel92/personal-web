import {
  Categories,
  type Category,
  type HomugProgram,
  ProgramsList,
} from "@/components/routine/list/homug";
import { useGetApiRoutinesTemplatesSuspense } from "@/gen/hooks/useGetApiRoutinesTemplatesSuspense";
import { usePostApiRoutinesTemplatesByIdClone } from "@/gen/hooks/usePostApiRoutinesTemplatesByIdClone";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/spinner";

const CATEGORY_LABELS: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
  "muscle-growth": "Ganho de Massa Muscular",
  strength: "Força",
  home: "Treino em Casa",
};

function HomugProgramsContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data } = useGetApiRoutinesTemplatesSuspense();
  const { mutateAsync: cloneTemplate } = usePostApiRoutinesTemplatesByIdClone();

  const programs: HomugProgram[] = useMemo(() => {
    return (data?.routines ?? []).map((routine) => ({
      id: routine.id,
      title: routine.name,
      notes: routine.description ?? "",
      duration: routine.duration,
      category: routine.category ?? "beginner",
      workouts: routine.workouts.map((w) => ({ id: w.id, name: w.name })),
    }));
  }, [data]);

  const categories: Category[] = useMemo(() => {
    const seen = new Set<string>();
    const dynamic: Category[] = [];
    for (const p of programs) {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        dynamic.push({
          value: p.category,
          label: CATEGORY_LABELS[p.category] ?? p.category,
        });
      }
    }
    return [{ value: "all", label: "Todos os Programas" }, ...dynamic];
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    if (selectedCategory === "all") return programs;
    return programs.filter((p) => p.category === selectedCategory);
  }, [programs, selectedCategory]);

  const handleAddToLibrary = async (programId: string) => {
    setLoadingId(programId);
    try {
      await cloneTemplate({ id: programId });
      toast.success("Programa adicionado à sua biblioteca!");
      navigate({ to: "/trainer/routines" });
    } catch {
      toast.error("Erro ao adicionar programa. Tente novamente.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
      <aside className="w-full md:w-64 shrink-0">
        <Categories
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </aside>
      <main className="flex-1">
        <ProgramsList
          programs={filteredPrograms}
          onAddToLibrary={handleAddToLibrary}
          loadingId={loadingId}
        />
      </main>
    </div>
  );
}

export default function HomugProgramsPage() {
  return (
    <Suspense fallback={<Spinner className="size-8" />}>
      <HomugProgramsContent />
    </Suspense>
  );
}
