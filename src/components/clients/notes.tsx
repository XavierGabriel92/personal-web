import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getApiClientByIdSuspenseQueryKey, useGetApiClientByIdSuspense } from "@/gen/hooks/useGetApiClientByIdSuspense";
import { usePutApiClientById } from "@/gen/hooks/usePutApiClientById";
import { queryClient } from "@/routes/__root";
import { useCallback, useEffect, useRef, useState } from "react";

interface ClientNotesProps {
  clientId: string;
}

export default function ClientNotes({ clientId }: ClientNotesProps) {
  const { data: client } = useGetApiClientByIdSuspense(clientId);
  const { mutate: updateClient } = usePutApiClientById();

  const [notes, setNotes] = useState(client.goals ?? "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestNotesRef = useRef(notes);

  useEffect(() => {
    latestNotesRef.current = notes;
  }, [notes]);

  const save = useCallback((value: string) => {
    setSaveStatus("saving");
    updateClient(
      {
        id: clientId,
        data: {
          name: client.name,
          phone: client.phone,
          activeRoutineId: client.activeRoutineId,
          goals: value || undefined,
          active: client.active,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getApiClientByIdSuspenseQueryKey(clientId),
          });
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        },
        onError: () => {
          setSaveStatus("idle");
        },
      }
    );
  }, [clientId, client, updateClient]);

  const handleChange = (value: string) => {
    setNotes(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      save(value);
    }, 1000);
  };

  return (
    <Card className="flex-1">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Notas do aluno</CardTitle>
          {saveStatus === "saving" && (
            <span className="text-xs text-muted-foreground">Salvando...</span>
          )}
          {saveStatus === "saved" && (
            <span className="text-xs text-green-600">Salvo</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex pt-4">
        <Textarea
          value={notes}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Digite aqui as notas do aluno"
          className="flex-1 resize-none min-h-32"
        />
      </CardContent>
    </Card>
  );
}