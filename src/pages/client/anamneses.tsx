import { AnamnesisStatusBadge } from "@/components/client/anamnesis/status-badge";
import { ClientPageContainer } from "@/components/client/page-container";
import { ClientScreenHeader } from "@/components/client/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { TypographyH4, TypographyP, TypographySpanXSmall } from "@/components/ui/typography";
import { useGetApiClientMeAnamnesisSuspense } from "@/gen/hooks/useGetApiClientMeAnamnesisSuspense";
import { formatRelativeDate } from "@/hooks/use-relative-date";
import { clientPortalQueryOptions } from "@/lib/client-query";
import { Link } from "@tanstack/react-router";
import { ClipboardList, ChevronRight } from "lucide-react";

export default function ClientAnamnesesPage() {
	const { data } = useGetApiClientMeAnamnesisSuspense({
		query: clientPortalQueryOptions,
	});

	return (
		<div className="min-h-svh bg-background">
			<ClientScreenHeader title="Anamneses" />
			<ClientPageContainer withBottomNav={false}>
				{data.anamnesis.length === 0 ? (
					<Empty className="border">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<ClipboardList className="size-4" />
							</EmptyMedia>
							<EmptyTitle>Nenhuma anamnese disponível</EmptyTitle>
							<EmptyDescription>
								Quando seu treinador enviar uma anamnese, ela aparecerá aqui.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : (
					<div className="space-y-4">
						{data.anamnesis.map((anamnesis) => {
							const answeredCount = anamnesis.questions.filter((question) =>
								Boolean(question.answer?.trim()),
							).length;

							return (
								<Card key={anamnesis.id}>
									<CardContent className="space-y-4">
										<div className="flex items-start justify-between gap-4">
											<div className="space-y-2">
												<TypographyH4>{anamnesis.name}</TypographyH4>
												{anamnesis.description ? (
													<TypographyP className="text-muted-foreground">
														{anamnesis.description}
													</TypographyP>
												) : null}
											</div>
											<AnamnesisStatusBadge status={anamnesis.status} />
										</div>

										<div className="flex items-center justify-between gap-4">
											<TypographySpanXSmall className="text-muted-foreground">
												{answeredCount}/{anamnesis.questions.length} respondidas
											</TypographySpanXSmall>
											<TypographySpanXSmall className="text-muted-foreground">
												Enviada {formatRelativeDate(anamnesis.sentAt)}
											</TypographySpanXSmall>
										</div>

										<div className="flex items-center gap-2">
											<Button asChild variant="outline" className="flex-1">
												<Link
													to="/client/anamneses/$clientAnamnesisId"
													params={{ clientAnamnesisId: anamnesis.id }}
												>
													Ver detalhes
												</Link>
											</Button>
											{anamnesis.status !== "FINISHED" ? (
												<Button asChild className="flex-1">
													<Link
														to="/client/anamneses/$clientAnamnesisId/respond"
														params={{ clientAnamnesisId: anamnesis.id }}
													>
														{anamnesis.status === "PENDING"
															? "Responder"
															: "Confirmar"}
													</Link>
												</Button>
											) : null}
											<Button asChild variant="ghost" size="icon-sm">
												<Link
													to="/client/anamneses/$clientAnamnesisId"
													params={{ clientAnamnesisId: anamnesis.id }}
												>
													<ChevronRight className="size-4" />
												</Link>
											</Button>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				)}
			</ClientPageContainer>
		</div>
	);
}
