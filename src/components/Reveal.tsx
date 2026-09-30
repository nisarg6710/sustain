import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  /** Stagger in milliseconds. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}

/**
 * Fades and lifts its children the first time they scroll into view. Pure CSS
 * transition driven by an IntersectionObserver, so it costs nothing while the
 * user is scrolling and degrades to "visible" without observer support.
 */
export const Reveal = ({ children, delay = 0, className, as: Tag = "div" }: RevealProps) => {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", inView && "is-revealed", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
};
