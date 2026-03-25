import SelectAnamnesisForClientDialog from "@/components/anamnesis/dialog/select-anamnesis-for-client";
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
	SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { getApiClientsSuspenseQueryKey } from "@/gen/hooks/useGetApiClientsSuspense";
import { usePostApiClientCreate } from "@/gen/hooks/usePostApiClientCreate";
import { queryClient } from "@/routes/__root";
import { useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ClientFormData } from "../form";

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
	const [createdClient, setCreatedClient] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [selectAnamnesisOpen, setSelectAnamnesisOpen] = useState(false);
	const navigate = useNavigate();

	const { mutateAsync: createClient, isPending } = usePostApiClientCreate();

	const handleSubmit = async (data: ClientFormData) => {
		await createClient(
			{
				data: {
					name: data.name,
					phone: data.phone,
					goals: data.goals || undefined,
					active: data.active ?? true,
				},
			},
			{
				onSuccess: async (res) => {
					await queryClient.invalidateQueries({
						queryKey: getApiClientsSuspenseQueryKey(),
					});
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
					} else {
						toast.error("Erro ao criar aluno. Tente novamente.");
					}
				},
			},
		);
	};

	return (
		<>
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

			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>{Trigger}</SheetTrigger>
				<SheetContent side="right" className="flex flex-col">
					<SheetHeader>
						<SheetTitle>Criar novo aluno</SheetTitle>
						<SheetDescription>
							Preencha os dados abaixo para criar um novo aluno.
						</SheetDescription>
					</SheetHeader>
					<div className="flex-1 overflow-y-auto px-4">
						<ClientForm onSubmit={handleSubmit} />
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
