import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { TypographyH5, TypographySpan } from "@/components/ui/typography";
import type { WorkoutExercises } from "@/schemas";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface WorkoutCollapsibleProps {
  workout: WorkoutExercises;
  actions?: React.ReactNode;
}

export default function WorkoutCollapsible({ workout, actions }: WorkoutCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const exercises = workout.exercises || [];
  const exercisesCount = exercises.length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <TypographyH5 className="">{workout.name}</TypographyH5>
          <TypographySpan className="text-muted-foreground">{exercisesCount} exercícios</TypographySpan>
          <CollapsibleTrigger onClick={(e) => e.stopPropagation()}>
            {isOpen && exercisesCount > 0 ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
          </CollapsibleTrigger>
        </div>
        {actions}
      </div>
      <CollapsibleContent className="space-y-2">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="flex gap-2 items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage src={exercise.exerciseData.imgSrc ?? undefined} alt={exercise.exerciseData.name} />
              <AvatarFallback>{exercise.exerciseData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <TypographySpan className="">{exercise.exerciseData.name}</TypographySpan>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}