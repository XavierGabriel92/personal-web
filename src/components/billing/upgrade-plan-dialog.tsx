import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { getApiBillingPlanSuspenseQueryKey } from "@/gen/hooks/useGetApiBillingPlanSuspense";
import { usePostApiBillingUpgrade } from "@/gen/hooks/usePostApiBillingUpgrade";
import { queryClient } from "@/routes/__root";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PLANS = [
	{
		value: "starter" as const,
		label: "1–25 alunos",
		price: "R$ 49,90",
	},
	{
		value: "pro" as const,
		label: "25–50 alunos",
		price: "R$ 89,90",
	},
	{
		value: "elite" as const,
		label: "Mais de 50 alunos",
		price: "R$ 119,90",
	},
];

const FEATURES = [
	"Criação ilimitada de programas de treino",
	"Anamneses personalizadas para seus alunos",
	"Histórico completo de treinos realizados",
	"Evolução de carga com gráficos detalhados",
	"Acesso via WhatsApp para seus alunos",
	"Analytics de performance dos alunos",
];

type PlanValue = "starter" | "pro" | "elite";

type UpgradePlanDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export default function UpgradePlanDialog({
	open,
	onOpenChange,
}: UpgradePlanDialogProps) {
	const [selectedPlan, setSelectedPlan] = useState<PlanValue>("starter");

	const { mutateAsync: upgrade, isPending } = usePostApiBillingUpgrade();

	const currentPlan = PLANS.find((p) => p.value === selectedPlan) ?? PLANS[0];

	const handleUpgrade = async () => {
		await upgrade(
			{ data: { requestedPlan: selectedPlan } },
			{
				onSuccess: async () => {
					toast.success("Plano atualizado com sucesso!");
					await queryClient.invalidateQueries({
						queryKey: getApiBillingPlanSuspenseQueryKey(),
					});
					onOpenChange(false);
				},
				onError: () => {
					toast.error("Erro ao atualizar plano. Tente novamente.");
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="md:min-w-2xl p-0 overflow-hidden">
				<div className="grid md:grid-cols-2">
					{/* Left: features */}
					<div className="bg-muted p-8 flex flex-col gap-6">
						<DialogHeader>
							<DialogTitle asChild>
								<TypographyH3 className="text-xl font-semibold">
									Homug Personal
								</TypographyH3>
							</DialogTitle>
							<TypographyP className="text-sm text-muted-foreground">
								O que está incluído na nossa plataforma
							</TypographyP>
						</DialogHeader>

						<ul className="flex flex-col gap-4">
							{FEATURES.map((feature) => (
								<li key={feature} className="flex items-start gap-2">
									<CheckIcon className="size-4 mt-0.5 text-muted-foreground shrink-0" />
									<span className="text-sm">{feature}</span>
								</li>
							))}
						</ul>
					</div>

					{/* Right: plan selector */}
					<div className="p-8 flex flex-col gap-6">
						<div className="flex flex-col gap-1">
							<span className="text-2xl font-bold">
								{currentPlan.price}
								<span className="text-sm font-normal text-muted-foreground">
									/mês
								</span>
							</span>
						</div>

						<Separator />

						<div className="flex flex-col gap-2">
							<label
								htmlFor="plan-select"
								className="text-sm font-medium"
							>
								Número de alunos
							</label>
							<Select
								value={selectedPlan}
								onValueChange={(v) => setSelectedPlan(v as PlanValue)}
							>
								<SelectTrigger id="plan-select">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{PLANS.map((plan) => (
										<SelectItem key={plan.value} value={plan.value}>
											{plan.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<Button
							onClick={handleUpgrade}
							disabled={isPending}
							className="w-full"
						>
							{isPending ? (
								<>
									<Spinner /> Atualizando...
								</>
							) : (
								"Fazer upgrade"
							)}
						</Button>

						<TypographyP className="text-xs text-muted-foreground text-center">
							O acesso é liberado imediatamente após o upgrade.
							Entraremos em contato para confirmar o pagamento.
						</TypographyP>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
