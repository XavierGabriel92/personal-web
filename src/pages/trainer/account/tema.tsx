import { ClientHomePhonePreview } from "@/components/account/tema/client-home-phone-preview";
import { IconCropModal } from "@/components/account/tema/icon-crop-modal";
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
import { Label } from "@/components/ui/label";
import { TypographyP, TypographySpanXSmall } from "@/components/ui/typography";
import { useDeleteApiTrainerBrandingIcon } from "@/gen/hooks/useDeleteApiTrainerBrandingIcon";
import { getApiTrainerBrandingSuspenseQueryKey } from "@/gen/hooks/useGetApiTrainerBrandingSuspense";
import { useGetApiTrainerBrandingSuspense } from "@/gen/hooks/useGetApiTrainerBrandingSuspense";
import { usePatchApiTrainerBranding } from "@/gen/hooks/usePatchApiTrainerBranding";
import { usePostApiTrainerBrandingIcon } from "@/gen/hooks/usePostApiTrainerBrandingIcon";
import { queryClient } from "@/routes/__root";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const temaSchema = z.object({
	appName: z.string().max(32),
	welcomeMessage: z.string().max(240),
});

type TemaFormValues = z.infer<typeof temaSchema>;

export function TrainerAccountTemaPage() {
	const { data: branding } = useGetApiTrainerBrandingSuspense();
	const [cropOpen, setCropOpen] = useState(false);
	const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
	const [iconRefreshKey, setIconRefreshKey] = useState(0);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<TemaFormValues>({
		resolver: zodResolver(temaSchema),
		values: {
			appName: branding.appName ?? "",
			welcomeMessage: branding.welcomeMessage ?? "",
		},
	});

	const watched = useWatch({ control: form.control });

	const patchMutation = usePatchApiTrainerBranding();
	const postIconMutation = usePostApiTrainerBrandingIcon();
	const deleteIconMutation = useDeleteApiTrainerBrandingIcon();
	const resolvedIconUrl = branding.iconUrl
		? `${branding.iconUrl}${branding.iconUrl.includes("?") ? "&" : "?"}v=${iconRefreshKey}`
		: null;

	const onSubmit = (values: TemaFormValues) => {
		patchMutation.mutate(
			{
				data: {
					appName: values.appName.trim() || null,
					welcomeMessage: values.welcomeMessage.trim() || null,
				},
			},
			{
				onSuccess: async () => {
					await queryClient.invalidateQueries({
						queryKey: getApiTrainerBrandingSuspenseQueryKey(),
					});
					toast.success("Tema salvo.");
				},
				onError: (error) => {
					toast.error(
						error.response?.data?.message ?? "Não foi possível salvar o tema.",
					);
				},
			},
		);
	};

	const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		e.target.value = "";
		if (!f) return;
		if (!f.type.startsWith("image/")) {
			toast.error("Selecione uma imagem.");
			return;
		}
		setPendingImageFile(f);
		setCropOpen(true);
	};

	const onCroppedFile = async (file: File) => {
		const formData = new FormData();
		formData.append("icon", file);
		try {
			await postIconMutation.mutateAsync({
				data: formData as unknown as { icon: Blob },
			});
			await queryClient.invalidateQueries({
				queryKey: getApiTrainerBrandingSuspenseQueryKey(),
			});
			setIconRefreshKey((current) => current + 1);
			toast.success("Ícone atualizado.");
			return true;
		} catch (error) {
			const err = error as { response?: { data?: { message?: string } } };
			toast.error(err.response?.data?.message ?? "Não foi possível enviar o ícone.");
			return false;
		}
	};

	const onRemoveIcon = () => {
		deleteIconMutation.mutate(undefined, {
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: getApiTrainerBrandingSuspenseQueryKey(),
				});
				setIconRefreshKey((current) => current + 1);
				toast.success("Ícone removido.");
			},
			onError: (error) => {
				toast.error(
					error.response?.data?.message ?? "Não foi possível remover o ícone.",
				);
			},
		});
	};

	return (
		<>
			<div className="space-y-2">
				<h1 className="text-2xl font-bold">Tema</h1>
				<p className="text-sm text-muted-foreground">
					Personalize como o app aparece para seus alunos na home e na tela inicial.
				</p>
			</div>

			<div className="mt-6 flex flex-col gap-8 xl:flex-row xl:gap-8">
				<div className="max-w-xl flex-1 space-y-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="appName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome do app</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Ex.: Studio Silva" maxLength={32} />
										</FormControl>
										<TypographyP className="text-xs text-muted-foreground">
											Nome do app quando seus alunos instalarem o app no seu celular.
										</TypographyP>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="welcomeMessage"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Texto de boas-vindas</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Uma mensagem curta para seus alunos..."
												maxLength={240}
											/>
										</FormControl>
										<TypographyP className="text-xs text-muted-foreground">
											Aparece no topo da home do aluno, junto com o nome do app.
										</TypographyP>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" disabled={patchMutation.isPending}>
								Salvar texto
							</Button>
						</form>
					</Form>

					<div className="space-y-2">
						<Label className="text-sm font-medium">Ícone do app (512×512 px)</Label>
						<TypographyP className="text-xs text-muted-foreground">
							Recomendamos imagem quadrada 512×512 pixels. Ela aparece no atalho na tela inicial.
						</TypographyP>
						<div className="flex flex-wrap items-center gap-4">
							<div className="bg-muted flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border">
								{resolvedIconUrl ? (
									<img
										src={resolvedIconUrl}
										alt=""
										className="size-full object-contain"
									/>
								) : (
									<TypographySpanXSmall className="text-muted-foreground">
										Sem ícone
									</TypographySpanXSmall>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<input
									ref={fileInputRef}
									type="file"
									accept="image/png,image/jpeg,image/webp"
									className="sr-only"
									onChange={onPickFile}
								/>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => fileInputRef.current?.click()}
									disabled={postIconMutation.isPending}
								>
									Escolher imagem
								</Button>
								{resolvedIconUrl ? (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="text-destructive"
										onClick={onRemoveIcon}
										disabled={deleteIconMutation.isPending}
									>
										Remover ícone
									</Button>
								) : null}
							</div>
						</div>
					</div>
				</div>

				<div className="w-full shrink-0 xl:max-w-md">
					<div className="mt-2">
						<ClientHomePhonePreview
							appName={watched.appName?.trim() || null}
							welcomeMessage={watched.welcomeMessage?.trim() || null}
							iconUrl={resolvedIconUrl}
						/>
					</div>
				</div>
			</div>

			<IconCropModal
				open={cropOpen}
				onOpenChange={(v) => {
					setCropOpen(v);
					if (!v) {
						setPendingImageFile(null);
					}
				}}
				file={pendingImageFile}
				onSave={onCroppedFile}
			/>
		</>
	);
}
