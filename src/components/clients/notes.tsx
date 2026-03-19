import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ClientNotesProps {
  clientId: string;
}
export default function ClientNotes({ clientId: _clientId }: ClientNotesProps) {
  return <Card className="flex-1">
    <CardHeader className="border-b ">
      <CardTitle>Notas do aluno</CardTitle>
    </CardHeader>
    <CardContent className="flex-1 flex">
      <Textarea placeholder="Digite aqui as notas do aluno" className="flex-1 resize-none" />
    </CardContent>
  </Card>
}