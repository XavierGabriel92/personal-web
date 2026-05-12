import {
	ImageCrop,
	ImageCropApply,
	ImageCropContent,
	ImageCropReset,
} from "@/components/kibo-ui/image-crop";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

function dataUrlTo512PngFile(dataUrl: string): Promise<File> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = 512;
			canvas.height = 512;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(new Error("Canvas not supported"));
				return;
			}
			ctx.drawImage(img, 0, 0, 512, 512);
			canvas.toBlob(
				(blob) => {
					if (!blob) {
						reject(new Error("Failed to encode PNG"));
						return;
					}
					resolve(new File([blob], "icon.png", { type: "image/png" }));
				},
				"image/png",
			);
		};
		img.onerror = () => reject(new Error("Failed to load image"));
		img.src = dataUrl;
	});
}

type IconCropModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	file: File | null;
	onSave: (file: File) => boolean | Promise<boolean>;
};

export function IconCropModal({ open, onOpenChange, file, onSave }: IconCropModalProps) {
	const [isSaving, setIsSaving] = useState(false);

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (isSaving) return;
				onOpenChange(next);
				if (!next) {
					/* closed */
				}
			}}
		>
			<DialogContent
				className="sm:max-w-[560px]"
				onEscapeKeyDown={(event) => {
					if (isSaving) {
						event.preventDefault();
					}
				}}
				onInteractOutside={(event) => {
					if (isSaving) {
						event.preventDefault();
					}
				}}
			>
				<DialogHeader>
					<DialogTitle>Recortar ícone</DialogTitle>
				</DialogHeader>
				{file ? (
					<ImageCrop
						file={file}
						aspect={1}
						circularCrop={false}
						fixedNaturalCropSize={512}
						keepSelection
						locked
						maxImageSize={2 * 1024 * 1024}
						onCrop={async (dataUrl) => {
							setIsSaving(true);
							try {
								const out = await dataUrlTo512PngFile(dataUrl);
								const saved = await onSave(out);
								if (saved) {
									onOpenChange(false);
								}
							} finally {
								setIsSaving(false);
							}
						}}
					>
						<div className="flex flex-col gap-4">
							<ImageCropContent className="mx-auto max-h-[512px] max-w-[512px]" />
							<DialogFooter className="flex flex-row items-center justify-between gap-2 sm:justify-between">
								<div className="flex gap-2">
									<ImageCropReset asChild>
										<Button
											type="button"
											variant="outline"
											size="sm"
											disabled={isSaving}
										>
											Resetar
										</Button>
									</ImageCropReset>
								</div>
								<div className="flex gap-2">
									<Button
										type="button"
										variant="outline"
										onClick={() => onOpenChange(false)}
										disabled={isSaving}
									>
										Cancelar
									</Button>
									<ImageCropApply asChild>
										<Button type="button" disabled={isSaving}>
											{isSaving ? (
												<>
													<Spinner className="size-4" />
													Salvando...
												</>
											) : (
												"Salvar"
											)}
										</Button>
									</ImageCropApply>
								</div>
							</DialogFooter>
						</div>
					</ImageCrop>
				) : null}
			</DialogContent>
		</Dialog>
	);
}
