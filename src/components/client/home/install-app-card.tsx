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
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { TypographyP } from "@/components/ui/typography";
import { useInstallApp } from "@/hooks/use-install-app";
import { Download, Plus, Share, Smartphone } from "lucide-react";
import { useState } from "react";

type InstallAppPromoCardProps = {
	isIosLike: boolean;
	isPending?: boolean;
	isDisabled?: boolean;
	onInstallClick?: () => void;
};

export function InstallAppPromoCard({
	isPending = false,
	isDisabled = false,
	onInstallClick,
}: InstallAppPromoCardProps) {
	return (
		<Card>
			<CardHeader className="gap-4 sm:grid-cols-[1fr_auto]">
				<div className="space-y-1">
					<CardTitle>
						<div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
							<Smartphone className="size-5" />
						</div>
						Instale o app no seu celular</CardTitle>
				</div>

			</CardHeader>
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
									Procure pelo icone <Share className="text-primary mt-0.5 size-4 shrink-0" /> proximo ao endereço do site.
								</TypographyP>
							</div>
						</div>

						<div className="bg-muted flex items-start gap-2 rounded-lg p-4">
							<Download className="text-primary mt-0.5 size-4 shrink-0" />
							<div className="space-y-1">
								<TypographyP className="font-medium">
									2. Procure pela opção "Adicionar a Tela de Inicio
								</TypographyP>
								<TypographyP className="text-muted-foreground">
									Em alguns casos você precisa entrar em "Ver mais" para encontrar a opção.
								</TypographyP>
							</div>
						</div>

						<div className="bg-muted flex items-start gap-2 rounded-lg p-4">
							<Plus className="text-primary mt-0.5 size-4 shrink-0" />
							<div className="space-y-1">
								<TypographyP className="font-medium">
									3. Basta clicar em "Adicionar"
								</TypographyP>
								<TypographyP className="text-muted-foreground">
									Pronto, o app vai ser instalado no seu celular.
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
