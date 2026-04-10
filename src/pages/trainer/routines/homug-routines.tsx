import {
	Categories,
	type Category,
	type HomugProgram,
	ProgramDetailsDialog,
	ProgramsList,
	mapApiWorkoutToHomugWorkout,
} from "@/components/routine/list/homug";
import { Spinner } from "@/components/ui/spinner";
import { useGetApiRoutinesTemplatesSuspense } from "@/gen/hooks/useGetApiRoutinesTemplatesSuspense";
import { usePostApiRoutinesTemplatesByIdClone } from "@/gen/hooks/usePostApiRoutinesTemplatesByIdClone";
import { useNavigate } from "@tanstack/react-router";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";

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
	const [detailProgram, setDetailProgram] = useState<HomugProgram | null>(null);
	const navigate = useNavigate();

	const { data } = useGetApiRoutinesTemplatesSuspense();
	const { mutateAsync: cloneTemplate } = usePostApiRoutinesTemplatesByIdClone();

	const programs: HomugProgram[] = useMemo(() => {
		return (data?.routines ?? []).map((routine) => {
			const category = routine.category ?? "beginner";
			return {
				id: routine.id,
				title: routine.name,
				notes: routine.description ?? "",
				duration: routine.duration,
				category,
				categoryLabel: CATEGORY_LABELS[category] ?? category,
				workouts: routine.workouts.map(mapApiWorkoutToHomugWorkout),
			};
		});
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
		<>
			<ProgramDetailsDialog
				program={detailProgram}
				open={detailProgram !== null}
				onOpenChange={(open) => {
					if (!open) setDetailProgram(null);
				}}
				onAddToLibrary={handleAddToLibrary}
				isLoading={detailProgram !== null && loadingId === detailProgram.id}
			/>
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
						onViewDetails={setDetailProgram}
						loadingId={loadingId}
					/>
				</main>
			</div>
		</>
	);
}

export default function HomugProgramsPage() {
	return (
		<Suspense fallback={<Spinner className="size-8" />}>
			<HomugProgramsContent />
		</Suspense>
	);
}
