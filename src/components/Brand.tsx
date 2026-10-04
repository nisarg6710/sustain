import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandProps {
  className?: string;
  compact?: boolean;
  inverted?: boolean;
}

export const BrandMark = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground",
      className,
    )}
  >
    <Leaf className="h-[18px] w-[18px]" />
  </span>
);

export const Brand = ({ className, compact = false, inverted = false }: BrandProps) => (
  <Link
    to="/"
    className={cn("group inline-flex items-center gap-2.5", className)}
    aria-label="Sustain home"
  >
    <BrandMark className={inverted ? "bg-accent text-accent-foreground" : undefined} />
    {!compact && (
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "display text-[19px] font-semibold tracking-tight",
            inverted ? "text-white" : "text-foreground",
          )}
        >
          Sustain
        </span>
        <span
          className={cn(
            "mt-1 text-[10px] font-medium uppercase tracking-[0.14em]",
            inverted ? "text-white/60" : "text-muted-foreground",
          )}
        >
          Pre-loved, properly
        </span>
      </span>
    )}
  </Link>
);
