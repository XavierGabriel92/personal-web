import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TypographyH4, TypographySpan } from "@/components/ui/typography";
import { ChevronLeftIcon, UserIcon } from "lucide-react";
import { useState } from "react";

interface Trainer {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
  email: string;
}

interface ProfileClientSheetProps {
  trainer: Trainer;
  trigger?: React.ReactNode;
}

const defaultTrigger = <Button size="sm"> <UserIcon /> Perfil do Treinador </Button>

export default function ProfileClientSheet({
  trainer,
  trigger = defaultTrigger,
}: ProfileClientSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col gap-2" hideCloseButton>

        <SheetHeader className="flex items-center gap-2 relative border-b pb-2">
          <SheetClose asChild className="absolute left-0 top-[50%] -translate-y-1/2">
            <ChevronLeftIcon className="size-8 text-primary" />
          </SheetClose>
          <SheetTitle className="text-lg font-bold">Perfil do Treinador</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center gap-4 px-4">
          <Avatar className="size-40">
            <AvatarImage src={trainer.avatar} alt={trainer.name} />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-2 w-full">
            <div>
              <TypographySpan className="text-muted-foreground">
                Treinador
              </TypographySpan>
              <TypographyH4>{trainer.name}</TypographyH4>
            </div>
            <div>
              <TypographySpan className="text-muted-foreground">
                Email
              </TypographySpan>
              <TypographyH4>{trainer.email}</TypographyH4>
            </div>

          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

