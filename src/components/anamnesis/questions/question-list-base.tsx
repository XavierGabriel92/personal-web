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
import { Input } from "@/components/ui/input";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import {
	DragDropContext,
	Draggable,
	type DropResult,
	Droppable,
} from "@hello-pangea/dnd";
import { GripVerticalIcon, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type QuestionItem = {
	id: string;
	text: string;
};

interface QuestionListBaseProps<TQuestion extends QuestionItem> {
	questions: TQuestion[];
	onAddQuestion: (text: string) => Promise<void>;
	onDeleteQuestion: (question: TQuestion) => Promise<void>;
	onReorderQuestions: (
		questions: { id: string; order: number }[],
		nextItems: TQuestion[],
	) => Promise<void>;
	addButtonLabel?: string;
	emptyMessage?: string;
	isAddingDisabled?: boolean;
}

export default function QuestionListBase<TQuestion extends QuestionItem>({
	questions,
	onAddQuestion,
	onDeleteQuestion,
	onReorderQuestions,
	addButtonLabel = "Adicionar pergunta",
	emptyMessage = "Nenhuma pergunta adicionada ainda",
	isAddingDisabled = false,
}: QuestionListBaseProps<TQuestion>) {
	const [items, setItems] = useState(questions);
	const [newQuestionText, setNewQuestionText] = useState("");
	const [isAdding, setIsAdding] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setItems(questions);
	}, [questions]);

	const onDragEnd = async (result: DropResult) => {
		if (!result.destination) return;

		const previousItems = items;
		const nextItems = Array.from(items);
		const [reorderedItem] = nextItems.splice(result.source.index, 1);
		nextItems.splice(result.destination.index, 0, reorderedItem);

		setItems(nextItems);

		try {
			await onReorderQuestions(
				nextItems.map((question, index) => ({ id: question.id, order: index })),
				nextItems,
			);
		} catch {
			setItems(previousItems);
		}
	};

	const handleAddQuestion = async () => {
		const text = newQuestionText.trim();
		if (!text || isSubmitting) return;

		setIsSubmitting(true);

		try {
			await onAddQuestion(text);
			setNewQuestionText("");
			setIsAdding(false);
		} finally {
			setIsSubmitting(false);
		}
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
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							className="w-full max-w-3xl"
						>
							{items.length === 0 && !isAdding && (
								<div className="px-4 py-6 text-center text-muted-foreground text-sm">
									{emptyMessage}
								</div>
							)}

							{items.map((question, index) => (
								<Draggable
									key={question.id}
									draggableId={question.id}
									index={index}
								>
									{(draggableProvided) => (
										<QuestionRow
											question={question}
											provided={draggableProvided}
											onDeleteQuestion={onDeleteQuestion}
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
										disabled={isSubmitting || isAddingDisabled}
										className="h-8 flex-1 border-0 p-0 shadow-none focus-visible:ring-0"
									/>
									<Button
										size="sm"
										onClick={handleAddQuestion}
										disabled={
											isSubmitting ||
											isAddingDisabled ||
											!newQuestionText.trim()
										}
									>
										{isSubmitting ? "Salvando..." : "Salvar"}
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
					disabled={isAddingDisabled}
					className="text-muted-foreground transition-colors hover:text-foreground"
				>
					<Plus className="h-4 w-4 text-primary" />
					{addButtonLabel}
				</Button>
			)}
		</div>
	);
}

function QuestionRow<TQuestion extends QuestionItem>({
	question,
	provided,
	onDeleteQuestion,
}: {
	question: TQuestion;
	provided: Parameters<Parameters<typeof Draggable>[0]["children"]>[0];
	onDeleteQuestion: (question: TQuestion) => Promise<void>;
}) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const handleDelete = async () => {
		await onDeleteQuestion(question);
	};

	return (
		<>
			<div
				ref={provided.innerRef}
				{...provided.draggableProps}
				className="group flex items-center gap-1"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div
					{...provided.dragHandleProps}
					className="cursor-grab p-1 text-muted-foreground active:cursor-grabbing"
				>
					<GripVerticalIcon className="h-4 w-4" />
				</div>
				<div className="flex flex-1 items-center gap-2 border-b py-2 pl-2">
					<TypographyP className="flex-1 text-sm">{question.text}</TypographyP>
					<Button
						variant="ghost"
						size="icon"
						color="destructive"
						onClick={() => setDeleteDialogOpen(true)}
						aria-label="Remover pergunta"
						className={cn(
							isHovered ? "opacity-100" : "pointer-events-none opacity-0",
						)}
					>
						<Trash2 className="h-4 w-4 text-destructive" />
					</Button>
				</div>
			</div>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remover pergunta</AlertDialogTitle>
						<AlertDialogDescription>
							Tem certeza que deseja remover a pergunta "{question.text}"? Esta
							ação não pode ser desfeita.
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
