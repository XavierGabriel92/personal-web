import { ClientPageContainer } from "@/components/client/page-container";
import { ClientScreenHeader } from "@/components/client/screen-header";
import { Card, CardContent } from "@/components/ui/card";
import { TypographyH4, TypographyP, TypographySpanXSmall } from "@/components/ui/typography";
import { useGetApiExerciseByIdSuspense } from "@/gen/hooks/useGetApiExerciseByIdSuspense";
import { clientPortalQueryOptions } from "@/lib/client-query";

interface ClientExerciseDetailPageProps {
	exerciseId: string;
}

export default function ClientExerciseDetailPage({
	exerciseId,
}: ClientExerciseDetailPageProps) {
	const { data } = useGetApiExerciseByIdSuspense(exerciseId, {
		query: clientPortalQueryOptions,
	});

	const steps = data.howTo
		?.split("|")
		.map((step) => step.trim())
		.filter(Boolean);
	const mediaPreview = data.videoUrl ? (
		// biome-ignore lint/a11y/useMediaCaption: the current exercise API does not expose caption tracks.
		<video className="aspect-video w-full" controls src={data.videoUrl} />
	) : data.imgSrc ? (
		<img
			className="aspect-video w-full object-cover"
			src={data.imgSrc}
			alt={data.name}
		/>
	) : (
		<div className="flex aspect-video items-center justify-center bg-muted">
			<TypographyP className="text-muted-foreground">
				Previa indisponivel
			</TypographyP>
		</div>
	);

	return (
		<div className="min-h-svh bg-background">
			<ClientScreenHeader title="Exercício" />
			<ClientPageContainer withBottomNav={false}>
				<div className="space-y-4">
					<div className="overflow-hidden rounded-xl border bg-card shadow-sm">{mediaPreview}</div>

					<Card>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<TypographyH4>{data.name}</TypographyH4>
								<TypographyP className="text-muted-foreground">
									{data.category}
								</TypographyP>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1">
									<TypographySpanXSmall className="text-muted-foreground">
										Equipamento
									</TypographySpanXSmall>
									<TypographyP>{data.equipment}</TypographyP>
								</div>
								<div className="space-y-1">
									<TypographySpanXSmall className="text-muted-foreground">
										Músculo principal
									</TypographySpanXSmall>
									<TypographyP>{data.primaryMuscle}</TypographyP>
								</div>
							</div>

							<div className="space-y-1">
								<TypographySpanXSmall className="text-muted-foreground">
									Músculo secundário
								</TypographySpanXSmall>
								<TypographyP>{data.secondaryMuscle}</TypographyP>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="space-y-4">
							<TypographyH4>Como fazer</TypographyH4>
							{steps?.length ? (
								<div className="space-y-4">
									{steps.map((step, index) => (
										<div key={`${data.id}-${index}`} className="flex gap-4">
											<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-medium">
												{index + 1}
											</div>
											<TypographyP className="pt-1">{step}</TypographyP>
										</div>
									))}
								</div>
							) : (
								<TypographyP className="text-muted-foreground">
									Instruções indisponíveis para este exercício.
								</TypographyP>
							)}
						</CardContent>
					</Card>
				</div>
			</ClientPageContainer>
		</div>
	);
}
