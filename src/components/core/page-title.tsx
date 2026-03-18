import { TypographyH1, TypographyP, TypographySpanXSmall } from "@/components/ui/typography";
import { CloudCheckIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";

interface PageTitleProps {
  title: string;
  titleIcon?: React.ReactNode;
  backButton?: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  isPending?: boolean;
  showPendingState?: boolean;
}

export default function PageTitle({ title, titleIcon, backButton, description = '', actions, isPending, showPendingState = false }: PageTitleProps) {
  return (
    <>
      {showPendingState &&
        <div className="sticky top-[-24px] z-50 flex justify-end py-2 bg-background">{isPending ?
          <TypographySpanXSmall className="flex items-center gap-1"><Spinner className="size-4" /> Salvando dados... </TypographySpanXSmall> :
          <TypographySpanXSmall className="text-green-500 flex items-center gap-1"><CloudCheckIcon className="size-4" /> Dados salvos </TypographySpanXSmall>}
        </div>}

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            {backButton}
            <TypographyH1 className="font-bold tracking-tight">{title}</TypographyH1>
            {titleIcon}
          </div>
          <TypographyP className="text-muted-foreground">
            {description}
          </TypographyP>
        </div>
        {actions}
      </div>
    </>
  )
}