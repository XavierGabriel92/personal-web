import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Exercise } from "@/schemas";
import { DragDropContext, Draggable, type DropResult, Droppable } from '@hello-pangea/dnd';
import { Copy, GripVerticalIcon, MoreVertical, Replace, Trash } from "lucide-react";
import { useState } from "react";
import ExerciseCollapsible from "../collapsible/exercise";

interface ExerciseListDraggableProps {
  exercises: Exercise[];
  workoutId: string;
}

export default function ExerciseListDraggable({ exercises, workoutId }: ExerciseListDraggableProps) {
  const [items, setItems] = useState(exercises);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-exercise-list">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="flex items-center w-full gap-1"
                  >
                    <div
                      {...provided.dragHandleProps}
                      className="cursor-grab active:cursor-grabbing text-muted-foreground"
                    >
                      <GripVerticalIcon className="w-4 h-4" />
                    </div>
                    <Card className="w-full">
                      <CardContent>
                        <ExerciseCollapsible workoutId={workoutId} exercise={item} actions={<ExerciseActions exercise={item} />} />
                      </CardContent>
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}


function DeleteExerciseDialog({
  exercise,
  open,
  onOpenChange,
  onConfirm,
}: {
  exercise: Exercise;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar exercício</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar o exercício "{exercise.name}"? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ExerciseActions({ exercise }: { exercise: Exercise }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    console.log("Editing exercise:", exercise.id);
  };

  const handleDelete = () => {
    console.log("Deleting exercise:", exercise.id);
  };

  const handleCopy = () => {
    console.log("Copying exercise:", exercise.id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleEdit}>
            <Replace className="mr-2 h-4 w-4" />
            Trocar exercício
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar exercício
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault();
              setDeleteDialogOpen(true);
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Deletar exercício
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteExerciseDialog
        exercise={exercise}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}

