import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { TypographyP } from "@/components/ui/typography";
import { useDeleteApiAnamnesisByIdQuestionsByQuestionId } from "@/gen/hooks/useDeleteApiAnamnesisByIdQuestionsByQuestionId";
import { getApiAnamnesisByIdSuspenseQueryKey } from "@/gen/hooks/useGetApiAnamnesisByIdSuspense";
import { usePostApiAnamnesisByIdQuestions } from "@/gen/hooks/usePostApiAnamnesisByIdQuestions";
import { usePutApiAnamnesisByIdQuestionsReorder } from "@/gen/hooks/usePutApiAnamnesisByIdQuestionsReorder";
import { queryClient } from "@/routes/__root";
import type { AnamnesisQuestion } from "@/schemas";
import { DragDropContext, Draggable, type DropResult, Droppable } from "@hello-pangea/dnd";
import { GripVerticalIcon, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface QuestionListProps {
  anamnesisId: string;
  questions: AnamnesisQuestion[];
}

export default function QuestionList({ anamnesisId, questions }: QuestionListProps) {
  const [items, setItems] = useState(questions);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: addQuestion, isPending: isAddingQuestion } = usePostApiAnamnesisByIdQuestions();
  const { mutateAsync: deleteQuestion } = useDeleteApiAnamnesisByIdQuestionsByQuestionId();
  const { mutateAsync: reorderQuestions } = usePutApiAnamnesisByIdQuestionsReorder();

  useEffect(() => {
    setItems(questions);
  }, [questions]);

  const refreshQuestions = async () => {
    await queryClient.invalidateQueries({
      queryKey: getApiAnamnesisByIdSuspenseQueryKey(anamnesisId),
    });
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);

    await reorderQuestions(
      {
        id: anamnesisId,
        data: {
          questions: newItems.map((q, idx) => ({ id: q.id, order: idx })),
        },
      },
      {
        onSuccess: async () => {
          await refreshQuestions();
        },
        onError: () => {
          setItems(questions);
          toast.error("Erro ao reordenar perguntas. Tente novamente.");
        },
      }
    );
  };

  const handleAddQuestion = async () => {
    const text = newQuestionText.trim();
    if (!text) return;

    await addQuestion(
      { id: anamnesisId, data: { text } },
      {
        onSuccess: async () => {
          setNewQuestionText("");
          setIsAdding(false);
          await refreshQuestions();
          toast.success("Pergunta adicionada!");
        },
        onError: () => {
          toast.error("Erro ao adicionar pergunta. Tente novamente.");
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddQuestion();
    }
    if (e.key === "Escape") {
      setIsAdding(false);
      setNewQuestionText("");
    }
  };

  const startAdding = () => {
    setIsAdding(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="anamnesis-questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="w-full max-w-3xl">
              {items.length === 0 && !isAdding && (
                <div className="px-4 py-6 text-center text-muted-foreground text-sm">
                  Nenhuma pergunta adicionada ainda
                </div>
              )}
              {items.map((question, index) => (
                <Draggable key={question.id} draggableId={question.id} index={index}>
                  {(provided) => (
                    <QuestionRow
                      question={question}
                      anamnesisId={anamnesisId}
                      provided={provided}
                      onDeleted={refreshQuestions}
                      deleteQuestion={deleteQuestion}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {isAdding && (
                <div className="flex items-center gap-2 border-b py-2 pl-6 pr-3">
                  <Input
                    ref={inputRef}
                    placeholder="Digite a pergunta..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isAddingQuestion}
                    className="flex-1 h-8 border-0 shadow-none focus-visible:ring-0 p-0"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddQuestion}
                    disabled={isAddingQuestion || !newQuestionText.trim()}
                  >
                    {isAddingQuestion ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsAdding(false);
                      setNewQuestionText("");
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {!isAdding && (
        <Button
          variant="ghost"
          size="sm"
          onClick={startAdding}

          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-4 h-4 text-primary" />
          Adicionar pergunta
        </Button>
      )}
    </div>
  );
}

function QuestionRow({
  question,
  anamnesisId,
  provided,
  onDeleted,
  deleteQuestion,
}: {
  question: AnamnesisQuestion;
  anamnesisId: string;
  provided: Parameters<Parameters<typeof Draggable>[0]["children"]>[0];
  onDeleted: () => Promise<void>;
  deleteQuestion: ReturnType<typeof useDeleteApiAnamnesisByIdQuestionsByQuestionId>["mutateAsync"];
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = async () => {
    await deleteQuestion(
      { id: anamnesisId, questionId: question.id },
      {
        onSuccess: async () => {
          await onDeleted();
          toast.success("Pergunta removida!");
        },
        onError: () => {
          toast.error("Erro ao remover pergunta. Tente novamente.");
        },
      }
    );
  };

  return (
    <>
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        className="flex items-center gap-1 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          {...provided.dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-muted-foreground shrink-0 p-1"
        >
          <GripVerticalIcon className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2 flex-1 border-b py-2 pl-2">
          <TypographyP className="flex-1 text-sm">{question.text}</TypographyP>
          <Button
            variant="ghost"
            size="icon"
            color="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            aria-label="Remover pergunta"
            className={cn(
              isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover pergunta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a pergunta "{question.text}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
