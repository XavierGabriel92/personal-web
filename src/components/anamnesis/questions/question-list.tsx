import QuestionListBase from "@/components/anamnesis/questions/question-list-base";
import { useDeleteApiAnamnesisByIdQuestionsByQuestionId } from "@/gen/hooks/useDeleteApiAnamnesisByIdQuestionsByQuestionId";
import { getApiAnamnesisByIdQueryKey } from "@/gen/hooks/useGetApiAnamnesisById";
import { getApiAnamnesisByIdSuspenseQueryKey } from "@/gen/hooks/useGetApiAnamnesisByIdSuspense";
import { usePostApiAnamnesisByIdQuestions } from "@/gen/hooks/usePostApiAnamnesisByIdQuestions";
import { usePutApiAnamnesisByIdQuestionsReorder } from "@/gen/hooks/usePutApiAnamnesisByIdQuestionsReorder";
import { queryClient } from "@/routes/__root";
import type { AnamnesisQuestion } from "@/schemas";
import { toast } from "sonner";

interface QuestionListProps {
	anamnesisId: string;
	questions: AnamnesisQuestion[];
}

export default function QuestionList({
	anamnesisId,
	questions,
}: QuestionListProps) {
	const { mutateAsync: addQuestion } = usePostApiAnamnesisByIdQuestions();
	const { mutateAsync: deleteQuestion } =
		useDeleteApiAnamnesisByIdQuestionsByQuestionId();
	const { mutateAsync: reorderQuestions } =
		usePutApiAnamnesisByIdQuestionsReorder();

	const refreshQuestions = async () => {
		await Promise.all([
			queryClient.invalidateQueries({
				queryKey: getApiAnamnesisByIdSuspenseQueryKey(anamnesisId),
			}),
			queryClient.invalidateQueries({
				queryKey: getApiAnamnesisByIdQueryKey(anamnesisId),
			}),
		]);
	};

	return (
		<QuestionListBase
			questions={questions}
			onAddQuestion={async (text) => {
				await addQuestion(
					{ id: anamnesisId, data: { text } },
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
					{ id: anamnesisId, questionId: question.id },
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
						id: anamnesisId,
						data: { questions: nextQuestions },
					},
					{
						onSuccess: async () => {
							await refreshQuestions();
							toast.success("Anamnese atualizada!");
						},
						onError: () => {
							toast.error("Erro ao reordenar perguntas. Tente novamente.");
						},
					},
				);
			}}
		/>
	);
}
