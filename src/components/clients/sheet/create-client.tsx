import SelectAnamnesisForClientDialog from "@/components/anamnesis/dialog/select-anamnesis-for-client";
import UpgradePlanDialog from "@/components/billing/upgrade-plan-dialog";
import ClientForm, { CreateClientButton } from "@/components/clients/form";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { getApiBillingPlanSuspenseQueryKey } from "@/gen/hooks/useGetApiBillingPlanSuspense";
import { getApiClientsSuspenseQueryKey } from "@/gen/hooks/useGetApiClientsSuspense";
import { usePostApiClientCreate } from "@/gen/hooks/usePostApiClientCreate";
import { queryClient } from "@/routes/__root";
import { useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { cloneElement, isValidElement, useState } from "react";
import { toast } from "sonner";
import type { GetApiBillingPlanQueryResponse } from "@/gen/types/GetApiBillingPlan";
import type { CreateClientFormData } from "../form";

type CreateClientSheetProps = {
	Trigger?: React.ReactNode;
};

export default function CreateClientSheet({
	Trigger = (
		<Button size="sm">
			<PlusIcon />
			Adicionar aluno
		</Button>
	),
}: CreateClientSheetProps) {
	const [open, setOpen] = useState(false);
	const [duplicatePhoneError, setDuplicatePhoneError] = useState(false);
	const [duplicateEmailError, setDuplicateEmailError] = useState(false);
	const [upgradePlanOpen, setUpgradePlanOpen] = useState(false);
	const [createdClient, setCreatedClient] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [selectAnamnesisOpen, setSelectAnamnesisOpen] = useState(false);
	const navigate = useNavigate();

	const { mutateAsync: createClient, isPending } = usePostApiClientCreate();

	const handleTriggerClick = () => {
		const plan = queryClient.getQueryData<GetApiBillingPlanQueryResponse>(
			getApiBillingPlanSuspenseQueryKey(),
		);
		const atLimit =
			plan?.remainingClients !== null &&
			plan?.remainingClients !== undefined &&
			plan.remainingClients <= 0;

		if (atLimit) {
			setUpgradePlanOpen(true);
		} else {
			setOpen(true);
		}
	};

	const triggerWithHandler = isValidElement(Trigger)
		? cloneElement(Trigger as React.ReactElement<{ onClick?: () => void }>, {
				onClick: handleTriggerClick,
		  })
		: Trigger;

	const handleSubmit = async (data: CreateClientFormData) => {
		await createClient(
			{
				data: {
					name: data.name,
					email: data.email,
					phone: data.phone,
					goals: data.goals || undefined,
				},
			},
			{
				onSuccess: async (res) => {
					await Promise.all([
						queryClient.invalidateQueries({
							queryKey: getApiClientsSuspenseQueryKey(),
						}),
						queryClient.invalidateQueries({
							queryKey: getApiBillingPlanSuspenseQueryKey(),
						}),
					]);
					setOpen(false);
					setCreatedClient({ id: res.id, name: res.name });
					setSelectAnamnesisOpen(true);
				},
				onError: (error: unknown) => {
					const message = (
						error as { response?: { data?: { message?: string } } }
					)?.response?.data?.message;
					if (message === "Phone number already exists") {
						setDuplicatePhoneError(true);
					} else if (message === "Este email já está cadastrado") {
						setDuplicateEmailError(true);
					} else if (message === "plan_limit_reached") {
						setOpen(false);
						setUpgradePlanOpen(true);
					} else {
						toast.error("Erro ao criar aluno. Tente novamente.");
					}
				},
			},
		);
	};

	return (
		<>
			<UpgradePlanDialog
				open={upgradePlanOpen}
				onOpenChange={setUpgradePlanOpen}
			/>
			{createdClient && (
				<SelectAnamnesisForClientDialog
					clientId={createdClient.id}
					clientName={createdClient.name}
					open={selectAnamnesisOpen}
					onOpenChange={setSelectAnamnesisOpen}
					onDone={() => {
						setSelectAnamnesisOpen(false);
						navigate({
							to: "/trainer/clients/$clientId/overview",
							params: { clientId: createdClient.id },
						});
						setCreatedClient(null);
					}}
				/>
			)}

			<AlertDialog
				open={duplicatePhoneError}
				onOpenChange={setDuplicatePhoneError}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Número já cadastrado</AlertDialogTitle>
						<AlertDialogDescription>
							Já existe um aluno cadastrado com esse número de telefone.
							Verifique o número informado e tente novamente.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction>Entendi</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog
				open={duplicateEmailError}
				onOpenChange={setDuplicateEmailError}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Email já cadastrado</AlertDialogTitle>
						<AlertDialogDescription>
							Este email já está em uso em outra conta. Use outro email ou verifique se o aluno já foi cadastrado.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction>Entendi</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{triggerWithHandler}
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent side="right" className="flex flex-col">
					<SheetHeader>
						<SheetTitle>Criar novo aluno</SheetTitle>
						<SheetDescription>
							Enviamos um email de confirmação para o aluno ativar a conta. Ele ficará inativo no sistema até confirmar.
						</SheetDescription>
					</SheetHeader>
					<div className="flex-1 overflow-y-auto px-4">
						<ClientForm mode="create" onSubmit={handleSubmit} />
					</div>
					<SheetFooter>
						<CreateClientButton disabled={isPending}>
							{isPending ? (
								<>
									<Spinner /> Criando aluno...{" "}
								</>
							) : (
								"Criar Aluno"
							)}
						</CreateClientButton>
						<SheetClose asChild>
							<Button variant="outline" disabled={isPending}>
								Cancelar
							</Button>
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</>
	);
}
