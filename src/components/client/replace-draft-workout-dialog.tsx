import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReplaceDraftWorkoutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => Promise<void> | void;
	isPending?: boolean;
}

export function ReplaceDraftWorkoutDialog({
	open,
	onOpenChange,
	onConfirm,
	isPending,
}: ReplaceDraftWorkoutDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Substituir treino em andamento?</AlertDialogTitle>
					<AlertDialogDescription>
						Você já tem um treino salvo como rascunho. Se continuar, ele será
						descartado e um novo treino será iniciado.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						className="bg-destructive text-white hover:bg-destructive/90"
						disabled={isPending}
						onClick={() => void onConfirm()}
					>
						Substituir treino
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
