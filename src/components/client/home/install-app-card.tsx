import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { TypographyP } from "@/components/ui/typography";
import { useInstallApp } from "@/hooks/use-install-app";
import { Download, Share, Smartphone } from "lucide-react";
import { useState } from "react";

type InstallAppPromoCardProps = {
	isIosLike: boolean;
	isPending?: boolean;
	isDisabled?: boolean;
	onInstallClick?: () => void;
};

export function InstallAppPromoCard({
	isIosLike,
	isPending = false,
	isDisabled = false,
	onInstallClick,
}: InstallAppPromoCardProps) {
	return (
		<Card>
			<CardHeader className="gap-4 sm:grid-cols-[1fr_auto]">
				<div className="space-y-1">
					<CardTitle>Instale o app no seu celular</CardTitle>
					<CardDescription>
						Abra mais rapido pela tela inicial e use como um app.
					</CardDescription>
				</div>
				<div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
					<Smartphone className="size-5" />
				</div>
			</CardHeader>
			<CardContent>
				<div className="bg-muted text-muted-foreground flex items-start gap-2 rounded-lg p-4">
					<Download className="mt-0.5 size-4 shrink-0" />
					<TypographyP>
						{isIosLike
							? "No iPhone, vamos te mostrar como adicionar o app na tela de inicio."
							: "No Android, toque no botao abaixo para abrir o atalho de instalacao do navegador."}
					</TypographyP>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					type="button"
					className="w-full"
					onClick={onInstallClick}
					disabled={isDisabled || isPending}
				>
					<Download className="size-4" />
					Instalar app
				</Button>
			</CardFooter>
		</Card>
	);
}

export function InstallAppCard() {
	const { canPromptInstall, isIosLike, shouldShowInstallCard, promptInstall } =
		useInstallApp();
	const [isIosInstructionsOpen, setIsIosInstructionsOpen] = useState(false);
	const [isPromptPending, setIsPromptPending] = useState(false);

	if (!shouldShowInstallCard) {
		return null;
	}

	const handleInstallClick = async () => {
		if (isIosLike) {
			setIsIosInstructionsOpen(true);
			return;
		}

		if (!canPromptInstall || isPromptPending) {
			return;
		}

		setIsPromptPending(true);
		try {
			await promptInstall();
		} finally {
			setIsPromptPending(false);
		}
	};

	return (
		<>
			<InstallAppPromoCard
				isIosLike={isIosLike}
				isPending={isPromptPending}
				isDisabled={!isIosLike && !canPromptInstall}
				onInstallClick={handleInstallClick}
			/>

			<Dialog
				open={isIosInstructionsOpen}
				onOpenChange={setIsIosInstructionsOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Como instalar no iPhone</DialogTitle>

					</DialogHeader>

					<div className="space-y-4">
						<div className="bg-muted flex items-start gap-2 rounded-lg p-4">
							<Share className="text-primary mt-0.5 size-4 shrink-0" />
							<div className="space-y-1">
								<TypographyP className="font-medium">
									1. Toque em Compartilhar
								</TypographyP>
								<TypographyP className="text-muted-foreground">
									Abra o menu do navegador e toque no botao de compartilhamento.
								</TypographyP>
							</div>
						</div>

						<div className="bg-muted flex items-start gap-2 rounded-lg p-4">
							<Download className="text-primary mt-0.5 size-4 shrink-0" />
							<div className="space-y-1">
								<TypographyP className="font-medium">
									2. Escolha Adicionar a Tela de Inicio
								</TypographyP>
								<TypographyP className="text-muted-foreground">
									Confirme a acao para salvar instalar o app.
								</TypographyP>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							onClick={() => setIsIosInstructionsOpen(false)}
						>
							Entendi
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
