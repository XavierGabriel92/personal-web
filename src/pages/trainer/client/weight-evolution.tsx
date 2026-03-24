import { Spinner } from "@/components/ui/spinner";
import WeightEvolution from "@/components/workout-history/weight-evolution";
import { Suspense } from "react";

interface WeightEvolutionPageProps {
  clientId: string;
}

export default function WeightEvolutionPage({ clientId }: WeightEvolutionPageProps) {
  return (
    <Suspense fallback={<Spinner className="size-6" />}>
      <WeightEvolution clientId={clientId} />
    </Suspense>
  );
}
