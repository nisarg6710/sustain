import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
  /**
   * Heading level for the title. Defaults to h2 because most pages already
   * have an h1 in PageHeader; h3 caused skips elsewhere.
   */
  headingLevel?: "h2" | "h3" | "h4";
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  headingLevel: Heading = "h2",
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center sm:py-20",
      className,
    )}
  >
    {/* The icon is kept for orientation but sits behind the text rather than in
        a tinted circle above it — a decorative badge on every empty state is one
        of the more recognisable generated-dashboard tells. */}
    <Icon className="h-6 w-6 text-muted-foreground/40" aria-hidden="true" />
    <Heading className="display mt-5 text-xl font-semibold text-foreground sm:text-2xl">{title}</Heading>
    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
    {action && <div className="mt-7">{action}</div>}
  </div>
);
