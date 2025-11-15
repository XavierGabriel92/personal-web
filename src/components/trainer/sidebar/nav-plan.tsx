import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { TypographyH5, TypographyP } from "@/components/ui/typography";

export function NavPlan() {
  const { open } = useSidebar()
  if (!open) {
    return null
  }
  return (
    <div className="bg-muted p-4 rounded-md space-y-2">
      <TypographyH5 className="text-sm font-medium">Free trial</TypographyH5>
      <TypographyP className="text-xs text-muted-foreground">
        Você tem 10 dias restantes de sua avaliação gratuita.
      </TypographyP>
      <Button variant="outline" size="sm">
        Upgrade to Pro
      </Button>
    </div>
  )
}