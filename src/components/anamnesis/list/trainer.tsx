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
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/input";
import { TypographyP, TypographySpan } from "@/components/ui/typography";
import { getApiAnamnesisSuspenseQueryKey } from "@/gen/hooks/useGetApiAnamnesisSuspense";
import { useDeleteApiAnamnesisById } from "@/gen/hooks/useDeleteApiAnamnesisById";
import { useGetApiAnamnesisSuspense } from "@/gen/hooks/useGetApiAnamnesisSuspense";
import { queryClient } from "@/routes/__root";
import type { Anamnesis } from "@/schemas";
import { useNavigate } from "@tanstack/react-router";
import { ClipboardList, MoreVertical, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CreateAnamnesisSheet from "../sheet/create-anamnesis";

export default function TrainerAnamnesisList() {
  const [search, setSearch] = useState("");
  const { data } = useGetApiAnamnesisSuspense();

  return (
    <div className="flex flex-col gap-4">
      {data.anamnesis.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ClipboardList />
            </EmptyMedia>
            <EmptyTitle>Nenhuma anamnese criada</EmptyTitle>
            <EmptyDescription>Crie uma anamnese para começar</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CreateAnamnesisSheet />
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <SearchInput
              placeholder="Pesquisar anamnese"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <CreateAnamnesisSheet />
          </div>

          <div className="flex flex-col gap-4">
            {data.anamnesis
              .filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <AnamnesisCard key={item.id} anamnesis={item as Anamnesis} />
              ))}
          </div>
        </>
      )}
    </div>
  );
}

function AnamnesisCard({ anamnesis }: { anamnesis: Anamnesis }) {
  const navigate = useNavigate();

  const navigateToAnamnesis = () => {
    navigate({ to: "/trainer/anamnesis/$anamnesisId", params: { anamnesisId: anamnesis.id } });
  };

  return (
    <Card className="gap-0 cursor-pointer" onClick={navigateToAnamnesis}>
      <CardHeader>
        <CardTitle>{anamnesis.name}</CardTitle>
        <CardAction className="flex items-center gap-2">
          <TypographySpan className="text-muted-foreground">
            {anamnesis.questions.length} {anamnesis.questions.length === 1 ? "pergunta" : "perguntas"}
          </TypographySpan>
          <AnamnesisActions anamnesis={anamnesis} />
        </CardAction>
      </CardHeader>
      {anamnesis.description && (
        <CardContent>
          <TypographyP className="text-muted-foreground text-sm">{anamnesis.description}</TypographyP>
        </CardContent>
      )}
    </Card>
  );
}

function DeleteAnamnesisDialog({
  anamnesis,
  open,
  onOpenChange,
  onConfirm,
}: {
  anamnesis: Anamnesis;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar anamnese</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar a anamnese "{anamnesis.name}"? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AnamnesisActions({ anamnesis }: { anamnesis: Anamnesis }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { mutateAsync: deleteAnamnesis } = useDeleteApiAnamnesisById();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({ to: "/trainer/anamnesis/$anamnesisId", params: { anamnesisId: anamnesis.id } });
  };

  const handleDelete = async () => {
    await deleteAnamnesis(
      { id: anamnesis.id },
      {
        onSuccess: async () => {
          toast.success(`Anamnese "${anamnesis.name}" deletada com sucesso!`);
          await queryClient.invalidateQueries({
            queryKey: getApiAnamnesisSuspenseQueryKey(),
          });
        },
        onError: () => {
          toast.error("Erro ao deletar anamnese. Tente novamente.");
        },
      }
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
            onClick={handleEdit}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar anamnese
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault();
              setDeleteDialogOpen(true);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Trash className="mr-2 h-4 w-4" />
            Deletar anamnese
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteAnamnesisDialog
        anamnesis={anamnesis}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}
