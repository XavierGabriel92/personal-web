import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { getApiClientByIdInviteQueryKey } from "@/gen/hooks/useGetApiClientByIdInvite";
import { useGetApiClientByIdInvite } from "@/gen/hooks/useGetApiClientByIdInvite";
import { usePostApiClientByIdResendActivation } from "@/gen/hooks/usePostApiClientByIdResendActivation";
import { getErrorMessage } from "@/lib/client-portal";
import { queryClient } from "@/routes/__root";
import { MailIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ResendClientInviteDialogProps {
	clientId: string;
}

function formatExpiresAt(iso: string | undefined) {
	if (!iso) return null;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(d);
}

export default function ResendClientInviteDialog({
	clientId,
}: ResendClientInviteDialogProps) {
	const [open, setOpen] = useState(false);

	const inviteQuery = useGetApiClientByIdInvite(clientId, {
		query: { enabled: open },
	});

	const { mutateAsync: resendActivation, isPending: isSending } =
		usePostApiClientByIdResendActivation();

	const link = inviteQuery.data?.link;
	const expiresLabel = formatExpiresAt(inviteQuery.data?.expiresAt);

	const handleCopyLink = async () => {
		if (!link) {
			toast.error("Nenhum link disponível para copiar.");
			return;
		}
		try {
			await navigator.clipboard.writeText(link);
			toast.success("Link copiado para a área de transferência.");
		} catch {
			toast.error("Não foi possível copiar o link.");
		}
	};

	const handleSendLink = async () => {
		try {
			await resendActivation({ id: clientId });
			toast.success(
				"Se o email estiver correto, o aluno receberá o link em instantes.",
			);
			await queryClient.invalidateQueries({
				queryKey: getApiClientByIdInviteQueryKey(clientId),
			});
		} catch (err: unknown) {
			toast.error(
				getErrorMessage(
					err,
					"Não foi possível enviar o link por email. Tente novamente.",
				),
			);
		}
	};

	const renderBody = () => {
		if (inviteQuery.isError) {
			const message = getErrorMessage(
				inviteQuery.error,
				"Não foi possível carregar o link. Feche e tente de novo.",
			);
			return <p className="text-sm text-destructive">{message}</p>;
		}

		if (link) {
			return (
				<div className="space-y-3 text-sm text-muted-foreground">
					<p>
						Clique em "Reenviar link por email" para enviar o{" "}
						<span className="text-foreground font-medium">link</span>{" "}
						para o aluno via email ou copie e compartilhe por outro canal.
					</p>
					{expiresLabel ? (
						<p>
							Validade deste link:{" "}
							<span className="text-foreground">{expiresLabel}</span>
						</p>
					) : null}
				</div>
			);
		}

		return (
			<p className="text-sm text-muted-foreground">
				Não foi possível obter um link para este aluno.
			</p>
		);
	};

	return (
		<>
			<Button
				type="button"
				size="sm"
				variant="outline"
				className="gap-2"
				onClick={() => setOpen(true)}
			>
				<MailIcon className="size-4" />
				Enviar link de acesso
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Enviar link de acesso</DialogTitle>
					</DialogHeader>
					{renderBody()}
					<DialogFooter className="flex-col gap-2 sm:flex-col">
						<div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
							<Button
								type="button"
								variant="secondary"
								disabled={!link || inviteQuery.isLoading}
								onClick={() => void handleCopyLink()}
							>
								Copiar link
							</Button>
							<Button
								type="button"
								className="gap-2"
								disabled={
									inviteQuery.isLoading ||
									inviteQuery.isError ||
									!link ||
									isSending
								}
								onClick={() => void handleSendLink()}
							>
								{isSending ? (
									<>
										<Spinner className="size-4 shrink-0" />
										Enviando…
									</>
								) : (
									"Reenviar link por email"
								)}
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
