import { Spinner } from "@/components/ui/spinner";
import SessionCard from "@/components/workout-history/session-card";
import { getApiSessionsClientByClientId } from "@/gen/clients/getApiSessionsClientByClientId";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const PAGE_SIZE = 10;

interface WorkoutHistoryListProps {
  clientId: string;
}

export default function WorkoutHistoryList({ clientId }: WorkoutHistoryListProps) {
  const now = new Date();
  const since = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString();
  const until = now.toISOString();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ["sessions", clientId, since, until],
    queryFn: ({ pageParam: _pageParam }) =>
      getApiSessionsClientByClientId(clientId, { since, until }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.sessions.length < PAGE_SIZE) return undefined;
      return allPages.flatMap((p) => p.sessions).length;
    },
    initialPageParam: 0,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, { threshold: 0.1 });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sessions = data.pages.flatMap((p) => p.sessions);

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
      {isFetchingNextPage && <Spinner className="size-5 my-2 mx-auto" />}
      <div ref={sentinelRef} />
    </div>
  );
}
