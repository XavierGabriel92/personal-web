import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { TypographySpan } from "@/components/ui/typography";
import { useIsLgScreen } from "@/hooks/use-mobile";
import { useState } from "react";

interface Exercise {
  id: string;
  name: string;
  img?: string;
  type: string;
  primaryMuscle: string;
  otherMuscles?: string[];
  instructions?: string[];
  video?: string;
}

interface ExerciseSidebarProps {
  exercises: Exercise[];
  onExerciseSelect?: (exercise: Exercise) => void;
}

// Mock equipment data
const MOCK_EQUIPMENT = [
  { value: "barbell", label: "Barra" },
  { value: "dumbbell", label: "Halteres" },
  { value: "cable", label: "Cabo" },
  { value: "machine", label: "Máquina" },
  { value: "bodyweight", label: "Peso corporal" },
  { value: "kettlebell", label: "Kettlebell" },
  { value: "resistance-band", label: "Faixa elástica" },
  { value: "smith-machine", label: "Smith Machine" },
];

// Mock muscles data
const MOCK_MUSCLES = [
  { value: "chest", label: "Peito" },
  { value: "back", label: "Costas" },
  { value: "shoulders", label: "Ombros" },
  { value: "biceps", label: "Bíceps" },
  { value: "triceps", label: "Tríceps" },
  { value: "forearms", label: "Antebraços" },
  { value: "abs", label: "Abdômen" },
  { value: "quadriceps", label: "Quadríceps" },
  { value: "hamstrings", label: "Posteriores" },
  { value: "glutes", label: "Glúteos" },
  { value: "calves", label: "Panturrilhas" },
  { value: "traps", label: "Trapézios" },
];

export function ExerciseSidebarTrigger() {
  const { toggleSidebar } = useSidebar();
  const isLgScreen = useIsLgScreen();

  // Only show trigger on mobile (< lg)
  if (isLgScreen) {
    return (
      <Button

        className="w-full"
        size="sm"
        onClick={toggleSidebar}
      >
        Selecionar exercício
      </Button>
    );
  }

  return null;
}

function ExerciseSidebarContent({
  exercises,
  onExerciseSelect,
}: ExerciseSidebarProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<string>("all");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <>
      <SidebarHeader className="border-b pb-4 flex flex-col gap-3 shrink-0 sticky top-0 bg-sidebar z-10">
        <div className="grid grid-cols-2 gap-2">
          <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Equipamentos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Equipamentos</SelectItem>
              {MOCK_EQUIPMENT.map((equipment) => (
                <SelectItem key={equipment.value} value={equipment.value}>
                  {equipment.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMuscle} onValueChange={setSelectedMuscle}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Músculos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Músculos</SelectItem>
              {MOCK_MUSCLES.map((muscle) => (
                <SelectItem key={muscle.value} value={muscle.value}>
                  {muscle.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <SearchInput
          placeholder="Pesquisar exercício"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SidebarHeader>
      <SidebarContent className="w-screen sm:w-auto px-0 py-2">
        <ScrollArea className="space-y-0 h-full">
          {exercises.filter((exercise) => exercise.name.toLowerCase().includes(searchTerm.toLowerCase())).map((exercise) => (
            <Button
              variant="ghost"
              onClick={() => onExerciseSelect?.(exercise)}
              key={exercise.id}
              className="w-full h-auto"
            >

              <div className="flex items-center gap-4 w-full">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={exercise.img} alt={exercise.name} />
                  <AvatarFallback>{exercise.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <TypographySpan >
                  {exercise.name}
                </TypographySpan>
              </div>
            </Button>

          ))}
        </ScrollArea>
      </SidebarContent>
    </>
  );
}

export default function ExerciseOverviewSidebar({
  exercises,
  onExerciseSelect,
}: ExerciseSidebarProps) {

  return (
    <Sidebar
      side="right"
      avoidFullHeight={true}
      noOverlay={true}
    >
      <ExerciseSidebarContent exercises={exercises} onExerciseSelect={onExerciseSelect} />
    </Sidebar>
  );
}

