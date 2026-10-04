import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActiveListingCount, useActiveListings } from "@/hooks/useActiveListings";
import { formatCoins } from "@/lib/format";
import { cn } from "@/lib/utils";

const assurances = [
  "Your EcoCoins sit with us, not the seller, until you confirm it arrived.",
  "Every listing carries a condition grade and a place to declare the dents.",
  "Open a dispute and the payout freezes while we look into it.",
];

/** Grid geometry for the desktop mosaic: one tall tile, two stacked beside it. */
const tileSpans = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

const MosaicTile = ({
  to,
  title,
  price,
  image,
  className,
}: {
  to: string;
  title: string;
  price: string;
  image?: string | null;
  className?: string;
}) => (
  <Link
    to={to}
    className={cn(
      "group relative overflow-hidden rounded-xl bg-secondary ring-1 ring-inset ring-border transition-all hover:ring-primary/40",
      className,
    )}
  >
    {image ? (
      <img
        src={image}
        alt={title}
        loading="eager"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    ) : (
      <span className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
        No photo yet
      </span>
    )}

    <span
      className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-3 pt-10 text-white"
      aria-hidden="true"
    >
      <span className="line-clamp-1 text-sm font-semibold leading-tight">{title}</span>
      <span className="text-xs text-white/70">{price}</span>
    </span>
  </Link>
);

export const Hero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { listings } = useActiveListings(20);
  const liveCount = useActiveListingCount();

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/marketplace?q=${encodeURIComponent(value)}` : "/marketplace");
  };

  // The mosaic shows real stock, preferring tiles that actually have a photo —
  // a grid of three grey placeholders is worse than no mosaic at all. Falls back
  // to the first three listings regardless once stock exists.
  const withPhotos = listings.filter((listing) => listing.photos?.[0]);
  const mosaic = (withPhotos.length >= 3 ? withPhotos : listings).slice(0, 3);

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="container py-10 sm:py-14 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <p className="eyebrow animate-fade-up">Fresh finds added daily</p>

            <h1 className="display mt-4 max-w-2xl animate-fade-up text-[2rem] font-semibold leading-[1.06] tracking-[-0.026em] sm:text-display-xl lg:text-display-2xl">
              Somebody loved it first.
              <span className="block text-primary">Now it&rsquo;s your turn.</span>
            </h1>

            <p className="mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-muted-foreground sm:text-lede">
              Pre-loved things, honestly graded and priced in EcoCoins. Your money is held until the thing
              actually turns up.
            </p>

            <form
              role="search"
              onSubmit={search}
              className="animate-fade-up mt-7 flex max-w-xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg shadow-black/10 sm:flex-row sm:items-center"
            >
              <label htmlFor="hero-search" className="sr-only">
                Search the marketplace
              </label>
              <div className="relative min-w-0 flex-1">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="hero-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search for cameras, coats, bikes…"
                  className="h-11 border-0 bg-transparent pl-10 text-base shadow-none focus-visible:ring-0 sm:h-12"
                />
              </div>
              <Button type="submit" size="lg" className="h-11 shrink-0 rounded-xl px-6 sm:h-12">
                Search
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Everyone&rsquo;s buying</span>
              {["Mid-century sideboards", "Turntables", "Winter coats"].map((term) => (
                <Link
                  key={term}
                  to={`/marketplace?q=${encodeURIComponent(term)}`}
                  className="rounded-full bg-secondary px-3 py-1.5 font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {term}
                </Link>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-xl px-6">
                <Link to="/marketplace">
                  Explore all products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-6">
                <Link to="/create-listing">Sell an item</Link>
              </Button>
            </div>

            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <li>Free to join</li>
              <li className="text-border" aria-hidden="true">
                /
              </li>
              <li>No listing fees</li>
              <li className="text-border" aria-hidden="true">
                /
              </li>
              <li>Buyer protection included</li>
            </ul>
          </div>

          {/* The mosaic is real merchandise, not decoration: three live listings,
              each linking to that product. Compact on a phone — a single row of
              three — and the full composition from `sm`. */}
          <div className="animate-fade-up lg:col-span-5">
            {mosaic.length > 0 ? (
              <div className="relative">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:grid-rows-2 sm:gap-2.5">
                  {mosaic.map((listing, index) => (
                    <MosaicTile
                      key={listing.id}
                      to={`/product/${listing.id}`}
                      title={listing.title}
                      price={formatCoins(listing.price_ecocoins)}
                      image={listing.photos?.[0]}
                      className={cn(
                        "aspect-[4/5] sm:aspect-auto sm:h-full sm:min-h-[380px]",
                        index === 0 && tileSpans[0],
                        index > 0 && "sm:min-h-0",
                      )}
                    />
                  ))}
                </div>

                {/* A solid card, not a glass one. On a near-black canvas
                    backdrop-blur reads as a grey smear, and the figure inside is
                    a live count rather than the unsourced "12,806 items
                    recirculated" this replaced. */}
                {typeof liveCount === "number" && (
                  <div className="absolute -bottom-4 left-0 rounded-xl border border-border bg-card px-4 py-3 shadow-xl sm:-bottom-5 sm:left-[-1.5rem] sm:px-5 sm:py-4">
                    <p className="eyebrow-muted">Listed right now</p>
                    <p className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="text-xl font-semibold tabular-nums text-foreground">
                        {liveCount.toLocaleString("en-GB")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {liveCount === 1 ? "item" : "items"}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Zero stock: an invitation rather than a placeholder grid. */
              <div className="rounded-2xl border border-dashed border-border bg-card p-7">
                <p className="eyebrow">Nothing listed yet</p>
                <p className="mt-3 text-lg font-semibold text-foreground">
                  The shelves are empty. That&rsquo;s an opportunity, not a problem.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Ten photos and a price is genuinely all it takes. Be the first name on the site.
                </p>
                <Button asChild className="mt-5">
                  <Link to="/create-listing">List the first thing</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop only. On a phone the reassurance list was six lines between the
          headline and the merchandise; the trust strip below the grid makes the
          same three points in one thin band. */}
      <div className="container hidden pb-10 lg:block">
        <ul className="grid gap-6 border-t border-border pt-8 lg:grid-cols-3">
          {assurances.map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
