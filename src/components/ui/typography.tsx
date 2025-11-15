import { cn } from "@/lib/utils";

export const TypographyH1 = ({ className, ...props }: React.ComponentProps<"h1">) => {
  return (
    <h1 className={cn("text-3xl", className)} {...props} />
  );
}

export const TypographyH2 = ({ className, ...props }: React.ComponentProps<"h1">) => {
  return (
    <h2 className={cn("text-2xl", className)} {...props} />
  );
}

export const TypographyH3 = ({ className, ...props }: React.ComponentProps<"h1">) => {
  return (
    <h3 className={cn("text-xl", className)} {...props} />
  );
}

export const TypographyH4 = ({ className, ...props }: React.ComponentProps<"p">) => {
  return (
    <h4 className={cn("text-lg", className)} {...props} />
  );
}

export const TypographyH5 = ({ className, ...props }: React.ComponentProps<"p">) => {
  return (
    <h5 className={cn("text-base", className)} {...props} />
  );
}

export const TypographySpan = ({ className, ...props }: React.ComponentProps<"p">) => {
  return (
    <span className={cn("text-sm ", className)} {...props} />
  );
}

export const TypographySpanXSmall = ({ className, ...props }: React.ComponentProps<"p">) => {
  return (
    <span className={cn("text-xs", className)} {...props} />
  );
}

export const TypographyP = ({ className, ...props }: React.ComponentProps<"p">) => {
  return (
    <p className={cn("text-sm", className)} {...props} />
  );
}