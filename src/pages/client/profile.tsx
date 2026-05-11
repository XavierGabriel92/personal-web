import { ClientPageContainer } from "@/components/client/page-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TypographyH1, TypographyH4, TypographyP, TypographySpanXSmall } from "@/components/ui/typography";
import { sessionQueryKey } from "@/hooks/auth";
import { useClientSession } from "@/hooks/use-client-session";
import { signOut } from "@/lib/auth-client";
import { queryClient } from "@/routes/__root";
import { useNavigate, Link } from "@tanstack/react-router";
import { Activity, ChevronRight, FileText, Moon, Pencil, Sun, SunMoon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTheme } from "@/components/theme-provider";

function ProfileLinkRow({
	to,
	icon,
	label,
}: {
	to: "/client/anamneses" | "/client/activities";
	icon: ReactNode;
	label: string;
}) {
	return (
		<Button asChild variant="outline" className="h-auto w-full justify-between py-4">
			<Link to={to}>
				<span className="flex items-center gap-2">
					{icon}
					<span>{label}</span>
				</span>
				<ChevronRight className="size-4" />
			</Link>
		</Button>
	);
}

export default function ClientProfilePage() {
	const navigate = useNavigate();
	const { user } = useClientSession();
	const { theme, setTheme } = useTheme();
	const [isSigningOut, setIsSigningOut] = useState(false);

	const themeOptions = [
		{ value: "light", label: "Claro", icon: Sun },
		{ value: "dark", label: "Escuro", icon: Moon },
		{ value: "system", label: "Sistema", icon: SunMoon },
	] as const;

	return (
		<ClientPageContainer>
			<div className="space-y-4">
				<div className="flex items-start justify-between gap-4">
					<div className="flex min-w-0 items-center gap-4">
						<Avatar className="size-14">
							<AvatarImage src={undefined} alt={user?.name ?? "Perfil"} />
							<AvatarFallback>
								{(user?.name ?? "Perfil").slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="min-w-0">
							<TypographyH1 className="truncate text-2xl">
								{user?.name ?? "Meu Perfil"}
							</TypographyH1>
							{user?.email ? (
								<TypographyP className="truncate text-muted-foreground">
									{user.email}
								</TypographyP>
							) : null}
						</div>
					</div>

					<Button asChild variant="ghost" size="icon-sm">
						<Link to="/client/profile/edit">
							<Pencil className="size-4" />
						</Link>
					</Button>
				</div>

				<div className="space-y-2">
					<ProfileLinkRow
						to="/client/anamneses"
						icon={<FileText className="size-4 text-muted-foreground" />}
						label="Anamneses"
					/>
					<ProfileLinkRow
						to="/client/activities"
						icon={<Activity className="size-4 text-muted-foreground" />}
						label="Atividades"
					/>
				</div>

				<Card>
					<CardContent className="space-y-4">
						<div className="space-y-1">
							<TypographyH4>Tema</TypographyH4>
							<TypographyP className="text-muted-foreground">
								Escolha como o app deve aparecer para você.
							</TypographyP>
						</div>
						<div className="grid grid-cols-3 gap-2">
							{themeOptions.map((option) => {
								const Icon = option.icon;
								const isActive = theme === option.value;
								return (
									<Button
										key={option.value}
										variant={isActive ? "active" : "outline"}
										className="h-auto flex-col gap-2 py-4"
										onClick={() => setTheme(option.value)}
									>
										<Icon className="size-4" />
										<TypographySpanXSmall>{option.label}</TypographySpanXSmall>
									</Button>
								);
							})}
						</div>
					</CardContent>
				</Card>

				<Button
					variant="link"
					className="w-full text-destructive"
					disabled={isSigningOut}
					onClick={() => {
						setIsSigningOut(true);
						signOut({
							fetchOptions: {
								onSuccess: async () => {
									queryClient.clear();
									await queryClient.refetchQueries({ queryKey: sessionQueryKey });
									navigate({ to: "/", replace: true });
								},
								onError: () => {
									setIsSigningOut(false);
								},
							},
						});
					}}
				>
					{isSigningOut ? "Saindo..." : "Sair"}
				</Button>
			</div>
		</ClientPageContainer>
	);
}
