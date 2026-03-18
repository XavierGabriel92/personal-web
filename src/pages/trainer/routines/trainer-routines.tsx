import TrainerProgramList from "@/components/routine/list/trainer";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function TrainerProgramsPage() {
  return (
    <Suspense
      fallback={
        <Spinner className="size-8" />
      }
    >
      <TrainerProgramList />
    </Suspense>
  );
}