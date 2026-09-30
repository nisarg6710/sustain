import { cn } from "@/lib/utils";

/**
 * Slow-drifting colour field used behind the hero. The blobs animate on
 * `transform` only so the browser keeps them on the compositor, and they are
 * decorative (`aria-hidden`), so screen readers skip them.
 */
export const Aurora = ({ className }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
  >
    <div className="aurora-blob aurora-a absolute -left-[15%] -top-[35%] h-[46rem] w-[46rem] rounded-full bg-primary/20 blur-3xl" />
    <div className="aurora-blob aurora-b absolute -right-[18%] -top-[20%] h-[38rem] w-[38rem] rounded-full bg-accent/20 blur-3xl" />
    <div className="aurora-blob aurora-c absolute bottom-[-40%] left-[25%] h-[40rem] w-[40rem] rounded-full bg-info/15 blur-3xl" />

    {/* Scrim the copy column so the headline keeps its contrast ratio, then fade
        the whole field into the page colour at the edges. */}
    <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/35 to-background/25" />
    <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
  </div>
);
