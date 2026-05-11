import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface ClientScreenHeaderProps {
	title: ReactNode;
	leftSlot?: ReactNode;
	rightSlot?: ReactNode;
	summarySlot?: ReactNode;
	showSummary?: boolean;
	className?: string;
}

export function ClientScreenHeader({
	title,
	leftSlot,
	rightSlot,
	summarySlot,
	showSummary = false,
	className,
}: ClientScreenHeaderProps) {
	const router = useRouter();
	const shouldShowSummary = showSummary && Boolean(summarySlot);

	return (
		<header
			className={cn(
				"sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80",
				className,
			)}
		>
			<div
				className={cn(
					"mx-auto w-full max-w-2xl px-4 py-4",
					shouldShowSummary ? "flex items-center gap-4" : "relative flex items-center justify-between",
				)}
			>
				<div
					className={cn(
						"flex min-w-0 items-center",
						shouldShowSummary ? "flex-none" : "flex-1",
					)}
				>
					{leftSlot ?? (
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => router.history.back()}
						>
							<ChevronLeft className="size-4" />
						</Button>
					)}
				</div>
				{shouldShowSummary ? (
					<div className="min-w-0 flex-1">{summarySlot}</div>
				) : (
					<div className="pointer-events-none absolute inset-x-0 flex justify-center px-16">
						<TypographyH4 className="truncate text-center font-semibold">
							{title}
						</TypographyH4>
					</div>
				)}
				<div
					className={cn(
						"flex min-w-0 justify-end",
						shouldShowSummary ? "flex-none" : "flex-1",
					)}
				>
					{rightSlot}
				</div>
			</div>
		</header>
	);
}
