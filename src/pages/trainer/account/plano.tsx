import UpgradePlanDialog from "@/components/billing/upgrade-plan-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetApiBillingPlanSuspense } from "@/gen/hooks/useGetApiBillingPlanSuspense";
import { useState } from "react";

const PLAN_LABELS: Record<string, string> = {
	free: "Grátis",
	starter: "Starter",
	pro: "Pro",
	elite: "Elite",
};

export function TrainerAccountPlanoPage() {
	const { data: billing } = useGetApiBillingPlanSuspense();
	const [upgradeOpen, setUpgradeOpen] = useState(false);

	const planLabel = PLAN_LABELS[billing.plan] ?? billing.plan;
	const isElite = billing.plan === "elite";
	const clientLimitText = isElite
		? `${billing.clientCount} alunos`
		: `${billing.clientCount} de ${billing.clientLimit} alunos`;

	return (
		<>
			<UpgradePlanDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />

			<div className="space-y-2">
				<h1 className="text-2xl font-bold">Plano</h1>
				<p className="text-sm text-muted-foreground">
					Seu plano atual e upgrade de assinatura.
				</p>
			</div>

			<div className="mt-6 flex max-w-xl flex-col gap-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium">Plano atual</span>
						<span className="text-sm text-muted-foreground">
							{planLabel} · {clientLimitText}
						</span>
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => setUpgradeOpen(true)}
					>
						Fazer upgrade
					</Button>
				</div>
				<Separator />
			</div>
		</>
	);
}
