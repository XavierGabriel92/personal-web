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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Download, ListTree } from "lucide-react";

// Types
export interface Category {
	value: string;
	label: string;
}

export interface HomugProgramExercise {
	name: string;
	order: number;
	setsLabel: string;
	category?: string;
}

export interface HomugProgramWorkout {
	id: string;
	name: string;
	exercises: HomugProgramExercise[];
}

export interface HomugProgram {
	id: string;
	title: string;
	notes: string;
	duration: number;
	category: string;
	categoryLabel: string;
	workouts: HomugProgramWorkout[];
}

function formatExerciseSetsLabel(
	sets: Array<{ reps?: number | undefined }>,
): string {
	if (sets.length === 0) return "";
	const reps = sets.map((s) => s.reps);
	const first = reps[0];
	const uniform =
		first !== undefined && reps.every((r) => r === first && r !== undefined);
	if (uniform) {
		return `${sets.length} × ${first} repetições`;
	}
	return `${sets.length} séries`;
}

export function mapApiWorkoutToHomugWorkout(workout: {
	id: string;
	name: string;
	exercises?: Array<{
		order: number;
		sets: Array<{ reps?: number | undefined }>;
		exerciseData: { name: string; category: string };
	}>;
}): HomugProgramWorkout {
	const raw = workout.exercises ?? [];
	const exercises: HomugProgramExercise[] = [...raw]
		.sort((a, b) => a.order - b.order)
		.map((ex) => ({
			name: ex.exerciseData.name,
			order: ex.order,
			setsLabel: formatExerciseSetsLabel(ex.sets),
			category: ex.exerciseData.category,
		}));
	return {
		id: workout.id,
		name: workout.name,
		exercises,
	};
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
									selectedCategory === category.value &&
										"bg-secondary text-secondary-foreground",
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

interface ProgramDetailsDialogProps {
	program: HomugProgram | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAddToLibrary?: (programId: string) => void;
	isLoading?: boolean;
}

export function ProgramDetailsDialog({
	program,
	open,
	onOpenChange,
	onAddToLibrary,
	isLoading,
}: ProgramDetailsDialogProps) {
	if (!program) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={cn(
					"flex max-h-[90dvh] flex-col gap-0 overflow-hidden p-6 sm:max-w-2xl",
					"max-sm:h-full max-sm:max-h-full",
				)}
				showCloseButton
			>
				<DialogHeader className="shrink-0 gap-2 space-y-0 pr-8 text-left">
					<div className="flex flex-wrap items-center gap-2">
						<DialogTitle className="flex-1 min-w-0 text-left">
							{program.title}
						</DialogTitle>
						<Badge variant="secondary">{program.categoryLabel}</Badge>
					</div>
					<DialogDescription>
						Duração sugerida: {program.duration} semanas.
					</DialogDescription>
					{program.notes ? (
						<p className="text-muted-foreground text-sm text-left">
							{program.notes}
						</p>
					) : null}
				</DialogHeader>

				<div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain py-4 pr-1">
					<div className="flex flex-col gap-4">
						{program.workouts.map((workout, index) => (
							<div key={workout.id}>
								{index > 0 ? <Separator className="mb-4" /> : null}
								<div className="flex flex-col gap-2">
									<p className="font-medium text-foreground">{workout.name}</p>
									{workout.exercises.length === 0 ? (
										<p className="text-muted-foreground text-sm">
											Nenhum exercício neste treino.
										</p>
									) : (
										<ul className="flex flex-col gap-2">
											{workout.exercises.map((ex) => (
												<li
													key={`${workout.id}-${ex.order}-${ex.name}`}
													className="text-muted-foreground text-sm flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
												>
													<span className="text-foreground">
														{ex.order + 1}. {ex.name}
													</span>
													<span className="shrink-0 sm:text-right">
														{ex.setsLabel}
														{ex.category ? (
															<span className="text-muted-foreground">
																{" "}
																· {ex.category}
															</span>
														) : null}
													</span>
												</li>
											))}
										</ul>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				<DialogFooter className="shrink-0 gap-2 border-border border-t pt-4 mt-0 sm:justify-end">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Fechar
					</Button>
					<Button
						type="button"
						className="h-auto min-h-9 whitespace-normal py-2"
						onClick={() => onAddToLibrary?.(program.id)}
						disabled={isLoading}
					>
						<Download className="shrink-0" />
						<span className="text-balance">
							{isLoading ? "Adicionando..." : "Adicionar aos meus programas"}
						</span>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// Programs List Component
interface ProgramsListProps {
	programs: HomugProgram[];
	onAddToLibrary?: (programId: string) => void;
	onViewDetails?: (program: HomugProgram) => void;
	loadingId?: string | null;
}

export function ProgramsList({
	programs,
	onAddToLibrary,
	onViewDetails,
	loadingId,
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
						onViewDetails={onViewDetails}
						isLoading={loadingId === program.id}
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
	onViewDetails?: (program: HomugProgram) => void;
	isLoading?: boolean;
}

function ProgramCard({
	program,
	onAddToLibrary,
	onViewDetails,
	isLoading,
}: ProgramCardProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 min-w-0">
						<div className="flex flex-wrap items-center gap-2">
							<CardTitle>{program.title}</CardTitle>
							<Badge variant="outline">{program.categoryLabel}</Badge>
						</div>
						<CardDescription className="mt-2">{program.notes}</CardDescription>
						<p className="text-muted-foreground text-sm mt-2">
							Duração: {program.duration} semanas
						</p>
					</div>
					<div className="hidden lg:flex shrink-0 flex-col gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onViewDetails?.(program)}
						>
							<ListTree />
							Ver detalhes
						</Button>
						<Button
							type="button"
							onClick={() => onAddToLibrary?.(program.id)}
							disabled={isLoading}
						>
							<Download />
							{isLoading ? "Adicionando..." : "Adicionar aos meus programas"}
						</Button>
					</div>
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
			<CardFooter className="lg:hidden flex flex-col gap-2">
				<Button
					type="button"
					variant="outline"
					className="w-full"
					onClick={() => onViewDetails?.(program)}
				>
					<ListTree />
					Ver detalhes
				</Button>
				<Button
					type="button"
					className="w-full"
					onClick={() => onAddToLibrary?.(program.id)}
					disabled={isLoading}
				>
					<Download />
					{isLoading ? "Adicionando..." : "Adicionar aos meus programas"}
				</Button>
			</CardFooter>
		</Card>
	);
}
