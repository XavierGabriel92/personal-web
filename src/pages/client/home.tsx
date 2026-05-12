import { EmptyProgramCard } from "@/components/client/home/empty-program-card";
import { NextWorkoutCard } from "@/components/client/home/next-workout-card";
import { PendingAnamnesisCard } from "@/components/client/home/pending-anamnesis-card";
import { WelcomeCard } from "@/components/client/home/welcome-card";
import { ClientPageContainer } from "@/components/client/page-container";
import { ReplaceDraftWorkoutDialog } from "@/components/client/replace-draft-workout-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { useGetApiClientMeHomeSuspense } from "@/gen/hooks/useGetApiClientMeHomeSuspense";
import { useStartWorkoutWithDraftGuard } from "@/hooks/use-start-workout-with-draft-guard";
import { getClientTimeZone } from "@/lib/client-portal";
import { clientPortalQueryOptions } from "@/lib/client-query";

export default function ClientHomePage() {
	const { data } = useGetApiClientMeHomeSuspense(
		{
			timeZone: getClientTimeZone(),
		},
		{
			query: clientPortalQueryOptions,
		},
	);
	const {
		requestStartWorkout,
		isStartWorkoutPending,
		replaceDraftDialogProps,
	} = useStartWorkoutWithDraftGuard();

	return (
		<ClientPageContainer>
			<div className="space-y-4">
				<WelcomeCard
					appName={data.branding.appName}
					welcomeMessage={data.branding.welcomeMessage}
					iconUrl={data.branding.iconUrl}
				/>

				<div className="space-y-2">
					{data.pendingAnamnesis ? (
						<PendingAnamnesisCard anamnesis={data.pendingAnamnesis} />
					) : null}

					{data.program ? (
						data.nextWorkout ? (
							<NextWorkoutCard
								workout={data.nextWorkout}
								onStart={requestStartWorkout}
								isPending={isStartWorkoutPending}
							/>
						) : (
							<Card>
								<CardContent>
									<TypographyP className="text-muted-foreground">
										Os treinos deste programa não estão disponíveis no
										momento. Fale com seu treinador.
									</TypographyP>
								</CardContent>
							</Card>
						)
					) : (
						<EmptyProgramCard />
					)}
				</div>

				{/* <MinhaSemanaCard data={data.myWeek} /> */}

				<ReplaceDraftWorkoutDialog {...replaceDraftDialogProps} />
			</div>
		</ClientPageContainer>
	);
}
