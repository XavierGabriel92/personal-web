import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Workout } from "@/schemas";
import { DragDropContext, Draggable, type DropResult, Droppable } from '@hello-pangea/dnd';
import { useNavigate } from "@tanstack/react-router";
import { GripVerticalIcon } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { Copy, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import WorkoutCollapsible from "../collapsible/workout";

interface WorkoutListDraggableProps {
  workouts: Workout[];
}

export default function WorkoutListDraggable({ workouts }: WorkoutListDraggableProps) {
  const [items, setItems] = useState(workouts);

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
      <Droppable droppableId="droppable-list">
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
                        <WorkoutCollapsible workout={item} actions={<WorkoutActions workout={item} />} />
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


function DeleteWorkoutDialog({
  workout,
  open,
  onOpenChange,
  onConfirm,
}: {
  workout: Workout;
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
          <AlertDialogTitle>Deletar treino</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar o treino "{workout.name}"? Esta ação não pode ser desfeita.
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

function WorkoutActions({ workout }: { workout: Workout }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate({ to: "/trainer/workouts/$workoutId", params: { workoutId: workout.id } });
  };

  const handleDelete = () => {
    console.log("Deleting workout:", workout.id);
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
            <Pencil className="mr-2 h-4 w-4" />
            Editar treino
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            Copiar o programa
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
            Deletar o treino
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteWorkoutDialog
        workout={workout}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}