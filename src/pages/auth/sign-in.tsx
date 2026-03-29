import LoginForm from "./forms/login-form";

export default function SignIn() {
	return (
		<div className="flex min-h-svh flex-col">
			<header className="flex items-center gap-1 border-b px-2">
				<img src="/homug_gorilla_logo.svg" alt="homug" className="h-16 w-16" />
				<span className="font-semibold text-xl">Homug</span>
			</header>
			<main className="flex flex-1  justify-center p-6 md:p-10 mt-14">
				<div className="w-full max-w-sm">
					<LoginForm />
				</div>
			</main>
			<footer className="flex items-center justify-center gap-4 border-t px-6 py-4 text-xs text-muted-foreground">
				{/* <div className="flex gap-4">
					<Link to="/" className="hover:text-foreground transition-colors">
						Termos & Condições
					</Link>
					<Link to="/" className="hover:text-foreground transition-colors">
						Política de Privacidade
					</Link>
					<Link to="/" className="hover:text-foreground transition-colors">
						Contato
					</Link>
				</div> */}
				<div>© {new Date().getFullYear()} homug. Todos os direitos reservados.</div>
			</footer>
		</div>
	);
}
