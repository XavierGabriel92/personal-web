import { ClientPageContainer } from "@/components/client/page-container";
import { ClientScreenHeader } from "@/components/client/screen-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { TypographyH4, TypographyP, TypographySpanXSmall } from "@/components/ui/typography";
import { useDebounce } from "@/components/ui/multi-select";
import { useGetApiExercisesFiltersSuspense } from "@/gen/hooks/useGetApiExercisesFiltersSuspense";
import { usePostApiExercisesSearch } from "@/gen/hooks/usePostApiExercisesSearch";
import type { PostApiExercisesSearch200 } from "@/gen/types/PostApiExercisesSearch";
import { getErrorMessage } from "@/lib/client-portal";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 15;

interface ClientSelectExercisePageProps {
	replaceExerciseId?: string;
}

export default function ClientSelectExercisePage({
	replaceExerciseId,
}: ClientSelectExercisePageProps) {
	const navigate = useNavigate();
	const { data: filters } = useGetApiExercisesFiltersSuspense();
	const { mutateAsync: searchExercises } = usePostApiExercisesSearch();

	const [search, setSearch] = useState("");
	const [selectedEquipment, setSelectedEquipment] = useState("all");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [results, setResults] = useState<PostApiExercisesSearch200["exercises"]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const debouncedSearch = useDebounce(search, 500);
	const sentinelRef = useRef<HTMLDivElement>(null);
	const latestRequestIdRef = useRef(0);
	const isMountedRef = useRef(true);

	useEffect(() => {
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const runSearch = useCallback(
		async (nextPage: number, append: boolean) => {
			const requestId = latestRequestIdRef.current + 1;
			latestRequestIdRef.current = requestId;

			if (append) {
				setIsLoadingMore(true);
			} else {
				setIsInitialLoading(true);
			}

			try {
				const response = await searchExercises({
					data: {
						name: debouncedSearch.trim() || undefined,
						equipment:
							selectedEquipment === "all" ? undefined : [selectedEquipment],
						categories:
							selectedCategory === "all" ? undefined : [selectedCategory],
						page: nextPage,
						limit: PAGE_SIZE,
					},
				});

				if (
					!isMountedRef.current ||
					requestId !== latestRequestIdRef.current
				) {
					return;
				}

				setResults((current) =>
					append ? [...current, ...response.exercises] : response.exercises,
				);
				setPage(response.pagination.page);
				setTotalPages(response.pagination.totalPages);
			} catch (error) {
				if (
					!isMountedRef.current ||
					requestId !== latestRequestIdRef.current
				) {
					return;
				}

				toast.error(
					getErrorMessage(error, "Não foi possível carregar os exercícios."),
				);
			} finally {
				if (
					isMountedRef.current &&
					requestId === latestRequestIdRef.current
				) {
					if (append) {
						setIsLoadingMore(false);
					} else {
						setIsInitialLoading(false);
					}
				}
			}
		},
		[debouncedSearch, searchExercises, selectedCategory, selectedEquipment],
	);

	useEffect(() => {
		setResults([]);
		setPage(1);
		setTotalPages(1);
		setIsLoadingMore(false);
		void runSearch(1, false);
	}, [runSearch]);

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (
					entry.isIntersecting &&
					!isInitialLoading &&
					!isLoadingMore &&
					page < totalPages
				) {
					void runSearch(page + 1, true);
				}
			},
			{
				rootMargin: "0px 0px 120px 0px",
				threshold: 0.1,
			},
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [isInitialLoading, isLoadingMore, page, runSearch, totalPages]);

	return (
		<div className="min-h-svh bg-background">
			<ClientScreenHeader title="Selecionar exercício" />
			<ClientPageContainer withBottomNav={false}>
				<div className="space-y-4">
					<div className="space-y-4">
						<Input
							placeholder="Buscar exercício"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
						/>
						<div className="grid grid-cols-2 gap-2">
							<Select
								value={selectedEquipment}
								onValueChange={setSelectedEquipment}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Equipamento" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Todos os equipamentos</SelectItem>
									{filters.equipment.map((equipment) => (
										<SelectItem key={equipment} value={equipment}>
											{equipment}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select value={selectedCategory} onValueChange={setSelectedCategory}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Categoria" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Todas as categorias</SelectItem>
									{filters.categories.map((category) => (
										<SelectItem key={category} value={category}>
											{category}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						{isInitialLoading ? (
							<div className="flex items-center justify-center gap-2 py-8">
								<Spinner className="size-5" />
								<TypographyP className="text-muted-foreground">
									Carregando exercícios...
								</TypographyP>
							</div>
						) : results.length === 0 ? (
							<div className="rounded-lg border border-dashed px-4 py-8 text-center">
								<TypographyP className="text-muted-foreground">
									Nenhum exercício encontrado.
								</TypographyP>
							</div>
						) : (
							results.map((exercise) => (
								<Button
									key={exercise.id}
									variant="outline"
									className="h-auto w-full justify-between py-4"
									onClick={() =>
										navigate({
											to: "/client/sessions/active",
											search: {
												addedExerciseId: exercise.id,
												addedExerciseName: exercise.name,
												addedExerciseImgSrc: exercise.imgSrc ?? undefined,
												replaceExerciseId,
											},
										})
									}
								>
									<div className="flex min-w-0 items-center gap-4 text-left">
										<Avatar className="size-10">
											<AvatarImage
												src={exercise.imgSrc ?? undefined}
												alt={exercise.name}
											/>
											<AvatarFallback>
												{exercise.name.slice(0, 2).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="min-w-0">
											<TypographyH4 className="truncate">
												{exercise.name}
											</TypographyH4>
											<TypographyP className="truncate text-muted-foreground">
												{exercise.primaryMuscle} · {exercise.equipment}
											</TypographyP>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<TypographySpanXSmall className="text-muted-foreground">
											Adicionar
										</TypographySpanXSmall>
										<Plus className="size-4" />
									</div>
								</Button>
							))
						)}
						{isLoadingMore ? <Spinner className="mx-auto size-5" /> : null}
						<div ref={sentinelRef} />
					</div>
				</div>
			</ClientPageContainer>
		</div>
	);
}
