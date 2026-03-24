import AnalyticsDashboard from "@/components/trainer/analytics";
import PageTitle from "@/components/core/page-title";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function TrainerAnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Analytics" description="Acompanhe a atividade dos seus alunos" />
      <Suspense fallback={<Spinner className="size-8" />}>
        <AnalyticsDashboard />
      </Suspense>
    </div>
  );
}
