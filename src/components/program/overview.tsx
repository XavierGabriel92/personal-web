import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { TypographySpan } from "@/components/ui/typography";
import { formatDateToText } from "@/lib/date";
import { Link } from "@tanstack/react-router";
import { CalendarIcon, CalendarPlusIcon, PlusIcon } from "lucide-react";

interface ProgramOverviewProps {
  clientId: string;
}

const mockProgram = {
  "id": "18761fea-f6ec-4e2b-ac3f-939eadf065f0",
  "title": "Full Body x3",
  "notes": "This is a full body 3 day program. You should do it 3 times a week and rest between days.",
  "durationDays": 28,
  "startDate": "2025-10-31",
  "createdAt": "2025-10-31",
  workoutsSize: 4
}

export default function ProgramOverview({ clientId }: ProgramOverviewProps) {
  const data = mockProgram;
  const hasActiveProgram = data.title;
  return (
    <Card>
      {hasActiveProgram ? <>
        <CardHeader className="items-center border-b ">
          <CardTitle>Programa ativo</CardTitle>
          {hasActiveProgram && (
            <CardAction>
              <Button variant="link"
                size="sm" className="p-0">
                <Link to="/trainer/clients/$clientId/program" params={{ clientId: clientId }}>
                  Editar programa
                </Link>
              </Button>
            </CardAction>
          )}

        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div><CalendarIcon /></div>
            <div className="flex flex-col gap-1">
              <TypographySpan className="font-medium">
                {data.title}
              </TypographySpan>
              <TypographySpan className="text-muted-foreground font-normal">
                {`${data.workoutsSize} treinos - Data de início: ${formatDateToText(data.startDate)}`}
              </TypographySpan>
            </div>
          </div>
        </CardContent>
      </> :
        <Empty className="p-0 md:p-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CalendarPlusIcon />
            </EmptyMedia>
            <EmptyTitle>Nenhum programa ativo</EmptyTitle>
            <EmptyDescription>Esse cliente ainda não possui um programa ativo</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>
              <PlusIcon />
              Criar programa
            </Button>
          </EmptyContent>
        </Empty>}
    </Card>
  )
}