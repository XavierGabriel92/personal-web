import { NextWorkoutCard } from "@/components/client/home/next-workout-card";
import { PendingAnamnesisCard } from "@/components/client/home/pending-anamnesis-card";
import { WelcomeCard } from "@/components/client/home/welcome-card";
import { ClientPageContainer } from "@/components/client/page-container";
import { TypographySpanXSmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Dumbbell, House, UserRound } from "lucide-react";
import type { ComponentProps } from "react";

const PHONE_WIDTH = 320;
const PHONE_HEIGHT = (PHONE_WIDTH * 844) / 390;
const PHONE_SCALE = 0.7;

type ClientHomePhonePreviewProps = {
	appName: string | null;
	welcomeMessage: string | null;
	iconUrl: string | null;
	className?: string;
};

const previewAnamnesis = {
	id: "preview-anamnesis",
	name: "Avaliação Inicial Completa",
	status: "PENDING",
	answeredCount: 0,
	questionCount: 12,
} as ComponentProps<typeof PendingAnamnesisCard>["anamnesis"];

const previewWorkout = {
	id: "preview-workout",
	name: "Treino 1 - Push",
	description: "",
	exercises: [
		{ exerciseData: { name: "Flexão de braços" } },
		{ exerciseData: { name: "Flexão de braços (com carga)" } },
	],
} as ComponentProps<typeof NextWorkoutCard>["workout"];

const previewTabs = [
	{ label: "Home", icon: House, isActive: true },
	{ label: "Treinos", icon: Dumbbell, isActive: false },
	{ label: "Perfil", icon: UserRound, isActive: false },
];

function PreviewNavBar() {
	return (
		<div className="border-border/80 absolute inset-x-0 bottom-0 border-t bg-background/95 backdrop-blur">
			<nav className="grid grid-cols-3 gap-1 p-2">
				{previewTabs.map((tab) => {
					const Icon = tab.icon;

					return (
						<div
							key={tab.label}
							className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-2 py-2"
						>
							<Icon
								className={cn(
									"size-5",
									tab.isActive ? "text-primary" : "text-muted-foreground",
								)}
							/>
							<TypographySpanXSmall
								className={cn(tab.isActive && "text-primary")}
							>
								{tab.label}
							</TypographySpanXSmall>
						</div>
					);
				})}
			</nav>
		</div>
	);
}

export function ClientHomePhonePreview({
	appName,
	welcomeMessage,
	iconUrl,
	className,
}: ClientHomePhonePreviewProps) {
	return (
		<div
			className={cn("mx-auto", className)}
			style={{
				width: `${PHONE_WIDTH * PHONE_SCALE}px`,
				height: `${PHONE_HEIGHT * PHONE_SCALE}px`,
			}}
		>
			<div
				className="origin-top-left"
				style={{
					width: `${PHONE_WIDTH}px`,
					height: `${PHONE_HEIGHT}px`,
					transform: `scale(${PHONE_SCALE})`,
				}}
			>
				<div className="bg-foreground relative size-full rounded-[40px] border border-border p-2 shadow-xl">
					<div className="bg-background relative size-full overflow-hidden rounded-[32px] border border-border">
						<div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center">
							<div className="bg-foreground h-7 w-32 rounded-full" />
						</div>

						<div className="pointer-events-none size-full overflow-hidden select-none">
							<ClientPageContainer
								withBottomNav={false}
								className="pb-24 pt-14"
							>
								<div className="space-y-2">
									<WelcomeCard
										appName={appName}
										welcomeMessage={welcomeMessage}
										iconUrl={iconUrl}
									/>
									<PendingAnamnesisCard anamnesis={previewAnamnesis} />
									<NextWorkoutCard
										workout={previewWorkout}
										onStart={() => undefined}
									/>
								</div>
							</ClientPageContainer>

							<PreviewNavBar />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
