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
import { TypographySpanXSmall } from "@/components/ui/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
	email: z.string().email("Email inválido"),
	phone: brazilianPhoneSchema,
});

type CodeFormType = z.infer<typeof codeSchema>;
type WaitlistFormType = z.infer<typeof waitlistSchema>;

interface AskCodeFormProps {
	onCodeVerified: () => void;
}

export default function AskCodeForm({ onCodeVerified }: AskCodeFormProps) {
	const [view, setView] = useState<"code" | "waitlist" | "success">("code");
	const [codeError, setCodeError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const codeForm = useForm<CodeFormType>({
		resolver: zodResolver(codeSchema),
		defaultValues: { code: "" },
	});

	const waitlistForm = useForm<WaitlistFormType>({
		resolver: zodResolver(waitlistSchema),
		defaultValues: { name: "", email: "", phone: "" },
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

	const handleWaitlistSubmit = async (data: WaitlistFormType) => {
		setIsLoading(true);
		try {
			const baseURL =
				import.meta.env.VITE_API_URL || "http://localhost:3000";
			await axios.post(
				`${baseURL}/api/lead`,
				{ name: data.name, email: data.email, phone: data.phone },
				{ withCredentials: true },
			);
			setView("success");
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
		} finally {
			setIsLoading(false);
		}
	};

	if (view === "success") {
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
						Já tem um código de acesso?{" "}
						<Button
							type="button"
							variant="link"
							className="h-auto p-0"
							onClick={() => setView("code")}
						>
							<TypographySpanXSmall>Entrar com código</TypographySpanXSmall>
						</Button>
					</TypographySpanXSmall>
				</CardContent>
			</Card>
		);
	}

	if (view === "waitlist") {
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
												<Input {...field} />
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
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Enviando..." : "Entrar na lista de espera"}
							</Button>
							<TypographySpanXSmall className="text-center text-muted-foreground">
								Já tem um código de acesso?{" "}
								<Button
									type="button"
									variant="link"
									className="h-auto p-0"
									onClick={() => setView("code")}
								>
									<TypographySpanXSmall>Entrar com código</TypographySpanXSmall>
								</Button>
							</TypographySpanXSmall>
						</form>
					</Form>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-0 shadow-none">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Código de acesso</CardTitle>
				<CardDescription>
					Insira seu código para criar uma conta.
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
										<FormLabel>Código</FormLabel>
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
							Entrar
						</Button>
						<TypographySpanXSmall className="text-center text-muted-foreground">
							Não tenho um código.{" "}
							<Button
								type="button"
								variant="link"
								className="h-auto p-0"
								onClick={() => setView("waitlist")}
							>
								<TypographySpanXSmall>
									Entrar na lista de espera
								</TypographySpanXSmall>
							</Button>
						</TypographySpanXSmall>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
