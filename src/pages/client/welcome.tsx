import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

/** Placeholder store links until the app is listed. */
const APP_STORE_URL = "https://apps.apple.com/app/homug/id000000000";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.homug.app";

export default function ClientWelcomePage() {
	return (
		<div className="flex min-h-svh flex-col">
			<header className="flex items-center gap-1 border-b px-2">
				<img src="/homug_gorilla_logo.svg" alt="homug" className="h-16 w-16" />
				<span className="font-semibold text-xl">Homug</span>
			</header>
			<main className="flex flex-1 items-center justify-center px-6 py-8 md:px-10">
				<Card className="w-full max-w-md shrink-0">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl">Tudo certo</CardTitle>
						<CardDescription>
							Sua conta está pronta. Baixe o app Homug no celular e entre com o mesmo email
							e a senha que você acabou de criar.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<Button asChild className="w-full">
							<a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
								Baixar na App Store
							</a>
						</Button>
						<Button asChild variant="secondary" className="w-full">
							<a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
								Baixar no Google Play
							</a>
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
