import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TypographyH5, TypographySpan, TypographySpanXSmall } from "@/components/ui/typography";
import { formatRelativeDate } from "@/lib/date";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface Set {
  type: string;
  reps: number;
  weight: number;
  restTime: number;
}

interface Exercise {
  id: string;
  name: string;
  img: string;
  sets: Set[];
}

interface Session {
  id: string;
  workoutName?: string;
  completedAt?: string;
  createdAt: string;
  startedAt: string;
  exercises?: {
    exerciseId: string;
    exerciseName: string;
    thumbnailUrl?: string;
    sets: { reps: number; weight_kg: number }[];
    notes?: string;
  }[];
}

interface SessionCardProps {
  session: Session;
}

export default function SessionCard({ session }: SessionCardProps) {
  const finishedAt = session.completedAt ?? session.createdAt;
  const duration =
    session.completedAt && session.startedAt
      ? Math.round(
          (new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()) / 60000
        )
      : 0;
  const exercises: Exercise[] = (session.exercises ?? []).map((ex) => ({
    id: ex.exerciseId,
    name: ex.exerciseName,
    img: ex.thumbnailUrl ?? "",
    sets: ex.sets.map((s) => ({
      type: "-",
      reps: s.reps,
      weight: s.weight_kg,
      restTime: 0,
    })),
  }));
  const volume = (session.exercises ?? []).reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + set.reps * set.weight_kg, 0),
    0
  );

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex gap-2 items-center">
          <TypographyH5 className="font-medium">{session.workoutName ?? "Treino livre"}</TypographyH5>
          <TypographySpanXSmall className="text-muted-foreground">Feito {formatRelativeDate(finishedAt)}</TypographySpanXSmall>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <TypographySpanXSmall className="text-muted-foreground">Duração</TypographySpanXSmall>
            <TypographySpan className="font-medium">{duration}min</TypographySpan>
          </div>
          <div className="flex flex-col gap-2">
            <TypographySpanXSmall className="text-muted-foreground">Volume</TypographySpanXSmall>
            <TypographySpan className="font-medium">{volume}kg</TypographySpan>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 border-t pt-4">
        <TypographyH5 className="font-medium">Exercícios</TypographyH5>
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </CardContent>
    </Card>
  );
}

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={exercise.img} alt={exercise.name} />
          <AvatarFallback>{exercise.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <TypographySpan>{exercise.name}</TypographySpan>
        <CollapsibleTrigger>
          <Button variant="ghost" size="icon-sm">
            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Série</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Peso</TableHead>
              <TableHead>Reps</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercise.sets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhuma série realizada para o exercício {exercise.name}
                </TableCell>
              </TableRow>
            ) : (
              exercise.sets.map((set, index) => (
                <TableRow key={`${exercise.id}-${index}`} className="hover:bg-muted">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{set.type}</TableCell>
                  <TableCell>{set.weight}kg</TableCell>
                  <TableCell>{set.reps}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CollapsibleContent>
    </Collapsible>
  );
}
