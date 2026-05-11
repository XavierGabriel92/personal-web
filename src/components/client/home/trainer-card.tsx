import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { TypographyH4, TypographyP, TypographySpanXSmall } from "@/components/ui/typography";
import type { GetApiClientMeHome200 } from "@/gen/types/GetApiClientMeHome";

interface TrainerCardProps {
	trainer: GetApiClientMeHome200["trainer"];
}

export function TrainerCard({ trainer }: TrainerCardProps) {
	return (
		<Card>
			<CardContent className="flex items-center gap-4">
				<Avatar className="size-12">
					<AvatarImage src={trainer.image ?? undefined} alt={trainer.name} />
					<AvatarFallback>{trainer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
				</Avatar>
				<div className="min-w-0">
					<TypographySpanXSmall className="text-muted-foreground">
						Seu treinador
					</TypographySpanXSmall>
					<TypographyH4 className="truncate">{trainer.name}</TypographyH4>
					{trainer.email ? (
						<TypographyP className="truncate text-muted-foreground">
							{trainer.email}
						</TypographyP>
					) : null}
				</div>
			</CardContent>
		</Card>
	);
}
