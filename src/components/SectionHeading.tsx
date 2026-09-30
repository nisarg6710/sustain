import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  children,
}: SectionHeadingProps) => (
  <div
    className={cn(
      "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
      align === "center" && "md:flex-col md:items-center md:text-center",
      className,
    )}
  >
    <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-[32px] md:leading-[1.15]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
    {children && <div className="flex shrink-0 items-center gap-3">{children}</div>}
  </div>
);
