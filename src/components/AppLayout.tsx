import { Navigation } from "@/components/Navigation";
import { MobileTabBar } from "@/components/MobileTabBar";
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
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-skip-link focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
    >
      Skip to content
    </a>
    <Navigation />
    {/* `pb-nav` reserves the height of the fixed tab bar plus the device safe
        area, so it can never sit on top of the footer's last row. Reset at `lg`
        where the bar does not exist. */}
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 pb-nav focus:outline-none lg:pb-0"
    >
      {contained ? <div className={cn("container py-8 md:py-10", contentClassName)}>{children}</div> : children}
    </main>
    <Footer />
    <MobileTabBar />
  </div>
);
