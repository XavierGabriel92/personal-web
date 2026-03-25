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

export interface AnamnesisCategory {
  value: string;
  label: string;
}

export interface TemplateAnamnesisItem {
  id: string;
  title: string;
  description: string;
  category: string;
  questionCount: number;
}

interface CategoriesProps {
  categories: AnamnesisCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function AnamnesisCategories({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoriesProps) {
  return (
    <>
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
                  selectedCategory === category.value && "bg-secondary text-secondary-foreground"
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

interface AnamnesisTemplateListProps {
  items: TemplateAnamnesisItem[];
  onAddToLibrary?: (id: string) => void;
  loadingId?: string | null;
}

export function AnamnesisTemplateList({
  items,
  onAddToLibrary,
  loadingId,
}: AnamnesisTemplateListProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          Nenhuma anamnese encontrada
        </div>
      ) : (
        items.map((item) => (
          <AnamnesisTemplateCard
            key={item.id}
            item={item}
            onAddToLibrary={onAddToLibrary}
            isLoading={loadingId === item.id}
          />
        ))
      )}
    </div>
  );
}

function AnamnesisTemplateCard({
  item,
  onAddToLibrary,
  isLoading,
}: {
  item: TemplateAnamnesisItem;
  onAddToLibrary?: (id: string) => void;
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle>{item.title}</CardTitle>
            {item.description && (
              <CardDescription className="mt-2">{item.description}</CardDescription>
            )}
          </div>
          <Button
            onClick={() => onAddToLibrary?.(item.id)}
            className="hidden lg:flex shrink-0"
            disabled={isLoading}
          >
            <Download />
            {isLoading ? "Adicionando..." : "Adicionar à minha biblioteca"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">
          {item.questionCount} {item.questionCount === 1 ? "pergunta" : "perguntas"}
        </Badge>
      </CardContent>
      <CardFooter className="lg:hidden">
        <Button
          onClick={() => onAddToLibrary?.(item.id)}
          className="w-full"
          disabled={isLoading}
        >
          <Download />
          {isLoading ? "Adicionando..." : "Adicionar à minha biblioteca"}
        </Button>
      </CardFooter>
    </Card>
  );
}
