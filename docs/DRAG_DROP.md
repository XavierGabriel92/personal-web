# Drag & Drop

This document describes drag and drop patterns using @hello-pangea/dnd.

For general architecture patterns, see [ARCHITECTURE.md](../ARCHITECTURE.md).

## @hello-pangea/dnd

The application uses `@hello-pangea/dnd` (React DnD fork) for drag and drop functionality.

## Basic Implementation

```typescript
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

function DraggableList({ items, onDragEnd }: Props) {
  const [localItems, setLocalItems] = useState(items);
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const newItems = Array.from(localItems);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    
    setLocalItems(newItems);
    onDragEnd(newItems); // Callback to parent
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable-list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {localItems.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
```

## Exercise List Draggable

Example from the codebase:

```typescript
// src/components/exercise/list/draggable.tsx
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { GripVerticalIcon } from "lucide-react";

export default function ExerciseListDraggable({
  exercises,
  workoutId,
  onDelete,
  onDrag,
  onUpdate,
  onExerciseFormChange,
}: ExerciseListDraggableProps) {
  const [items, setItems] = useState(exercises);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    
    setItems(newItems);
    if (onDrag) {
      onDrag(newItems);
    }
  };

  useEffect(() => {
    setItems(exercises);
  }, [exercises]);

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
                        <ExerciseCollapsible
                          workoutId={workoutId}
                          exercise={item}
                          actions={<ExerciseActions />}
                        />
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
  );
}
```

## Optimistic Updates with Drag & Drop

Combine drag and drop with optimistic updates:

```typescript
import { useQueryClient } from "@tanstack/react-query";
import { getApiWorkoutByIdSuspenseQueryKey } from "@/gen";
import { toast } from "sonner";

const handleDrag = (reorderedItems: WorkoutExercise[]) => {
  const queryKey = getApiWorkoutByIdSuspenseQueryKey(workoutId);
  const oldData = queryClient.getQueryData(queryKey);
  
  // Optimistically update cache
  queryClient.setQueryData(queryKey, (old) => ({
    ...old,
    exercises: reorderedItems,
  }));
  
  // Transform to API format
  const exerciseWorkoutsData = reorderedItems.map((item, index) => ({
    id: item.id,
    order: index,
  }));
  
  // Call API
  reorderExercises(
    { data: { exerciseWorkouts: exerciseWorkoutsData } },
    {
      onSuccess: (response) => {
        queryClient.setQueryData(queryKey, response);
        toast.success("Order updated!");
      },
      onError: () => {
        // Rollback on error
        queryClient.setQueryData(queryKey, oldData);
        toast.error("Failed to update order");
      },
    }
  );
};
```

## Workout List Draggable

Example for workout reordering:

```typescript
function WorkoutListDraggable({ workouts, onDrag }: Props) {
  const [items, setItems] = useState(workouts);
  const navigate = useNavigate();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    onDrag(newItems);
    setItems(newItems);
  };

  useEffect(() => {
    setItems(workouts);
  }, [workouts]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
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
                    <Card className="w-full cursor-pointer" onClick={() => navigate({ to: `/trainer/workouts/${item.id}` })}>
                      <CardContent>
                        <WorkoutCollapsible workout={item} />
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
  );
}
```

## Best Practices

- ✅ Use unique `draggableId` (item.id)
- ✅ Keep local state synchronized with props using `useEffect`
- ✅ Handle `null` destination (drag cancelled)
- ✅ Provide visual feedback (grab cursor, drag handle)
- ✅ Use optimistic updates for better UX
- ✅ Rollback on API error
- ✅ Show toast notifications for success/error
- ✅ Use `provided.placeholder` for spacing
- ✅ Separate drag handle from draggable content
- ✅ Use `GripVerticalIcon` or similar for drag handle
- ✅ Keep drag and drop logic in separate components

