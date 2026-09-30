import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <AppLayout>
      <Card className="mx-auto max-w-2xl">
        <CardContent className="flex flex-col items-center p-10 text-center">
          {/* Decorative: the real page heading is the message below. */}
          <p className="text-5xl font-semibold tabular-nums tracking-tight text-muted-foreground/40" aria-hidden="true">
            404
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Page not found</h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            The page you requested does not exist or has been moved. Check the address, or continue from one of the
            links below.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link to="/">Return to home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/marketplace">
                <Compass className="h-4 w-4" />
                Browse the marketplace
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/faq">Help centre</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default NotFound;
