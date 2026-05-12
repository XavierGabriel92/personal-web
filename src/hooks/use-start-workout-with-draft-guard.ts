import { useDeleteApiClientMeSessionsBySessionId } from "@/gen/hooks/useDeleteApiClientMeSessionsBySessionId";
import { getApiClientMeSessionsDraftQueryKey } from "@/gen/hooks/useGetApiClientMeSessionsDraft";
import { usePostApiClientMeSessionsStart } from "@/gen/hooks/usePostApiClientMeSessionsStart";
import { useDraftSession } from "@/hooks/use-draft-session";
import { getErrorMessage } from "@/lib/client-portal";
import { queryClient } from "@/routes/__root";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export function useStartWorkoutWithDraftGuard() {
	const navigate = useNavigate();
	const draftQuery = useDraftSession();
	const { mutateAsync: startWorkout, isPending: isStarting } =
		usePostApiClientMeSessionsStart();
	const { mutateAsync: discardDraft, isPending: isDiscarding } =
		useDeleteApiClientMeSessionsBySessionId();

	const [pendingWorkoutId, setPendingWorkoutId] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const draftSession = draftQuery.data;
	const isStartWorkoutPending = isStarting || isDiscarding;

	const goToActiveSession = async () => {
		await navigate({ to: "/client/sessions/active" });
	};

	const startRequestedWorkout = async (workoutId: string) => {
		setPendingWorkoutId(workoutId);

		try {
			await startWorkout(
				{ data: { workoutId } },
				{
					onSuccess: async (session) => {
						queryClient.setQueryData(
							getApiClientMeSessionsDraftQueryKey(),
							session,
						);
						await goToActiveSession();
					},
					onError: (error) => {
						toast.error(
							getErrorMessage(error, "Não foi possível iniciar o treino."),
						);
					},
				},
			);
		} finally {
			setPendingWorkoutId((currentWorkoutId) =>
				currentWorkoutId === workoutId ? null : currentWorkoutId,
			);
		}
	};

	const requestStartWorkout = async (workoutId: string) => {
		if (draftSession?.status === "draft") {
			setPendingWorkoutId(workoutId);
			setIsDialogOpen(true);
			return;
		}

		await startRequestedWorkout(workoutId);
	};

	const confirmReplaceDraft = async () => {
		if (!pendingWorkoutId) {
			setIsDialogOpen(false);
			return;
		}

		if (draftSession?.id) {
			await discardDraft(
				{ sessionId: draftSession.id },
				{
					onSuccess: () => {
						queryClient.setQueryData(
							getApiClientMeSessionsDraftQueryKey(),
							null,
						);
					},
					onError: (error) => {
						toast.error(
							getErrorMessage(
								error,
								"Não foi possível descartar o treino atual.",
							),
						);
					},
				},
			);
		}

		setIsDialogOpen(false);
		await startRequestedWorkout(pendingWorkoutId);
		setPendingWorkoutId(null);
	};

	const handleDialogOpenChange = (open: boolean) => {
		setIsDialogOpen(open);

		if (!open && !isStartWorkoutPending) {
			setPendingWorkoutId(null);
		}
	};

	return {
		activeDraft: draftSession?.status === "draft" ? draftSession : null,
		isStartWorkoutPending,
		pendingWorkoutId,
		requestStartWorkout,
		replaceDraftDialogProps: {
			open: isDialogOpen,
			onOpenChange: handleDialogOpenChange,
			onConfirm: confirmReplaceDraft,
			isPending: isStartWorkoutPending,
		},
	};
}
