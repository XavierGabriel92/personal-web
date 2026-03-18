import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

// Types
export interface Category {
  value: string;
  label: string;
}

export interface HomugProgram {
  id: string;
  title: string;
  notes: string;
  duration: number;
  category: string;
  workouts: {
    id: string;
    name: string;
  }[];
}

// Categories Component
interface CategoriesProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function Categories({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoriesProps) {
  return (
    <>
      {/* Mobile Select - visible on screens < MD */}
      <div className="md:hidden flex flex-col gap-2">
        <Label>Categorias</Label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Card with Buttons - visible on screens >= MD */}
      <Card className="hidden md:flex flex-col gap-2">
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            {categories.map((category) => (
              <Button
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                variant="ghost"
                size="sm"
                className={cn(
                  "justify-start",
                  selectedCategory === category.value
                  && "bg-secondary text-secondary-foreground"
                )}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Programs List Component
interface ProgramsListProps {
  programs: HomugProgram[];
  onAddToLibrary?: (programId: string) => void;
}

export function ProgramsList({
  programs,
  onAddToLibrary,
}: ProgramsListProps) {
  return (
    <div className="flex flex-col gap-4">
      {programs.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          Nenhum programa encontrado
        </div>
      ) : (
        programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onAddToLibrary={onAddToLibrary}
          />
        ))
      )}
    </div>
  );
}

// Program Card Component
interface ProgramCardProps {
  program: HomugProgram;
  onAddToLibrary?: (programId: string) => void;
}

function ProgramCard({ program, onAddToLibrary }: ProgramCardProps) {
  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle>{program.title}</CardTitle>
            <CardDescription className="mt-2">{program.notes}</CardDescription>
          </div>
          <Button
            onClick={() => onAddToLibrary?.(program.id)}
            className="hidden lg:flex shrink-0"
          >
            <Download />
            Adicionar aos meus programas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {program.workouts.map((workout) => (
            <Badge key={workout.id} variant="secondary">
              {workout.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="lg:hidden">
        <Button
          onClick={() => onAddToLibrary?.(program.id)}
          className="w-full"
        >
          <Download />
          Adicionar aos meus programas
        </Button>
      </CardFooter>
    </Card>
  );
}
