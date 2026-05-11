import { TypographyP, TypographySpanXSmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface ClientWorkoutSummaryProps {
	elapsedSeconds: number;
	volumeKg: number;
	completedSets: number;
	totalSets: number;
	className?: string;
}

function formatElapsedTimer(totalSeconds: number) {
	if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
		return "00:00";
	}

	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = Math.floor(totalSeconds % 60);

	if (hours > 0) {
		return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	}

	const totalMinutes = Math.floor(totalSeconds / 60);
	return `${String(totalMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function ClientWorkoutSummary({
	elapsedSeconds,
	volumeKg,
	completedSets,
	totalSets,
	className,
}: ClientWorkoutSummaryProps) {
	return (
		<div className={cn("grid grid-cols-3 gap-4", className)}>
			<div className="space-y-1">
				<TypographySpanXSmall className="text-muted-foreground">
					Tempo
				</TypographySpanXSmall>
				<TypographyP className="font-medium tabular-nums">
					{formatElapsedTimer(elapsedSeconds)}
				</TypographyP>
			</div>
			<div className="space-y-1">
				<TypographySpanXSmall className="text-muted-foreground">
					Volume
				</TypographySpanXSmall>
				<TypographyP className="font-medium">{volumeKg}kg</TypographyP>
			</div>
			<div className="space-y-1">
				<TypographySpanXSmall className="text-muted-foreground">
					Séries
				</TypographySpanXSmall>
				<TypographyP className="font-medium">
					{completedSets}/{totalSets}
				</TypographyP>
			</div>
		</div>
	);
}
