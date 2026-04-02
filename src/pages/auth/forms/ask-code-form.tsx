import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	TypographyH4,
	TypographyP,
	TypographySpanXSmall,
} from "@/components/ui/typography";
import { usePostApiLead } from "@/gen/hooks/usePostApiLead";
import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const codeSchema = z.object({
	code: z.string().min(1, "Código é obrigatório"),
});

const brazilianPhoneSchema = z
	.string()
	.min(1, "Telefone é obrigatório")
	.refine(
		(phone) => {
			try {
				const phoneNumber = parsePhoneNumberWithError(phone, "BR");
				return phoneNumber.isValid();
			} catch {
				return false;
			}
		},
		{ message: "Telefone deve ser um número brasileiro válido" },
	);

const waitlistSchema = z.object({
	name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
	email: z.string(),
	phone: brazilianPhoneSchema,
});

type CodeFormType = z.infer<typeof codeSchema>;
type WaitlistFormType = z.infer<typeof waitlistSchema>;

interface AskCodeFormProps {
	onCodeVerified: () => void;
}

function CodeView({
	onCodeVerified,
	onWaitlist,
}: {
	onCodeVerified: () => void;
	onWaitlist: () => void;
}) {
	const [codeError, setCodeError] = useState<string | null>(null);
	const codeForm = useForm<CodeFormType>({
		resolver: zodResolver(codeSchema),
		defaultValues: { code: "" },
	});

	const handleCodeSubmit = (data: CodeFormType) => {
		const validCode = import.meta.env.VITE_SIGNUP_CODE;
		if (data.code === validCode) {
			setCodeError(null);
			onCodeVerified();
		} else {
			setCodeError("Código inválido. Verifique e tente novamente.");
		}
	};

	return (
		<Card className="border-0 shadow-none">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Insira o código do seu convite</CardTitle>
				<CardDescription>
					Quem te convidou te passou um código único. Use-o abaixo para criar
					sua conta.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...codeForm}>
					<form
						onSubmit={codeForm.handleSubmit(handleCodeSubmit)}
						className="flex flex-col gap-8"
					>
						<div className="flex flex-col gap-4">
							<FormField
								control={codeForm.control}
								name="code"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Código do convite</FormLabel>
										<FormControl>
											<Input
												placeholder="••••••••"
												autoComplete="off"
												{...field}
												onChange={(e) => {
													field.onChange(e);
													setCodeError(null);
												}}
											/>
										</FormControl>
										<FormMessage />
										{codeError && (
											<p className="text-destructive text-sm">{codeError}</p>
										)}
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" className="w-full">
							Continuar com o convite
						</Button>
						<div className="flex flex-col gap-6">
							<Separator />
							<div className="bg-muted/50 border-border flex flex-col gap-4 rounded-lg border p-6">
								<div className="flex flex-col gap-2 text-center">
									<TypographyH4 className="font-semibold">
										Não tem um convite ainda?
									</TypographyH4>
									<TypographyP className="text-muted-foreground">
										Entre na lista de espera e avisamos quando abrirmos vagas.
										É rápido e sem compromisso.
									</TypographyP>
								</div>
								<Badge variant="success" className="mx-auto text-sm px-4">
									931 pessoas aguardando na lista
								</Badge>
								<Button
									type="button"
									variant="outline"
									size="lg"
									className="w-full"
									onClick={onWaitlist}
								>
									Quero entrar na lista de espera
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

function WaitlistView({
	onSuccess,
	onBack,
}: {
	onSuccess: () => void;
	onBack: () => void;
}) {
	const { mutateAsync: submitLead, isPending } = usePostApiLead();
	const waitlistForm = useForm<WaitlistFormType>({
		resolver: zodResolver(waitlistSchema),
		defaultValues: { name: "", email: "", phone: "" },
	});

	const handleWaitlistSubmit = async (data: WaitlistFormType) => {
		try {
			await submitLead({
				data: {
					name: data.name,
					email: data.email,
					phone: data.phone,
				},
			});
			onSuccess();
		} catch (error: unknown) {
			const axiosError = error as {
				response?: { status?: number; data?: { error?: string } };
			};
			if (axiosError?.response?.status === 409) {
				waitlistForm.setError("email", {
					message: "Email já cadastrado na lista de espera",
				});
			} else {
				toast.error("Erro ao entrar na lista de espera. Tente novamente.");
			}
		}
	};

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-xl">Lista de espera</CardTitle>
				<CardDescription>
					Deixe seus dados e entraremos em contato quando houver vagas.
				</CardDescription>
			</CardHeader>
			<CardContent className="mt-8">
				<Form {...waitlistForm}>
					<form
						onSubmit={waitlistForm.handleSubmit(handleWaitlistSubmit)}
						className="flex flex-col gap-8"
					>
						<div className="flex flex-col gap-4">
							<FormField
								control={waitlistForm.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome</FormLabel>
										<FormControl>
											<Input type="text" placeholder="Seu nome" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={waitlistForm.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type="email" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={waitlistForm.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Telefone</FormLabel>
										<FormControl>
											<Input
												type="tel"
												placeholder="(99) 99999-9999"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isPending}>
							{isPending ? "Enviando..." : "Entrar na lista de espera"}
						</Button>
						<TypographySpanXSmall className="text-center text-muted-foreground">
							Já recebeu um convite?{" "}
							<Button
								type="button"
								variant="link"
								className="h-auto p-0"
								onClick={onBack}
							>
								<TypographySpanXSmall>Inserir código do convite</TypographySpanXSmall>
							</Button>
						</TypographySpanXSmall>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

function SuccessView({ onBack }: { onBack: () => void }) {
	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-xl">Você está na lista!</CardTitle>
				<CardDescription>
					Entraremos em contato assim que abrirmos novas vagas.
				</CardDescription>
			</CardHeader>
			<CardContent className="mt-8 flex flex-col gap-4 text-center">
				<TypographySpanXSmall className="text-muted-foreground">
					Já recebeu um convite?{" "}
					<Button
						type="button"
						variant="link"
						className="h-auto p-0"
						onClick={onBack}
					>
						<TypographySpanXSmall>Inserir código do convite</TypographySpanXSmall>
					</Button>
				</TypographySpanXSmall>
			</CardContent>
		</Card>
	);
}

export default function AskCodeForm({ onCodeVerified }: AskCodeFormProps) {
	const [view, setView] = useState<"code" | "waitlist" | "success">("code");

	if (view === "success") return <SuccessView onBack={() => setView("code")} />;
	if (view === "waitlist")
		return (
			<WaitlistView
				onSuccess={() => setView("success")}
				onBack={() => setView("code")}
			/>
		);
	return (
		<CodeView
			onCodeVerified={onCodeVerified}
			onWaitlist={() => setView("waitlist")}
		/>
	);
}
