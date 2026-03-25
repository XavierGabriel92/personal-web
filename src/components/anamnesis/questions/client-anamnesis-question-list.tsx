import QuestionListBase from "@/components/anamnesis/questions/question-list-base";
import { useDeleteApiClientByIdAnamnesisByClientAnamnesisIdQuestionsByQuestionId } from "@/gen/hooks/useDeleteApiClientByIdAnamnesisByClientAnamnesisIdQuestionsByQuestionId";
import { getApiClientByIdAnamnesisSuspenseQueryKey } from "@/gen/hooks/useGetApiClientByIdAnamnesisSuspense";
import { usePostApiClientByIdAnamnesisByClientAnamnesisIdQuestions } from "@/gen/hooks/usePostApiClientByIdAnamnesisByClientAnamnesisIdQuestions";
import { usePutApiClientByIdAnamnesisByClientAnamnesisIdQuestionsReorder } from "@/gen/hooks/usePutApiClientByIdAnamnesisByClientAnamnesisIdQuestionsReorder";
import type { GetApiClientByIdAnamnesis200 } from "@/gen/types/GetApiClientByIdAnamnesis";
import { queryClient } from "@/routes/__root";
import { toast } from "sonner";

type ClientAnamnesisQuestion =
	GetApiClientByIdAnamnesis200["anamnesis"][number]["questions"][number];

interface ClientAnamnesisQuestionListProps {
	clientId: string;
	clientAnamnesisId: string;
	questions: ClientAnamnesisQuestion[];
}

export default function ClientAnamnesisQuestionList({
	clientId,
	clientAnamnesisId,
	questions,
}: ClientAnamnesisQuestionListProps) {
	const { mutateAsync: addQuestion } =
		usePostApiClientByIdAnamnesisByClientAnamnesisIdQuestions();
	const { mutateAsync: deleteQuestion } =
		useDeleteApiClientByIdAnamnesisByClientAnamnesisIdQuestionsByQuestionId();
	const { mutateAsync: reorderQuestions } =
		usePutApiClientByIdAnamnesisByClientAnamnesisIdQuestionsReorder();

	const refreshQuestions = async () => {
		await queryClient.invalidateQueries({
			queryKey: getApiClientByIdAnamnesisSuspenseQueryKey(clientId),
		});
	};

	return (
		<QuestionListBase
			questions={questions}
			onAddQuestion={async (text) => {
				await addQuestion(
					{ id: clientId, clientAnamnesisId, data: { text } },
					{
						onSuccess: async () => {
							await refreshQuestions();
							toast.success("Pergunta adicionada!");
						},
						onError: () => {
							toast.error("Erro ao adicionar pergunta. Tente novamente.");
						},
					},
				);
			}}
			onDeleteQuestion={async (question) => {
				await deleteQuestion(
					{ id: clientId, clientAnamnesisId, questionId: question.id },
					{
						onSuccess: async () => {
							await refreshQuestions();
							toast.success("Pergunta removida!");
						},
						onError: () => {
							toast.error("Erro ao remover pergunta. Tente novamente.");
						},
					},
				);
			}}
			onReorderQuestions={async (nextQuestions) => {
				await reorderQuestions(
					{
						id: clientId,
						clientAnamnesisId,
						data: { questions: nextQuestions },
					},
					{
						onSuccess: async () => {
							await refreshQuestions();
						},
						onError: (error) => {
							const message =
								error.response?.data?.message ??
								"Erro ao reordenar perguntas. Tente novamente.";
							toast.error(message);
						},
					},
				);
			}}
		/>
	);
}
