import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TypographyP } from "@/components/ui/typography";
import type { GetApiClientByIdAnamnesis200 } from "@/gen/types/GetApiClientByIdAnamnesis";

type ClientAnamnesis = GetApiClientByIdAnamnesis200["anamnesis"][number];


export default function AnamnesisAnswersDialog({
  anamnesis,
  open,
  onOpenChange,
}: {
  anamnesis: ClientAnamnesis | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {!anamnesis ? null : (
          <>
            <DialogHeader>
              <DialogTitle>{anamnesis.name}</DialogTitle>
              <DialogDescription>
                Respostas enviadas pelo aluno para esta anamnese.
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto py-1">
              {anamnesis.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="space-y-2 rounded-lg border p-4"
                >
                  <TypographyP className="font-medium">
                    {index + 1}. {question.text}
                  </TypographyP>
                  <TypographyP className="text-sm text-muted-foreground">
                    {question.answer?.trim() || "Sem resposta registrada."}
                  </TypographyP>
                </div>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
