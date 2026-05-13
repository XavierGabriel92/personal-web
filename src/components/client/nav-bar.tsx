import { Button } from "@/components/ui/button";
import { TypographySpanXSmall } from "@/components/ui/typography";
import { getMobilePlatform } from "@/hooks/use-install-app";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import {
	Dumbbell,
	House,
	type LucideIcon,
	UserRound,
} from "lucide-react";

const routes: Array<{
	path: string;
	label: string;
	icon: LucideIcon;
	activeIcon?: LucideIcon;
}> = [
		{
			path: "/client/home",
			label: "Home",
			icon: House,
			activeIcon: House,
		},
		{
			path: "/client/workouts",
			label: "Treinos",
			icon: Dumbbell,
			activeIcon: Dumbbell,
		},
		{
			path: "/client/profile",
			label: "Perfil",
			icon: UserRound,
			activeIcon: UserRound,
		},
	];

export default function ClientNavBar() {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const isAndroid = useMemo(() => getMobilePlatform().isAndroid, []);

	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[env(safe-area-inset-bottom)]">
			<div className="pointer-events-auto w-full max-w-2xl border bg-background/95 shadow-lg backdrop-blur supports-backdrop-filter:bg-background/80">
				<nav
					className={cn(
						"grid grid-cols-3 gap-1 px-2 pt-1",
						isAndroid ? "pb-1" : "pb-5",
					)}
				>
					{routes.map((route) => {
						const isActive =
							pathname === route.path || pathname.startsWith(`${route.path}/`);
						const Icon = route.icon;

						return (
							<Button
								key={route.path}
								asChild
								variant="ghost"
								size="sm"
								className="h-auto py-2"
							>
								<Link
									to={route.path}
									className="flex flex-col items-center justify-center gap-1"
								>
									<Icon
										className={cn(
											"size-5 transition-colors",
											isActive
												? "text-primary"
												: "text-muted-foreground",
										)}
									/>
									<TypographySpanXSmall
										className={cn(isActive && "text-primary")}
									>
										{route.label}
									</TypographySpanXSmall>
								</Link>
							</Button>
						);
					})}
				</nav>
			</div>
		</div>
	);
}