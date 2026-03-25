import TrainerAnamnesisList from "@/components/anamnesis/list/trainer";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function TrainerAnamnesisPage() {
  return (
    <Suspense fallback={<Spinner className="size-8" />}>
      <TrainerAnamnesisList />
    </Suspense>
  );
}
