import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  hint?: string;
  icon?: LucideIcon;
  trend?: { value: string; positive?: boolean };
  className?: string;
}

export const StatCard = ({ label, value, unit, hint, icon: Icon, trend, className }: StatCardProps) => (
  <Card className={cn("rounded-xl p-5", className)}>
    <div className="flex items-start justify-between gap-3">
      <p className="eyebrow-muted">{label}</p>
      {/* No tinted rounded square behind the icon: a row of those is the
          default generated-dashboard stat tile. The glyph sits on its own. */}
      {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />}
    </div>
    <div className="mt-3 flex items-baseline gap-1.5">
      <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">{value}</span>
      {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
    </div>
    <div className="mt-2 flex items-center gap-2 text-xs">
      {trend && (
        <span
          className={cn(
            "font-medium tabular-nums",
            trend.positive === false ? "text-destructive" : "text-success",
          )}
        >
          {trend.value}
        </span>
      )}
      {hint && <span className="text-muted-foreground">{hint}</span>}
    </div>
  </Card>
);
