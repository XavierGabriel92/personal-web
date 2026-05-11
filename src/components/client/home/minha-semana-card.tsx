import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TypographyH4, TypographyP, TypographySpanXSmall } from "@/components/ui/typography";
import type { GetApiClientMeHome200 } from "@/gen/types/GetApiClientMeHome";
import { formatWeekdayShortPtBr } from "@/hooks/use-relative-date";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Zap } from "lucide-react";
import { useMemo } from "react";

interface MinhaSemanaCardProps {
	data: GetApiClientMeHome200["myWeek"];
}

export function MinhaSemanaCard({ data }: MinhaSemanaCardProps) {
	const todayKey = useMemo(
		() => new Date().toISOString().slice(0, 10),
		[],
	);

	return (
		<Card>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between gap-4">
					<TypographyH4>Minha semana</TypographyH4>
					<Button asChild variant="ghost" size="icon-sm">
						<Link to="/client/history">
							<ChevronRight className="size-4" />
						</Link>
					</Button>
				</div>

				<div className="grid grid-cols-7 gap-2">
					{data.days.map((day) => {
						const isToday = day.date === todayKey;
						const dayNumber =
							Number.parseInt(day.date.slice(-2), 10).toString();

						return (
							<div key={day.date} className="flex flex-col items-center gap-2">
								<div
									className={
										day.hasWorkout
											? "flex size-10 items-center justify-center rounded-full border bg-background"
											: "flex size-10 items-center justify-center rounded-full bg-muted"
									}
								>
									<TypographySpanXSmall
										className={isToday ? "font-semibold" : "text-muted-foreground"}
									>
										{dayNumber}
									</TypographySpanXSmall>
								</div>
								<TypographySpanXSmall
									className={
										isToday ? "font-semibold" : "text-muted-foreground"
									}
								>
									{formatWeekdayShortPtBr(day.date)}
								</TypographySpanXSmall>
							</div>
						);
					})}
				</div>

				<Separator />

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Zap className="size-4 text-primary" />
							<TypographyH4>{data.currentStreakWeeks} semanas</TypographyH4>
						</div>
						<TypographyP className="text-muted-foreground">
							sequência atual
						</TypographyP>
					</div>

					<div className="space-y-2 text-right">
						<div className="flex items-center justify-end gap-2">
							<div className="flex size-10 items-center justify-center rounded-full border">
								<Zap className="size-4 text-primary" />
							</div>
							<TypographyH4>
								{data.weeklyMinutes} / {data.weeklyMinutesGoal}
							</TypographyH4>
						</div>
						<TypographyP className="text-muted-foreground">minutos</TypographyP>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
