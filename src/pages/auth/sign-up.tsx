import { useState } from "react";
import AskCodeForm from "./forms/ask-code-form";
import RegisterForm from "./forms/register-form";

export default function SignUp() {
	const [codeVerified, setCodeVerified] = useState(false);

	return (
		<div className="flex min-h-svh flex-col">
			<header className="flex items-center gap-1 border-b px-2">
				<img src="/homug_gorilla_logo.svg" alt="homug" className="h-16 w-16" />
				<span className="font-semibold text-xl">Homug</span>
			</header>
			<main className="flex flex-1 justify-center p-6 md:p-10">
				<div className="w-full max-w-sm">
					{codeVerified ? (
						<RegisterForm />
					) : (
						<AskCodeForm
							onCodeVerified={() => setCodeVerified(true)}
						/>
					)}
				</div>
			</main>
			<footer className="flex items-center justify-center gap-4 border-t px-6 py-4 text-xs text-muted-foreground">
				<span>© {new Date().getFullYear()} homug. Todos os direitos reservados.</span>
			</footer>
		</div>
	);
}
