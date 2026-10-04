import { CircleUser, House, Package, Plus, Search, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { authPathWithNext } from "@/lib/authRedirect";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  icon: LucideIcon;
  /** Resolved against the session, so a signed-out tap still lands usefully. */
  to: (signedIn: boolean) => string;
  isActive: (pathname: string) => boolean;
  /** Rendered in the primary colour; the sell tab is the call to action. */
  accent?: boolean;
}

const tabs: Tab[] = [
  {
    label: "Home",
    icon: House,
    to: () => "/",
    isActive: (pathname) => pathname === "/",
  },
  {
    label: "Browse",
    icon: Search,
    to: () => "/marketplace",
    isActive: (pathname) => pathname.startsWith("/marketplace") || pathname.startsWith("/product/"),
  },
  {
    label: "Sell",
    icon: Plus,
    to: () => "/create-listing",
    isActive: (pathname) => pathname.startsWith("/create-listing"),
    accent: true,
  },
  {
    label: "Orders",
    icon: Package,
    // Signed out, §12.2's rule applies: bounce to sign-in carrying the return
    // path, rather than landing on a page that would immediately bounce again.
    to: (signedIn) => (signedIn ? "/my-orders" : authPathWithNext("/my-orders")),
    isActive: (pathname) => pathname.startsWith("/my-orders"),
  },
  {
    label: "Account",
    icon: CircleUser,
    to: (signedIn) => (signedIn ? "/wallet" : "/auth"),
    isActive: (pathname) =>
      pathname.startsWith("/wallet") ||
      pathname.startsWith("/affiliate-dashboard") ||
      pathname.startsWith("/auth"),
  },
];

/**
 * Fixed bottom tab bar, mobile only.
 *
 * The single most recognisable piece of mobile commerce navigation, and it was
 * missing entirely: every destination on a phone was behind the header
 * hamburger, one thumb-reach and a menu-open away.
 *
 * Deliberate decisions:
 *  - Hidden from `lg`, where the header already carries all five destinations.
 *  - Sits at `z-bottom-nav` (45): below the sticky header (50) so the two can
 *    overlap on a short landscape viewport without the nav winning, and well
 *    below `toast` (100) so a confirmation is never hidden behind it.
 *  - No badges. A count on "Orders" or "Browse" would need a query per tab on
 *    every page, and a dot with no number is ambiguous. Not worth it yet.
 *  - `Sell` is the accent tab. It is the action the header CTA competes with,
 *    and on a marketplace the sell tab earning colour is the norm.
 */
export const MobileTabBar = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-bottom-nav border-t border-border bg-background/95 backdrop-blur",
        "pb-[env(safe-area-inset-bottom)] lg:hidden",
      )}
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active = tab.isActive(pathname);

          return (
            <li key={tab.label}>
              <Link
                to={tab.to(Boolean(user))}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                  tab.accent ? "text-primary" : active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <tab.icon
                  className={cn("h-[22px] w-[22px]", active && !tab.accent && "text-primary")}
                  aria-hidden="true"
                />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
