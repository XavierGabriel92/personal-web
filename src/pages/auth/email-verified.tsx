import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const ERROR_COPY: Record<string, string> = {
	token_expired:
		"Este link expirou. Solicite um novo email de confirmação ou fale com seu personal.",
	expired: "Este link expirou. Solicite um novo email de confirmação.",
	invalid_token: "Este link não é válido. Verifique se copiou o endereço completo.",
	user_not_found: "Não encontramos esta conta.",
};

type EmailVerifiedPageProps = {
	error?: string;
};

export default function EmailVerifiedPage({ error }: EmailVerifiedPageProps) {
	const message =
		error && ERROR_COPY[error]
			? ERROR_COPY[error]
			: error
				? "Não foi possível confirmar o email. Tente novamente ou peça um novo link."
				: null;

	return (
		<div className="flex min-h-svh flex-col">
			<header className="flex items-center gap-1 border-b px-2">
				<img src="/homug_gorilla_logo.svg" alt="homug" className="h-16 w-16" />
				<span className="font-semibold text-xl">Homug</span>
			</header>
			<main className="mt-14 flex flex-1 justify-center p-6 md:p-10">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						{message ? (
							<>
								<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
									<AlertCircle className="h-6 w-6" aria-hidden />
								</div>
								<CardTitle>Não deu certo</CardTitle>
								<CardDescription>{message}</CardDescription>
							</>
						) : (
							<>
								<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
									<CheckCircle2 className="h-6 w-6" aria-hidden />
								</div>
								<CardTitle>Email confirmado</CardTitle>
								<CardDescription>
									Sua conta está ativa. Treinadores: use o link mágico para entrar. Se você
									é aluno e já definiu a senha no site, entre pelo app com email e senha.
								</CardDescription>
							</>
						)}
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<Button asChild>
							<Link to="/sign-in">Ir para entrar</Link>
						</Button>
					</CardContent>
				</Card>
			</main>
			<footer className="flex items-center justify-center gap-4 border-t px-6 py-4 text-xs text-muted-foreground">
				<div>© {new Date().getFullYear()} homug. Todos os direitos reservados.</div>
			</footer>
		</div>
	);
}
