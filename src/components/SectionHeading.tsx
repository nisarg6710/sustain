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
      "flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:flex-wrap",
      align === "center" && "md:flex-col md:items-center md:text-center",
      className,
    )}
  >
    <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="display text-2xl font-semibold text-foreground sm:text-section-title">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lede">
          {description}
        </p>
      )}
    </div>
    {children && (
      <div className="flex w-full shrink-0 flex-wrap items-center gap-3 md:w-auto">{children}</div>
    )}
  </div>
);
