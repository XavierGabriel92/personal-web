import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyH1, TypographyH4 } from "@/components/ui/typography";

type WelcomeCardProps = {
	appName: string | null;
	welcomeMessage: string | null;
	iconUrl: string | null;
};

export function WelcomeCard({ appName, welcomeMessage, iconUrl }: WelcomeCardProps) {
	const greeting = welcomeMessage?.trim() || "Bem vindo ao";
	const name = appName?.trim() || "Homug";
	const initials = name.slice(0, 2).toUpperCase();
	const resolvedIconUrl = iconUrl?.trim() || "/homug_gorilla_logo.svg";

	return (
		<div className="flex items-center gap-4">
			<Avatar className="size-14 rounded-xl">
				<AvatarImage src={resolvedIconUrl} alt={name} />
				<AvatarFallback className="rounded-xl">{initials}</AvatarFallback>
			</Avatar>
			<div className="min-w-0 space-y-1">
				<TypographyH4 className="text-muted-foreground text-sm">
					{greeting}
				</TypographyH4>
				<TypographyH1 className="truncate">{name}</TypographyH1>
			</div>
		</div>
	);
}
