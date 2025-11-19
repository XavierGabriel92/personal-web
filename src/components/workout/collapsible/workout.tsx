import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { TypographyH5, TypographySpan } from "@/components/ui/typography";
import type { Workout } from "@/schemas";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface WorkoutCollapsibleProps {
  workout: Workout;
  actions?: React.ReactNode;
}

export default function WorkoutCollapsible({ workout, actions }: WorkoutCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <TypographyH5 className="">{workout.name}</TypographyH5>
          <TypographySpan className="text-muted-foreground">{workout.exercises.length} exercícios</TypographySpan>
          <CollapsibleTrigger>
            {isOpen ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
          </CollapsibleTrigger>
        </div>
        {actions}
      </div>
      <CollapsibleContent className="space-y-2">
        {workout.exercises.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Nenhuma exercício cadastrada para o treino {workout.name}
          </div>
        ) : (
          workout.exercises.map((exercise, index) => (
            <div key={`${exercise.id}-${index}`} className="flex gap-2 items-center">
              <Avatar className="h-12 w-12">
                <AvatarImage src={exercise.img} alt={exercise.name} />
                <AvatarFallback>{exercise.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <TypographySpan className="">{exercise.sets.length}x {exercise.name}</TypographySpan>
            </div>
          ))
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}