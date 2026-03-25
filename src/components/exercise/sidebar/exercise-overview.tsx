import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/input";
import { useDebounce } from "@/components/ui/multi-select";
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
import { Spinner } from "@/components/ui/spinner";
import { TypographySpan } from "@/components/ui/typography";
import { useGetApiExercisesFilters, usePostApiExercisesSearch } from "@/gen";
import { useIsLgScreen } from "@/hooks/use-mobile";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Exercise } from "../schemas";

interface ExerciseSidebarProps {
  onExerciseSelect?: (exercise: Exercise) => void;
  searchKey?: number | string; // Key to trigger re-search when changed
}


export function ExerciseSidebarTrigger() {
  const { toggleSidebar } = useSidebar();
  const isLgScreen = useIsLgScreen();

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
  onExerciseSelect,
  searchKey,
}: ExerciseSidebarProps) {
  const [selectedEquipment, _] = useState<string>("all");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch filters for dropdowns
  const { data: filtersData } = useGetApiExercisesFilters();

  // Search exercises mutation
  const { mutate: searchExercises, isPending: isLoading } = usePostApiExercisesSearch({
    mutation: {
      onSuccess: (data) => {
        if (currentPage === 1) {
          // First page - replace all exercises
          setExercises(data.exercises || []);
        } else {
          // Subsequent pages - append to existing exercises
          setExercises((prev) => [...prev, ...(data.exercises || [])]);
        }
        setPagination(data.pagination);
        setIsLoadingMore(false);
      },
    },
  });

  // Load more exercises when scrolling to bottom
  const loadMoreExercises = useCallback(() => {
    if (isLoadingMore || !pagination) return;

    const hasNextPage = pagination.page < pagination.totalPages;
    if (!hasNextPage) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    searchExercises({
      data: {
        page: nextPage,
        limit: 15,
        name: debouncedSearchTerm || undefined,
        muscles: selectedMuscle !== "all" ? [selectedMuscle] : undefined,
        equipments: selectedEquipment !== "all" ? [selectedEquipment] : undefined,
      },
    });
  }, [isLoadingMore, pagination, currentPage, searchExercises, debouncedSearchTerm, selectedMuscle, selectedEquipment]);

  // Handle scroll to detect when near bottom
  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current || isLoadingMore || !pagination) return;

    // Find the ScrollArea viewport element
    const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
    if (!viewport) return;

    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px threshold

    if (isNearBottom) {
      loadMoreExercises();
    }
  }, [loadMoreExercises, isLoadingMore, pagination]);

  // Attach scroll listener to ScrollArea viewport
  useEffect(() => {
    if (!scrollAreaRef.current) return;

    const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
    if (!viewport) return;

    viewport.addEventListener("scroll", handleScroll);
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Reset and fetch first page when filters/search change
  // searchKey is intentionally included to trigger re-searches when changed
  useEffect(() => {
    setCurrentPage(1);
    setExercises([]);
    setPagination(null);
    setIsLoadingMore(false);

    searchExercises({
      data: {
        page: 1,
        limit: 15,
        name: debouncedSearchTerm || undefined,
        muscles: selectedMuscle !== "all" ? [selectedMuscle] : undefined,
        equipments: selectedEquipment !== "all" ? [selectedEquipment] : undefined,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, selectedMuscle, selectedEquipment, searchExercises, searchKey]);

  return (
    <>
      <SidebarHeader className="border-b pb-4 flex flex-col gap-3 shrink-0 sticky top-0 bg-sidebar z-10">
        <div className="grid grid-cols-1 gap-2">
          {/* <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Equipamentos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os equipamentos</SelectItem>
              {filtersData?.equipments?.map((equipment: { id: string; name: string }) => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
          <Select value={selectedMuscle} onValueChange={setSelectedMuscle}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Músculos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os músculos</SelectItem>
              {filtersData?.muscles?.map((muscle: { id: string; name: string }) => (
                <SelectItem key={muscle.id} value={muscle.id}>
                  {muscle.name}
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
        <ScrollArea className="space-y-0 h-full" ref={scrollAreaRef}>
          {isLoading && exercises.length === 0 ? (
            <div className="flex items-center justify-center p-4 gap-2">
              <Spinner />
              <TypographySpan className="text-muted-foreground">
                Carregando...
              </TypographySpan>
            </div>
          ) : exercises.length === 0 ? (
            <div className="flex items-center justify-center p-4">
              <TypographySpan className="text-muted-foreground">
                Nenhum exercício encontrado
              </TypographySpan>
            </div>
          ) : (
            <>
              {exercises.map((exercise) => (
                <Button
                  variant="ghost"
                  onClick={() => onExerciseSelect?.(exercise)}
                  key={exercise.id}
                  className="w-full h-auto"
                >
                  <div className="flex items-center gap-4 w-full">
                    <Avatar key={exercise.thumbnailUrl} className="h-12 w-12">
                      <AvatarFallback>{exercise.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      <AvatarImage src={exercise.thumbnailUrl ?? ""} alt={exercise.name} />
                    </Avatar>
                    <div className="flex flex-col justify-start items-start">
                      <TypographySpan>
                        {exercise.name}
                      </TypographySpan>
                      <div className="flex items-center  gap-2">
                        <TypographySpan className="text-muted-foreground">
                          {exercise.primaryMuscle?.name}
                        </TypographySpan>
                        {exercise.ownerId &&
                          <Badge variant="outline" >
                            Customizado
                          </Badge>}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
              {isLoadingMore && (
                <div className="flex items-center justify-center p-4 gap-2">
                  <Spinner />
                  <TypographySpan className="text-muted-foreground">
                    Carregando mais exercícios...
                  </TypographySpan>
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </SidebarContent>
    </>
  );
}

export default function ExerciseOverviewSidebar({
  onExerciseSelect,
  searchKey,
}: ExerciseSidebarProps) {

  return (
    <Sidebar
      side="right"
      // avoidFullHeight={true}
      noOverlay={true}
    >
      <ExerciseSidebarContent onExerciseSelect={onExerciseSelect} searchKey={searchKey} />
    </Sidebar>
  );
}

