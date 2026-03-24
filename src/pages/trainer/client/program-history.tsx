import ProgramHistory from "@/components/clients/program-history";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

interface ProgramHistoryPageProps {
  clientId: string;
}

export default function ProgramHistoryPage({ clientId }: ProgramHistoryPageProps) {
  return (
    <Suspense fallback={<Spinner className="size-6" />}>
      <ProgramHistory clientId={clientId} />
    </Suspense>
  );
}
