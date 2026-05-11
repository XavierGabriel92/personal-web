import { ClientPageContainer } from "@/components/client/page-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TypographyH1, TypographyH4, TypographyP, TypographySpanXSmall } from "@/components/ui/typography";
import { getApiClientMeSessionsHistory } from "@/gen/clients/getApiClientMeSessionsHistory";
import { formatDuration, formatRelativeDate } from "@/hooks/use-relative-date";
import {
	type ClientSessionExerciseSummary,
	type ClientWorkoutSession,
	coerceHistoryResponse,
	getSessionVolume,
	getTotalSetCount,
} from "@/lib/client-portal";
import { clientPortalQueryOptions } from "@/lib/client-query";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { differenceInSeconds } from "date-fns";
import { ChevronDown, History } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const PAGE_SIZE = 10;

function SessionExerciseItem({
	exercise,
}: {
	exercise: ClientSessionExerciseSummary;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Collapsible open={open} onOpenChange={setOpen}>
			<CollapsibleTrigger className="w-full">
				<div className="flex items-center justify-between gap-4 py-2">
					<div className="flex min-w-0 items-center gap-4 text-left">
						<Avatar className="size-10">
							<AvatarImage src={exercise.imgSrc} alt={exercise.exerciseName} />
							<AvatarFallback>
								{exercise.exerciseName.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<TypographyP className="truncate font-medium">
							{exercise.exerciseName}
						</TypographyP>
					</div>
					<ChevronDown
						className={open ? "size-4 rotate-180 transition-transform" : "size-4 transition-transform"}
					/>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="pb-2">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-center">Série</TableHead>
							<TableHead className="text-center">Peso</TableHead>
							<TableHead className="text-center">Reps</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{exercise.sets.length === 0 ? (
							<TableRow>
								<TableCell className="text-center text-muted-foreground" colSpan={3}>
									Nenhuma série realizada.
								</TableCell>
							</TableRow>
						) : (
							exercise.sets.map((set, index) => (
								<TableRow key={`${exercise.exerciseId}-${index}`}>
									<TableCell className="text-center">{index + 1}</TableCell>
									<TableCell className="text-center">{set.weight_kg}kg</TableCell>
									<TableCell className="text-center">{set.reps}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</CollapsibleContent>
		</Collapsible>
	);
}

function WorkoutSessionCard({ session }: { session: ClientWorkoutSession }) {
	const exercises = session.exercises ?? [];
	const duration = session.completedAt
		? formatDuration(
				Math.max(
					0,
					differenceInSeconds(
						new Date(session.completedAt),
						new Date(session.startedAt),
					),
				),
			)
		: "—";

	return (
		<div className="rounded-xl border bg-card p-4 shadow-sm">
			<div className="space-y-4">
				<div className="space-y-1">
					<TypographyH4>{session.workoutName}</TypographyH4>
					{session.completedAt ? (
						<TypographyP className="text-muted-foreground">
							Feito {formatRelativeDate(session.completedAt)}
						</TypographyP>
					) : null}
				</div>

				<div className="grid grid-cols-3 gap-4">
					<div className="space-y-1">
						<TypographySpanXSmall className="text-muted-foreground">
							Duração
						</TypographySpanXSmall>
						<TypographyP className="font-medium">{duration}</TypographyP>
					</div>
					<div className="space-y-1">
						<TypographySpanXSmall className="text-muted-foreground">
							Volume
						</TypographySpanXSmall>
						<TypographyP className="font-medium">
							{getSessionVolume(exercises)}kg
						</TypographyP>
					</div>
					<div className="space-y-1">
						<TypographySpanXSmall className="text-muted-foreground">
							Séries
						</TypographySpanXSmall>
						<TypographyP className="font-medium">
							{getTotalSetCount(exercises)}
						</TypographyP>
					</div>
				</div>

				{exercises.length > 0 ? (
					<div className="space-y-2">
						{exercises.map((exercise) => (
							<SessionExerciseItem
								key={`${session.id}-${exercise.exerciseId}`}
								exercise={exercise}
							/>
						))}
					</div>
				) : null}
			</div>
		</div>
	);
}

export default function ClientHistoryPage() {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSuspenseInfiniteQuery({
			queryKey: ["client-session-history"],
			...clientPortalQueryOptions,
			queryFn: async ({ pageParam }) => {
				const response = await getApiClientMeSessionsHistory({
					limit: String(PAGE_SIZE),
					offset: String(pageParam),
				});

				return coerceHistoryResponse(response);
			},
			getNextPageParam: (lastPage, allPages) => {
				const sessions = lastPage.sessions ?? [];
				if (sessions.length < PAGE_SIZE) {
					return undefined;
				}

				return allPages.flatMap((page) => page.sessions ?? []).length;
			},
			initialPageParam: 0,
		});

	const sentinelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!sentinelRef.current) {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 0.1 },
		);

		observer.observe(sentinelRef.current);
		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	const sessions = useMemo(
		() => data.pages.flatMap((page) => page.sessions ?? []),
		[data.pages],
	);

	return (
		<ClientPageContainer>
			<div className="space-y-4">
				<TypographyH1 className="text-2xl">Histórico</TypographyH1>

				{sessions.length === 0 ? (
					<Empty className="border">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<History className="size-4" />
							</EmptyMedia>
							<EmptyTitle>Nenhum treino registrado ainda</EmptyTitle>
							<EmptyDescription>
								Assim que você concluir seu primeiro treino, ele aparecerá aqui.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent />
					</Empty>
				) : (
					<div className="space-y-4">
						{sessions.map((session) => (
							<WorkoutSessionCard key={session.id} session={session} />
						))}
						{isFetchingNextPage ? <Spinner className="mx-auto size-5" /> : null}
						<div ref={sentinelRef} />
					</div>
				)}
			</div>
		</ClientPageContainer>
	);
}
