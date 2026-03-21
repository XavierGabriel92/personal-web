import TrainerFeed from "@/components/activities/trainer-feed";
import CreateClientSheet from "@/components/clients/sheet/create-client";
import OnboardingChecklist from "@/components/trainer/home/onboarding-checklist";
import StatsCards from "@/components/trainer/home/stats-cards";
import WeeklyActiveChart from "@/components/trainer/home/weekly-active-chart";
import { useCachedSession } from "@/hooks/auth";

export default function TrainerHome() {
  const { data: session } = useCachedSession();

  const firstName = session?.user?.name?.split(" ")[0] ?? "Trainer";

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Olá, {firstName} 👋</h1>
          <p className="text-sm text-muted-foreground">
            Veja um resumo do progresso dos seus alunos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateClientSheet />
        </div>
      </div>

      <OnboardingChecklist />

      <StatsCards />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
        <div className="md:col-span-2">
          <TrainerFeed />
        </div>
        <div className="md:col-span-3">
          <WeeklyActiveChart />
        </div>
      </div>
    </div>
  );
}
