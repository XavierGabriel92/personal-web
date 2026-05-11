import { AnamnesisStatusBadge } from "@/components/client/anamnesis/status-badge";
import { ClientPageContainer } from "@/components/client/page-container";
import { ClientScreenHeader } from "@/components/client/screen-header";
import { Card, CardContent } from "@/components/ui/card";
import { TypographyH4, TypographyP, TypographySpanXSmall } from "@/components/ui/typography";
import { useGetApiClientMeAnamnesisByClientAnamnesisIdSuspense } from "@/gen/hooks/useGetApiClientMeAnamnesisByClientAnamnesisIdSuspense";
import { clientPortalQueryOptions } from "@/lib/client-query";

interface ClientAnamnesisDetailPageProps {
	clientAnamnesisId: string;
}

export default function ClientAnamnesisDetailPage({
	clientAnamnesisId,
}: ClientAnamnesisDetailPageProps) {
	const { data } =
		useGetApiClientMeAnamnesisByClientAnamnesisIdSuspense(clientAnamnesisId, {
			query: clientPortalQueryOptions,
		});

	return (
		<div className="min-h-svh bg-background">
			<ClientScreenHeader title="Anamnese" />
			<ClientPageContainer withBottomNav={false}>
				<div className="space-y-4">
					<Card>
						<CardContent className="space-y-4">
							<div className="flex items-start justify-between gap-4">
								<div className="space-y-2">
									<TypographyH4>{data.name}</TypographyH4>
									{data.description ? (
										<TypographyP className="text-muted-foreground">
											{data.description}
										</TypographyP>
									) : null}
								</div>
								<AnamnesisStatusBadge status={data.status} />
							</div>
							<TypographySpanXSmall className="text-muted-foreground">
								{data.questions.filter((question) => Boolean(question.answer?.trim()))
									.length}
								/{data.questions.length} respondidas
							</TypographySpanXSmall>
						</CardContent>
					</Card>

					{[...data.questions]
						.sort((left, right) => left.order - right.order)
						.map((question, index) => (
							<Card key={question.id}>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<TypographySpanXSmall className="text-muted-foreground">
											Pergunta {index + 1}
										</TypographySpanXSmall>
										<TypographyH4>{question.text}</TypographyH4>
									</div>
									<div className="rounded-lg bg-muted p-4">
										<TypographyP className="whitespace-pre-wrap">
											{question.answer?.trim() || "Aguardando resposta"}
										</TypographyP>
									</div>
								</CardContent>
							</Card>
						))}
				</div>
			</ClientPageContainer>
		</div>
	);
}
