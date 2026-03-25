import UpgradePlanDialog from "@/components/billing/upgrade-plan-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSidebar } from "@/components/ui/sidebar";
import { TypographyP } from "@/components/ui/typography";
import { useGetApiBillingPlanSuspense } from "@/gen/hooks/useGetApiBillingPlanSuspense";
import { Suspense, useState } from "react";

function getUpgradeCopy(used: number, limit: number): string {
	const pct = used / limit;
	if (pct >= 1) return "Você atingiu o limite do seu plano.";
	if (pct >= 0.8) return "Quase no limite — faça upgrade para continuar crescendo.";
	if (pct >= 0.5) return `${limit - used} alunos restantes no seu plano atual.`;
	return "Faça upgrade para adicionar mais alunos.";
}

function NavPlanContent() {
	const { open } = useSidebar();
	const [upgradeOpen, setUpgradeOpen] = useState(false);
	const { data } = useGetApiBillingPlanSuspense();

	if (!open) return null;

	const isElite = data.plan === "elite";

	if (isElite) {
		return (
			<div className="bg-muted p-4 rounded-md space-y-1">
				<TypographyP className="text-xs font-medium">Elite</TypographyP>
				<TypographyP className="text-xs text-muted-foreground">
					{data.clientCount} alunos cadastrados
				</TypographyP>
			</div>
		);
	}

	const limit = data.clientLimit ?? 0;
	const used = data.clientCount;
	const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
	const copy = getUpgradeCopy(used, limit);

	return (
		<>
			<UpgradePlanDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
			<div className="bg-muted p-4 rounded-md space-y-4">
				<div className="space-y-1">
					<TypographyP className="text-xs font-medium leading-snug">
						{copy}
					</TypographyP>
					<TypographyP className="text-xs text-muted-foreground">
						{used} de {limit} alunos
					</TypographyP>
				</div>

				<Progress value={pct} className="h-1.5" />

				<Button
					variant="default"
					size="sm"
					className="w-full"
					onClick={() => setUpgradeOpen(true)}
				>
					Fazer upgrade
				</Button>
			</div>
		</>
	);
}

export function NavPlan() {
	return (
		<Suspense fallback={null}>
			<NavPlanContent />
		</Suspense>
	);
}
