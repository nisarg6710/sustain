import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl py-10 text-center sm:py-16">
        {/* Decorative: the real page heading is the line below. */}
        <p className="display text-7xl font-semibold tabular-nums leading-none text-muted-foreground/25 sm:text-8xl" aria-hidden="true">
          404
        </p>

        <h1 className="display mt-6 text-display font-semibold text-foreground">
          This one&rsquo;s not on the shelf
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          Either the address has a typo, or we moved something and forgot to leave a note. Probably the second, if
          we&rsquo;re honest.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="h-11 rounded-xl px-5">
            <Link to="/marketplace">Browse the marketplace</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11 rounded-xl px-5">
            <Link to="/">Back to the front</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="h-11 rounded-xl px-5">
            <Link to="/faq">Ask us something</Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default NotFound;
