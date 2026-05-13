import { ModeToggle } from "@/components/theme-provider/mode-toggle";

export function TrainerAccountPreferencePage() {
	return (
		<>
			<div className="space-y-2">
				<h1 className="text-2xl font-bold">Preferências</h1>
				<p className="text-sm text-muted-foreground">
					Ajuste a aparência do painel (claro, escuro ou conforme o sistema).
				</p>
			</div>

			<div className="mt-6 flex flex-wrap items-center justify-start gap-4">
				<span className="text-sm font-medium">Aparência</span>
				<ModeToggle />
			</div>
		</>
	);
}
