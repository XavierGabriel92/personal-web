import { EmptyProgramCard } from "@/components/client/home/empty-program-card";
import { MinhaSemanaCard } from "@/components/client/home/minha-semana-card";
import { NextWorkoutCard } from "@/components/client/home/next-workout-card";
import { PendingAnamnesisCard } from "@/components/client/home/pending-anamnesis-card";
import { TrainerCard } from "@/components/client/home/trainer-card";
import { ClientPageContainer } from "@/components/client/page-container";
import { ReplaceDraftWorkoutDialog } from "@/components/client/replace-draft-workout-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { useGetApiClientMeHomeSuspense } from "@/gen/hooks/useGetApiClientMeHomeSuspense";
import { useStartWorkoutWithDraftGuard } from "@/hooks/use-start-workout-with-draft-guard";
import { clientPortalQueryOptions } from "@/lib/client-query";
import { getClientTimeZone } from "@/lib/client-portal";

export default function ClientHomePage() {
	const { data } = useGetApiClientMeHomeSuspense({
		timeZone: getClientTimeZone(),
	}, {
		query: clientPortalQueryOptions,
	});
	const { requestStartWorkout, replaceDraftDialogProps } =
		useStartWorkoutWithDraftGuard();

	return (
		<ClientPageContainer>
			<div className="space-y-4">
				<TrainerCard trainer={data.trainer} />

				<div className="space-y-2">
					{data.pendingAnamnesis ? (
						<PendingAnamnesisCard anamnesis={data.pendingAnamnesis} />
					) : (
						null
					)}

					{data.program ? (
						data.nextWorkout ? (
							<NextWorkoutCard
								workout={data.nextWorkout}
								onStart={requestStartWorkout}
							/>
						) : (
							<Card>
								<CardContent>
									<TypographyP className="text-muted-foreground">
										Nenhum treino disponível no programa. Fale com seu treinador.
									</TypographyP>
								</CardContent>
							</Card>
						)
					) : (
						<EmptyProgramCard />
					)}
				</div>

				<MinhaSemanaCard data={data.myWeek} />

				<ReplaceDraftWorkoutDialog {...replaceDraftDialogProps} />
			</div>
		</ClientPageContainer>
	);
}
