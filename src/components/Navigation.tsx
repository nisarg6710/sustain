import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  CircleUser,
  LifeBuoy,
  LogOut,
  Menu,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

const MobileLink = ({
  to,
  onNavigate,
  icon: Icon,
  label,
}: {
  to: string;
  onNavigate: () => void;
  icon: LucideIcon;
  label: string;
}) => (
  <Link
    to={to}
    onClick={onNavigate}
    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-muted-foreground"
  >
    <Icon className="h-4 w-4" />
    {label}
  </Link>
);

/**
 * The header search was removed in an earlier pass as a dead control and never
 * replaced. It now deep-links to the marketplace's `?q=` filter, and mirrors that
 * filter back into the field, so the query survives a refresh, a shared link and
 * the back button.
 *
 * Rendered at `xl` and up only. The signed-in header already carries brand, three
 * nav links, the account menu and two CTAs; adding a field below that breakpoint
 * is what previously pushed the header past a 360px viewport.
 */
const HeaderSearch = ({ className, onNavigate }: { className?: string; onNavigate?: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (location.pathname !== "/marketplace") return;
    setQuery(new URLSearchParams(location.search).get("q") ?? "");
  }, [location.pathname, location.search]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    onNavigate?.();
    navigate(trimmed ? `/marketplace?q=${encodeURIComponent(trimmed)}` : "/marketplace");
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={cn("relative", className)}>
      <label htmlFor="header-search" className="sr-only">
        Search inventory
      </label>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="header-search"
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search inventory"
        className="h-9 pl-9"
      />
    </form>
  );
};

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const { isAffiliate } = useIsAffiliate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(`${to}/`);

  const closeMenu = () => setMobileOpen(false);

  const handleSignOut = async () => {
    closeMenu();
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="hidden border-b border-border/70 bg-secondary/40 lg:block">
        <div className="container flex h-9 items-center justify-between text-xs text-muted-foreground">
          <p className="font-medium">Circular commerce infrastructure for pre-owned goods</p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
              Marketplace live
            </span>
            <a href="mailto:support@sustain.eco" className="transition-colors hover:text-foreground">
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
              aria-current={isActive(link.to) ? "page" : undefined}
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
          <HeaderSearch className="hidden w-48 xl:block" />
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
              <Button asChild className="hidden sm:inline-flex">
                <Link to="/create-listing">
                  <Plus className="h-4 w-4" />
                  List an item
                </Link>
              </Button>
            </>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-88 max-w-[85vw] overflow-y-auto p-0 sm:max-w-sm">
              <SheetHeader className="border-b border-border p-4 text-left">
                <SheetTitle className="text-sm font-semibold">Menu</SheetTitle>
              </SheetHeader>

              <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
                {primaryLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(link.to) ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-3 text-sm font-medium transition-colors",
                      isActive(link.to) ? "bg-secondary text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="my-3 h-px bg-border" />

                <HeaderSearch className="mb-4" onNavigate={closeMenu} />

                {user ? (
                  <div className="flex flex-col gap-1">
                    <div className="truncate px-3 pb-2 text-xs text-muted-foreground">{user.email}</div>
                    <MobileLink to="/wallet" onNavigate={closeMenu} icon={Wallet} label="Wallet" />
                    <MobileLink to="/my-orders" onNavigate={closeMenu} icon={ShoppingBag} label="Orders" />
                    {isAffiliate && (
                      <MobileLink
                        to="/affiliate-dashboard"
                        onNavigate={closeMenu}
                        icon={BarChart3}
                        label="Affiliate reporting"
                      />
                    )}
                    <MobileLink to="/create-listing" onNavigate={closeMenu} icon={Package} label="List an item" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-medium text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/auth" onClick={closeMenu}>
                        Sign in
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link to="/create-listing" onClick={closeMenu}>
                        <Plus className="h-4 w-4" />
                        List an item
                      </Link>
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Accounts are free. No listing fees to get started.
                    </p>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
