import { TypographyH1, TypographyP } from "@/components/ui/typography";

interface PageTitleProps {
  title: string;
  titleIcon?: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
}

export default function PageTitle({ title, titleIcon, description = '', actions }: PageTitleProps) {
  return (
    <div className="flex items-center justify-between mb-4 mt-2">
      <div>
        <div className="flex items-center gap-2">
          <TypographyH1 className="font-bold tracking-tight">{title}</TypographyH1>
          {titleIcon}
        </div>
        <TypographyP className="text-muted-foreground">
          {description}
        </TypographyP>
      </div>
      {actions}
    </div>
  )
}