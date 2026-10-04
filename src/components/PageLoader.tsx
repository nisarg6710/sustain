import { cn } from "@/lib/utils";

interface PageLoaderProps {
  label?: string;
  className?: string;
}

export const PageLoader = ({ label = "Just a second", className }: PageLoaderProps) => (
  <div className={cn("flex flex-col items-center justify-center gap-4 py-24", className)}>
    {/* A slow pulse rather than a spinner: it reads as waiting rather than as
        something having gone wrong. */}
    <span className="flex h-8 items-end gap-1" aria-hidden="true">
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className="w-1.5 animate-pulse rounded-full bg-primary/70"
          style={{ height: `${10 + bar * 7}px`, animationDelay: `${bar * 140}ms` }}
        />
      ))}
    </span>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);
