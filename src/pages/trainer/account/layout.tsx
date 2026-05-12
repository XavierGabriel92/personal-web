import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { CreditCard, type LucideIcon, Palette, UserCircle } from "lucide-react";
import type { ReactNode } from "react";

const items: {
	to: "/trainer/account/conta" | "/trainer/account/tema" | "/trainer/account/plano";
	label: string;
	description: string;
	icon: LucideIcon;
}[] = [
		{
			to: "/trainer/account/conta",
			label: "Conta",
			description: "Dados pessoais da sua conta",
			icon: UserCircle,
		},
		{
			to: "/trainer/account/tema",
			label: "Tema",
			description: "Marca e aparência no app do cliente",
			icon: Palette,
		},
		{
			to: "/trainer/account/plano",
			label: "Plano",
			description: "Assinatura e pagamento",
			icon: CreditCard,
		},
	];

export function AccountSettingsLayout({ children }: { children: ReactNode }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return (
		<div className="flex w-full flex-col gap-6 md:flex-row md:items-stretch md:gap-8">
			<nav
				className="flex flex-row flex-wrap gap-2 pb-6 md:w-60 md:flex-col md:gap-1  md:pb-0 md:pr-8"
				aria-label="Configurações da conta"
			>
				{items.map(({ to, label, description, icon: Icon }) => {
					const active = pathname === to;
					return (
						<Button
							key={to}
							variant={active ? "secondary" : "ghost"}
							className={cn(
								"h-auto min-h-9 items-start justify-start py-2 whitespace-normal text-left",
								active && "pointer-events-none",
							)}
							asChild
						>
							<Link to={to} className="inline-flex w-full gap-2">
								<Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
								<span className="flex min-w-0 flex-col items-start gap-1">
									<span className="leading-snug">{label}</span>
									<span className="text-muted-foreground text-xs font-normal leading-snug">
										{description}
									</span>
								</span>
							</Link>
						</Button>
					);
				})}
			</nav>
			<div className="min-w-0 flex-1">{children}</div>
		</div>
	);
}
