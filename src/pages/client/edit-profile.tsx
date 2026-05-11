import { ClientPageContainer } from "@/components/client/page-container";
import { ClientScreenHeader } from "@/components/client/screen-header";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { sessionQueryKey } from "@/hooks/auth";
import { useClientSession } from "@/hooks/use-client-session";
import { usePatchApiClientMeProfile } from "@/gen/hooks/usePatchApiClientMeProfile";
import { queryClient } from "@/routes/__root";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useHookFormMask } from "use-mask-input";
import { z } from "zod";

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

const schema = z.object({
	name: z.string().trim().min(1, "Nome é obrigatório"),
	phone: brazilianPhoneSchema,
	email: z.string().email(),
});

type FormValues = z.infer<typeof schema>;

export default function EditClientProfilePage() {
	const navigate = useNavigate();
	const { user } = useClientSession();
	const { mutateAsync: updateProfile, isPending } = usePatchApiClientMeProfile();

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: user?.name ?? "",
			phone: user?.phone ?? "",
			email: user?.email ?? "",
		},
	});

	const registerWithMask = useHookFormMask(form.register);

	const onSubmit = async (values: FormValues) => {
		await updateProfile(
			{
				data: {
					name: values.name.trim(),
					phone: values.phone,
				},
			},
			{
				onSuccess: async () => {
					await queryClient.refetchQueries({ queryKey: sessionQueryKey });
					toast.success("Perfil atualizado.");
					await navigate({ to: "/client/profile" });
				},
				onError: (error) => {
					toast.error(
						error.response?.data?.message ??
							"Não foi possível atualizar o perfil.",
					);
				},
			},
		);
	};

	return (
		<div className="min-h-svh bg-background">
			<ClientScreenHeader title="Editar perfil" />
			<ClientPageContainer withBottomNav={false}>
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome</FormLabel>
									<FormControl>
										<Input autoComplete="name" placeholder="Seu nome" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="phone"
							render={() => (
								<FormItem>
									<FormLabel>Telefone</FormLabel>
									<FormControl>
										<Input
											type="tel"
											placeholder="(99)99999-9999"
											{...registerWithMask(
												"phone",
												["(99)99999-9999", "(99)9999-9999"],
												{ required: true },
											)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input disabled autoComplete="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button className="w-full" disabled={isPending} type="submit">
							{isPending ? (
								<span className="flex items-center gap-2">
									<Spinner className="size-4" />
									Salvando...
								</span>
							) : (
								"Salvar"
							)}
						</Button>
					</form>
				</Form>
			</ClientPageContainer>
		</div>
	);
}
