import { ClientPageContainer } from "@/components/client/page-container";
import { ClientScreenHeader } from "@/components/client/screen-header";
import { Card, CardContent } from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { TypographyH4, TypographyP } from "@/components/ui/typography";
import { getApiClientMeActivities } from "@/gen/clients/getApiClientMeActivities";
import { formatRelativeDate } from "@/hooks/use-relative-date";
import { clientPortalQueryOptions } from "@/lib/client-query";
import type { ClientActivity } from "@/lib/client-portal";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Activity, Dumbbell, Scale, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

const PAGE_SIZE = 10;

function ActivityItem({ activity }: { activity: ClientActivity }) {
	if (activity.type === "WORKOUT_COMPLETED") {
		return (
			<Card>
				<CardContent className="flex items-center gap-4">
					<div className="flex size-10 items-center justify-center rounded-full bg-muted">
						<Dumbbell className="size-4 text-primary" />
					</div>
					<div className="min-w-0">
						<TypographyH4>
							Treino {activity.payload.workoutName ?? "Sem nome"} concluído
						</TypographyH4>
						<TypographyP className="text-muted-foreground">
							{activity.payload.duration}min · {activity.payload.series} séries ·{" "}
							{activity.payload.weight}kg
						</TypographyP>
						<TypographyP className="text-muted-foreground">
							{formatRelativeDate(activity.createdAt)}
						</TypographyP>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (activity.type === "WEIGHT_LOGGED") {
		return (
			<Card>
				<CardContent className="flex items-center gap-4">
					<div className="flex size-10 items-center justify-center rounded-full bg-muted">
						<Scale className="size-4 text-primary" />
					</div>
					<div className="min-w-0">
						<TypographyH4>Peso registrado: {activity.payload.weight}kg</TypographyH4>
						<TypographyP className="text-muted-foreground">
							{activity.payload.weightDifference}kg{" "}
							{activity.payload.direction === "down" ? "a menos" : "a mais"}
						</TypographyP>
						<TypographyP className="text-muted-foreground">
							{formatRelativeDate(activity.createdAt)}
						</TypographyP>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardContent className="flex items-center gap-4">
				<div className="flex size-10 items-center justify-center rounded-full bg-muted">
					<Sparkles className="size-4 text-primary" />
				</div>
				<div className="min-w-0">
					<TypographyH4>
						Novo programa atribuído: {activity.payload.routineName ?? "Sem nome"}
					</TypographyH4>
					<TypographyP className="text-muted-foreground">
						{formatRelativeDate(activity.createdAt)}
					</TypographyP>
				</div>
			</CardContent>
		</Card>
	);
}

export default function ClientActivitiesPage() {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSuspenseInfiniteQuery({
			queryKey: ["client-activities"],
			...clientPortalQueryOptions,
			queryFn: ({ pageParam }) =>
				getApiClientMeActivities({ limit: PAGE_SIZE, offset: pageParam }),
			getNextPageParam: (lastPage, allPages) => {
				if (lastPage.activities.length < PAGE_SIZE) {
					return undefined;
				}

				return allPages.flatMap((page) => page.activities).length;
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

	const activities = useMemo(
		() => data.pages.flatMap((page) => page.activities) as ClientActivity[],
		[data.pages],
	);

	return (
		<div className="min-h-svh bg-background">
			<ClientScreenHeader title="Atividades" />
			<ClientPageContainer withBottomNav={false}>
				{activities.length === 0 ? (
					<Empty className="border">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Activity className="size-4" />
							</EmptyMedia>
							<EmptyTitle>Nenhuma atividade recente</EmptyTitle>
							<EmptyDescription>
								As atividades do seu treino e progresso aparecerão aqui.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : (
					<div className="space-y-4">
						{activities.map((activity) => (
							<ActivityItem key={activity.id} activity={activity} />
						))}
						{isFetchingNextPage ? <Spinner className="mx-auto size-5" /> : null}
						<div ref={sentinelRef} />
					</div>
				)}
			</ClientPageContainer>
		</div>
	);
}
