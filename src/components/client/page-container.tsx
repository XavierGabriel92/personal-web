import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ClientPageContainerProps {
	children: ReactNode;
	className?: string;
	withBottomNav?: boolean;
}

export function ClientPageContainer({
	children,
	className,
	withBottomNav = true,
}: ClientPageContainerProps) {
	return (
		<div
			className={cn("mx-auto w-full max-w-2xl px-4 py-4", className)}
			style={{
				paddingBottom: withBottomNav
					? "calc(5rem + env(safe-area-inset-bottom))"
					: undefined,
			}}
		>
			{children}
		</div>
	);
}
