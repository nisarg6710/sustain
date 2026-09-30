import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  contained?: boolean;
}

export const AppLayout = ({
  children,
  className,
  contentClassName,
  contained = true,
}: AppLayoutProps) => (
  <div className={cn("flex min-h-screen flex-col bg-background", className)}>
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
    >
      Skip to content
    </a>
    <Navigation />
    <main id="main-content" className="flex-1">
      {contained ? <div className={cn("container py-8 md:py-10", contentClassName)}>{children}</div> : children}
    </main>
    <Footer />
  </div>
);
