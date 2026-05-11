import { Card, CardContent } from "@/components/ui/card";
import { TypographyH4, TypographyP } from "@/components/ui/typography";
import { Dumbbell } from "lucide-react";

export function EmptyProgramCard() {
	return (
		<Card>
			<CardContent className="space-y-4">
				<div className="flex items-center gap-2">
					<Dumbbell className="size-5 text-primary" />
					<TypographyH4>Nenhum programa ativo</TypographyH4>
				</div>
				<TypographyP className="text-muted-foreground">
					Seu treinador ainda não atribuiu um programa. Quando estiver pronto,
					ele aparecerá aqui automaticamente.
				</TypographyP>
			</CardContent>
		</Card>
	);
}
