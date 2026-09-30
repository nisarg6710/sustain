import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  CircleUser,
  LifeBuoy,
  LogOut,
  Menu,
  Package,
  Plus,
  ShoppingBag,
  Wallet,
  X,
} from "lucide-react";

import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useIsAffiliate } from "@/hooks/useIsAffiliate";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { label: "Marketplace", to: "/marketplace" },
  { label: "How it works", to: "/how-it-works" },
  { label: "Support", to: "/faq" },
];

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const { isAffiliate } = useIsAffiliate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(`${to}/`);

  const handleSignOut = async () => {
    setMobileOpen(false);
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="hidden border-b border-border/70 bg-secondary/40 lg:block">
        <div className="container flex h-9 items-center justify-between text-xs text-muted-foreground">
          <p className="font-medium">Circular commerce infrastructure for pre-owned goods</p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              All systems operational
            </span>            <a href="mailto:support@sustain.eco" className="transition-colors hover:text-foreground">
              support@sustain.eco
            </a>
            <Link to="/faq" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
              <LifeBuoy className="h-3.5 w-3.5" />
              Help centre
            </Link>
          </div>
        </div>
      </div>

      <div className="container flex h-16 items-center justify-between gap-6">
        <Brand />

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {primaryLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.to) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
              {isActive(link.to) && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden gap-2 md:inline-flex">
                    <CircleUser className="h-4 w-4 text-primary" />
                    <span className="max-w-[140px] truncate">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-foreground">
                      {user.user_metadata?.full_name || "Account"}
                    </span>
                    <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/wallet">
                      <Wallet className="mr-2 h-4 w-4" />
                      Wallet
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-orders">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  {isAffiliate && (
                    <DropdownMenuItem asChild>
                      <Link to="/affiliate-dashboard">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Affiliate reporting
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button asChild className="hidden md:inline-flex">
                <Link to="/create-listing">
                  <Plus className="h-4 w-4" />
                  List an item
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/create-listing">
                  <Plus className="h-4 w-4" />
                  List an item
                </Link>
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <nav aria-label="Mobile" className="container flex flex-col py-4">
            {primaryLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-2 py-3 text-sm font-medium transition-colors",
                  isActive(link.to) ? "bg-secondary text-foreground" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="my-3 h-px bg-border" />

            {user ? (
              <div className="flex flex-col gap-1">
                <div className="px-2 pb-2 text-xs text-muted-foreground">{user.email}</div>
                <Link
                  to="/wallet"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-md px-2 py-3 text-sm font-medium text-muted-foreground"
                >
                  <Wallet className="h-4 w-4" />
                  Wallet
                </Link>
                <Link
                  to="/my-orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-md px-2 py-3 text-sm font-medium text-muted-foreground"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Orders
                </Link>
                {isAffiliate && (
                  <Link
                    to="/affiliate-dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-md px-2 py-3 text-sm font-medium text-muted-foreground"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Affiliate reporting
                  </Link>
                )}
                <Link
                  to="/create-listing"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-md px-2 py-3 text-sm font-medium text-muted-foreground"
                >
                  <Package className="h-4 w-4" />
                  List an item
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 rounded-md px-2 py-3 text-left text-sm font-medium text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 px-2">
                <Button asChild variant="outline">
                  <Link to="/auth" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">Accounts are free. No listing fees to get started.</p>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
