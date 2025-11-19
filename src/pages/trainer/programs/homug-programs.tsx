import {
  Categories,
  type Category,
  type HomugProgram,
  ProgramsList,
} from "@/components/program/list/homug";
import { useMemo, useState } from "react";

const categories: Category[] = [
  { value: "all", label: "Todos os Programas" },
  { value: "beginner", label: "Iniciante" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
  { value: "muscle-growth", label: "Ganho de Massa Muscular" },
  { value: "strength", label: "Força" },
  { value: "home", label: "Treino em Casa" },
];

const mockPrograms: HomugProgram[] = [
  {
    id: "1",
    title: "Push/Pull/Legs - Iniciante - Divisão de 3 Dias",
    notes:
      "A divisão push/pull/legs para iniciantes de 3 dias é uma abordagem simples e sustentável para iniciantes construírem uma base na academia. Cada dia é dedicado a grupos musculares específicos, permitindo que os treinadores concentrem seus esforços em um punhado de exercícios e criem o estímulo necessário para crescimento e ganho de força. O programa inclui três treinos, cada um uma mistura de exercícios compostos e isolados.",
    duration: 12,
    category: "beginner",
    workouts: [
      { id: "1", name: "Treino 1 - Push" },
      { id: "2", name: "Treino 2 - Pull" },
      { id: "3", name: "Treino 3 - Legs" },
    ],
  },
  {
    id: "2",
    title: "Push/Pull/Legs (Edição Casa) - Iniciante - Divisão de 3 Dias",
    notes:
      "A divisão push/pull/legs de 3 dias edição casa é uma opção fantástica para iniciantes que procuram começar a treinar na privacidade e conforto de suas casas. O programa consiste principalmente em exercícios com halteres, o que significa que os treinadores podem fazê-lo funcionar com um par de halteres ajustáveis, um tapete de exercícios e alguns outros itens essenciais.",
    duration: 12,
    category: "home",
    workouts: [
      { id: "1", name: "Push" },
      { id: "2", name: "Pull" },
      { id: "3", name: "Legs" },
    ],
  },
  {
    id: "3",
    title: "Corpo Inteiro - Iniciante - 3 Dias",
    notes:
      "O treino de corpo inteiro é uma das melhores abordagens para iniciantes. Treinar os músculos com frequência reduz o risco de dor excessiva e facilita para os treinadores desenvolverem as habilidades necessárias nos levantamentos compostos para ficarem mais fortes.",
    duration: 8,
    category: "beginner",
    workouts: [
      { id: "1", name: "Corpo Inteiro A" },
      { id: "2", name: "Corpo Inteiro B" },
      { id: "3", name: "Corpo Inteiro C" },
    ],
  },
  {
    id: "4",
    title: "Upper/Lower - Intermediário - Divisão de 4 Dias",
    notes:
      "A divisão upper/lower de 4 dias é perfeita para atletas intermediários que querem aumentar o volume de treino. Este programa alterna entre treinos de parte superior e inferior do corpo, permitindo mais frequência de treino por grupo muscular.",
    duration: 16,
    category: "intermediate",
    workouts: [
      { id: "1", name: "Upper A" },
      { id: "2", name: "Lower A" },
      { id: "3", name: "Upper B" },
      { id: "4", name: "Lower B" },
    ],
  },
  {
    id: "5",
    title: "5/3/1 - Avançado - Programa de Força",
    notes:
      "O programa 5/3/1 é um método de treinamento de força comprovado desenvolvido por Jim Wendler. É um programa de longo prazo que se concentra em aumentar gradualmente a força através de levantamentos compostos principais.",
    duration: 12,
    category: "strength",
    workouts: [
      { id: "1", name: "Treino 1 - Agachamento" },
      { id: "2", name: "Treino 2 - Supino" },
      { id: "3", name: "Treino 3 - Levantamento Terra" },
      { id: "4", name: "Treino 4 - Desenvolvimento" },
    ],
  },
  {
    id: "6",
    title: "Hipertrofia - Ganho de Massa - Divisão de 5 Dias",
    notes:
      "Programa focado em hipertrofia com alta frequência e volume. Ideal para atletas avançados que buscam maximizar o ganho de massa muscular através de treinos específicos por grupo muscular.",
    duration: 16,
    category: "muscle-growth",
    workouts: [
      { id: "1", name: "Peito" },
      { id: "2", name: "Costas" },
      { id: "3", name: "Pernas" },
      { id: "4", name: "Ombros" },
      { id: "5", name: "Braços" },
    ],
  },
];

export default function HomugProgramsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPrograms = useMemo(() => {
    if (selectedCategory === "all") {
      return mockPrograms;
    }
    return mockPrograms.filter(
      (program) => program.category === selectedCategory
    );
  }, [selectedCategory]);

  const handleAddToLibrary = (programId: string) => {
    console.log("Adding program to library:", programId);
    // TODO: Implement add to library functionality
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
        />
      </main>
    </div>
  );
}
