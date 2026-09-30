import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ icon: Icon, title, description, action, className }: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center",
      className,
    )}
  >
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
      <Icon className="h-5 w-5" />
    </span>
    <h3 className="mt-5 text-base font-semibold text-foreground">{title}</h3>
    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);
