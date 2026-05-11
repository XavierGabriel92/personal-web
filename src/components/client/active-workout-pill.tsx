import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographySpanXSmall } from "@/components/ui/typography";
import { useDeleteApiClientMeSessionsBySessionId } from "@/gen/hooks/useDeleteApiClientMeSessionsBySessionId";
import { getApiClientMeSessionsDraftQueryKey } from "@/gen/hooks/useGetApiClientMeSessionsDraft";
import { useDraftSession } from "@/hooks/use-draft-session";
import { formatDuration } from "@/hooks/use-relative-date";
import { getErrorMessage } from "@/lib/client-portal";
import { queryClient } from "@/routes/__root";
import { useNavigate } from "@tanstack/react-router";
import { differenceInSeconds } from "date-fns";
import { Dumbbell, Play, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export function ActiveWorkoutPill() {
	const navigate = useNavigate();
	const { data: draftSession } = useDraftSession();
	const { mutateAsync: discardDraft, isPending } =
		useDeleteApiClientMeSessionsBySessionId();
	const [open, setOpen] = useState(false);
	const [now, setNow] = useState(Date.now());

	useEffect(() => {
		const interval = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(interval);
	}, []);

	const elapsed = useMemo(() => {
		if (!draftSession?.startedAt) {
			return "0min";
		}

		return formatDuration(
			Math.max(0, differenceInSeconds(now, new Date(draftSession.startedAt))),
		);
	}, [draftSession?.startedAt, now]);

	if (!draftSession || draftSession.status !== "draft") {
		return null;
	}

	return (
		<>
			<div className="pointer-events-none fixed inset-x-0 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-4">
				<div className="pointer-events-auto w-full max-w-lg">
					<Card className="flex-row items-center justify-between gap-2 rounded-full border bg-background/95 px-2 py-2 shadow-xl backdrop-blur supports-backdrop-filter:bg-background/80">
						<div className="flex min-w-0 items-center gap-2">
							<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
								<Dumbbell className="size-4" />
							</div>
							<div className="min-w-0">
								<TypographyP className="truncate font-medium leading-none">
									{draftSession.workoutName}
								</TypographyP>
								<TypographySpanXSmall className="truncate text-muted-foreground">
									Treino em andamento - {elapsed}
								</TypographySpanXSmall>
							</div>
						</div>
						<div className="flex shrink-0 items-center gap-2">
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Descartar treino atual"
								onClick={() => setOpen(true)}
								disabled={isPending}
							>
								<Trash2 className="size-4" />
							</Button>
							<Button
								size="sm"
								className="rounded-full px-4"
								onClick={() => navigate({ to: "/client/sessions/active" })}
							>
								<Play className="size-4" />
								Continuar
							</Button>
						</div>
					</Card>
				</div>
			</div>

			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Descartar treino atual?</AlertDialogTitle>
						<AlertDialogDescription>
							O treino em andamento será apagado e não poderá ser recuperado.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-white hover:bg-destructive/90"
							disabled={isPending}
							onClick={async () => {
								await discardDraft(
									{ sessionId: draftSession.id },
									{
										onSuccess: () => {
											queryClient.setQueryData(
												getApiClientMeSessionsDraftQueryKey(),
												null,
											);
											toast.success("Treino descartado.");
										},
										onError: (error) => {
											toast.error(
												getErrorMessage(
													error,
													"Não foi possível descartar o treino.",
												),
											);
										},
									},
								);
							}}
						>
							Descartar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
