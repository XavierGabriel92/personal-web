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
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getApiClientByIdSuspenseQueryKey } from "@/gen/hooks/useGetApiClientByIdSuspense";
import { getApiClientsSuspenseQueryKey } from "@/gen/hooks/useGetApiClientsSuspense";
import { usePostApiClientByIdChangeInviteEmail } from "@/gen/hooks/usePostApiClientByIdChangeInviteEmail";
import { getErrorMessage } from "@/lib/client-portal";
import { queryClient } from "@/routes/__root";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const emailFormSchema = z.object({
	email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
});

type EmailForm = z.infer<typeof emailFormSchema>;

interface ChangeClientInviteEmailDialogProps {
	clientId: string;
	accountEmail: string | null | undefined;
}

export default function ChangeClientInviteEmailDialog({
	clientId,
	accountEmail,
}: ChangeClientInviteEmailDialogProps) {
	const [warnOpen, setWarnOpen] = useState(false);
	const [formOpen, setFormOpen] = useState(false);

	const { mutateAsync: changeInviteEmail, isPending } =
		usePostApiClientByIdChangeInviteEmail();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<EmailForm>({
		resolver: zodResolver(emailFormSchema),
		defaultValues: { email: "" },
	});

	const trimmedAccount = accountEmail?.trim();
	const canOfferChange = Boolean(trimmedAccount);

	const handleOpenWarn = () => {
		if (!canOfferChange) return;
		setWarnOpen(true);
	};

	const handleContinueFromWarn = () => {
		setWarnOpen(false);
		reset({ email: "" });
		setFormOpen(true);
	};

	const onSubmitEmail = async (data: EmailForm) => {
		try {
			await changeInviteEmail({
				id: clientId,
				data: { email: data.email.trim() },
			});
			toast.success(
				"Email de convite atualizado. O aluno receberá um novo convite no endereço informado.",
			);
			setFormOpen(false);
			reset({ email: "" });
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: getApiClientsSuspenseQueryKey(),
				}),
				queryClient.invalidateQueries({
					queryKey: getApiClientByIdSuspenseQueryKey(clientId),
				}),
			]);
		} catch (err: unknown) {
			toast.error(
				getErrorMessage(
					err,
					"Não foi possível alterar o email. Verifique se o endereço já está em uso.",
				),
			);
		}
	};

	return (
		<>
			<Button
				type="button"
				size="sm"
				variant="outline"
				className="gap-2"
				disabled={!canOfferChange}
				onClick={handleOpenWarn}
			>
				<MailIcon className="size-4" />
				Alterar email do aluno
			</Button>

			<AlertDialog open={warnOpen} onOpenChange={setWarnOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Alterar email do aluno?
						</AlertDialogTitle>
						<AlertDialogDescription className="space-y-2 text-left">
							<p>
								O aluno será desvinculado da conta atual no app. Ele não
								conseguirá mais entrar com o email antigo até concluir o
								cadastro com o novo convite.
							</p>
							<p>
								Histórico de treinos, programa e dados deste cadastro de aluno
								continuam associados a você — apenas o email de acesso muda.
							</p>
							<p>
								Enviaremos automaticamente um novo convite para o endereço que
								você informar na próxima etapa.
							</p>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
						<AlertDialogAction type="button" onClick={handleContinueFromWarn}>
							Continuar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Dialog
				open={formOpen}
				onOpenChange={(open) => {
					setFormOpen(open);
					if (!open) reset({ email: "" });
				}}
			>
				<DialogContent className="sm:max-w-md">
					<form onSubmit={handleSubmit(onSubmitEmail)}>
						<DialogHeader>
							<DialogTitle>Novo email</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 py-2">
							<Field>
								<FieldLabel htmlFor="new-invite-email">Email</FieldLabel>
								<FieldContent>
									<Input
										id="new-invite-email"
										type="email"
										autoComplete="email"
										placeholder="novo@email.com"
										aria-invalid={errors.email ? "true" : "false"}
										{...register("email")}
									/>
									{errors.email ? (
										<FieldError errors={[{ message: errors.email.message }]} />
									) : null}
								</FieldContent>
							</Field>
						</div>
						<DialogFooter className="gap-2 sm:gap-0">
							<Button
								type="button"
								variant="outline"
								disabled={isPending}
								onClick={() => setFormOpen(false)}
							>
								Voltar
							</Button>
							<Button type="submit" disabled={isPending} className="gap-2">
								{isPending ? (
									<>
										<Spinner className="size-4 shrink-0" />
										Salvando…
									</>
								) : (
									"Confirmar e enviar convite"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
