import { cn } from "@/lib/utils";

interface PageLoaderProps {
  label?: string;
  className?: string;
}

export const PageLoader = ({ label = "Loading", className }: PageLoaderProps) => (
  <div className={cn("flex flex-col items-center justify-center gap-4 py-24", className)}>
    <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);
