import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { getApiActivitiesClientByClientId } from "@/gen/clients/getApiActivitiesClientByClientId";
import { getApiActivitiesTrainer } from "@/gen/clients/getApiActivitiesTrainer";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useRef, useState } from "react";
import type { WeightAddedData, WorkoutFinishedData } from "./schemas";
import WeightAdded from "./weight-added";
import WorkoutFinished from "./workout-finished";

const PAGE_SIZE = 15;

type Activity = {
  id: string;
  clientName: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

function ActivityList({ activities, fetchNextPage, hasNextPage, isFetchingNextPage }: {
  activities: Activity[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, { threshold: 0.1 });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex-1 overflow-y-auto px-4 gap-4 flex flex-col">
      {activities.map((activity) => {
        switch (activity.type) {
          case "WORKOUT_COMPLETED":
            return (
              <WorkoutFinished
                key={activity.id}
                clientName={activity.clientName}
                data={activity.payload as WorkoutFinishedData}
                createdAt={activity.createdAt}
              />
            );
          case "WEIGHT_LOGGED":
            return (
              <WeightAdded
                key={activity.id}
                clientName={activity.clientName}
                data={activity.payload as WeightAddedData}
                createdAt={activity.createdAt}
              />
            );
          default:
            return null;
        }
      })}
      {isFetchingNextPage && <Spinner className="size-5 my-2" />}
      <div ref={sentinelRef} />
    </div>
  );
}

function ClientActivitiesContent({ clientId }: { clientId: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ["activities-all", clientId],
    queryFn: ({ pageParam }) =>
      getApiActivitiesClientByClientId(clientId, { limit: PAGE_SIZE, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.activities.length < PAGE_SIZE) return undefined;
      return allPages.flatMap((p) => p.activities).length;
    },
    initialPageParam: 0,
  });

  return (
    <ActivityList
      activities={data.pages.flatMap((p) => p.activities)}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}

function TrainerActivitiesContent() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ["activities-all-trainer"],
    queryFn: ({ pageParam }) =>
      getApiActivitiesTrainer({ limit: PAGE_SIZE, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.activities.length < PAGE_SIZE) return undefined;
      return allPages.flatMap((p) => p.activities).length;
    },
    initialPageParam: 0,
  });

  return (
    <ActivityList
      activities={data.pages.flatMap((p) => p.activities)}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}

function ActivitiesSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="link">
          Ver todas
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Histórico de Atividades</SheetTitle>
        </SheetHeader>
        <Suspense fallback={<Spinner className="size-8" />}>
          {open && children}
        </Suspense>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

interface AllActivitiesSheetProps {
  clientId: string;
}

export default function AllActivitiesSheet({ clientId }: AllActivitiesSheetProps) {
  return (
    <ActivitiesSheet>
      <ClientActivitiesContent clientId={clientId} />
    </ActivitiesSheet>
  );
}

export function AllTrainerActivitiesSheet() {
  return (
    <ActivitiesSheet>
      <TrainerActivitiesContent />
    </ActivitiesSheet>
  );
}
