import EditClientSheet from "@/components/clients/sheet/edit-client";
import ClientsTab from "@/components/clients/tab";
import PageTitle from "@/components/core/page-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGetApiClientByIdSuspense } from "@/gen/hooks/useGetApiClientByIdSuspense";
import { usePostApiClientByIdResendActivation } from "@/gen/hooks/usePostApiClientByIdResendActivation";
import { CheckCircle2, HelpCircle, Mail } from "lucide-react";
import { toast } from "sonner";

interface TrainerLayoutClientProps {
	clientId: string;
}

export default function TrainerLayoutClient({ clientId }: TrainerLayoutClientProps) {
	const { data: client, refetch } = useGetApiClientByIdSuspense(clientId);
	const { mutateAsync: resendActivation, isPending } = usePostApiClientByIdResendActivation();

	const handleResendActivation = async () => {
		try {
			await resendActivation({ id: clientId });
			toast.success("Email de ativação reenviado.");
			await refetch();
		} catch {
			toast.error("Não foi possível reenviar o email. Tente novamente.");
		}
	};

	const hasAuthUser = Boolean(client.userId);
	const emailVerified = client.emailVerified === true;
	const showResend = hasAuthUser && !emailVerified;

	return (
		<div className="w-full space-y-6">
			<PageTitle
				title={client.name || client.email || "Aluno sem nome"}
				description={client.goals}
				titleIcon={
					<div className="flex flex-wrap items-center gap-1">
						<Badge variant={client.active ? "success" : "secondary"}>
							{client.active ? "Ativo" : "Inativo"}
						</Badge>
						{hasAuthUser ? (
							emailVerified ? (
								<Badge variant="success" className="gap-1">
									<CheckCircle2 className="h-3.5 w-3.5" />
									Email confirmado
								</Badge>
							) : (
								<Badge variant="secondary">Aguardando confirmação de email</Badge>
							)
						) : (
							<Badge variant="outline">Sem conta no app</Badge>
						)}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger type="button">
									<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent>
									Novos alunos recebem um email para confirmar a conta. Após confirmar, ficam ativos e podem entrar com link mágico.
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				}
				actions={
					<div className="flex items-center gap-2">
						{showResend ? (
							<Button variant="outline" size="sm" onClick={handleResendActivation} disabled={isPending}>
								<Mail className="h-4 w-4" />
								{isPending ? "Enviando..." : "Reenviar email de ativação"}
							</Button>
						) : null}
						<EditClientSheet clientId={clientId} />
					</div>
				}
			/>
			{client.email ? (
				<p className="text-sm text-muted-foreground">
					Email: <span className="text-foreground">{client.email}</span>
				</p>
			) : null}
			<ClientsTab clientId={clientId} />
		</div>
	);
}
