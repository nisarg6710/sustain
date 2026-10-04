import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ClipboardCheck, Scale, Search, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { WishlistButton, type ListingSummary } from "@/components/ListingCard";
import { useActiveListingCount, useActiveListings } from "@/hooks/useActiveListings";
import { conditionVariant, formatCoins, formatCondition } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * MERCHANDISING PLACEHOLDERS — none of this is real. Off by default.
 *
 * The `listings` table has no rating column, no original price and no view
 * tracking, so every number below is invented, and it would be sitting on top of
 * real merchandise: a specific Garmin watch with a specific condition grade.
 * Set the flag to `true` to see the layout a stocked marketplace would use, then
 * wire these three fields to real columns or delete the block.
 *
 * Note what this repo decided before: a fabricated "4.8 from 2,400+ reviews"
 * badge was removed from the testimonials section for exactly this reason, and
 * `changes.md` follow-up 2 flags the placeholder reviews on that page as needing
 * consented replacements before launch.
 */
const SHOWCASE_PLACEHOLDERS = false;

const PLACEHOLDER_SIGNALS = {
  /** Five stars, four filled. */
  stars: [true, true, true, true, false],
  rating: "4.2",
  reviewCount: "128",
  /** Struck through beside the live price. Higher than the real price. */
  wasPrice: 950,
  viewing: 12,
};

/**
 * The two things this hero does not already say somewhere else.
 *
 * Everything else reassurance-shaped is covered: the escrow line is in the lede
 * directly opposite this column, "Free to join / No listing fees / Buyer
 * protection" is the row under the buttons, and `TrustBar` carries four more
 * directly below the fold. What nobody had said was the pair of promises that
 * actually make a pre-loved purchase feel safe — that the condition is written
 * down, and that a dispute stops the money moving. Hence two, not five.
 */
const mechanisms = [
  { icon: ClipboardCheck, label: "Condition graded in writing, dents and all" },
  { icon: Scale, label: "Open a dispute and the payout freezes while we look" },
];

/**
 * Grid geometry for the mosaic. The lead tile takes a 2×2 block; the rest
 * auto-place into the single cells around it.
 *
 * Below `lg` there are only three columns and no explicit rows, so a fourth tile
 * would wrap under an already-uneven composition. Tiles four and five are
 * therefore hidden until the 4×2 grid takes over at `sm`.
 */
const tilesOnNarrow = 3;

const MosaicTile = ({
  listing,
  featured = false,
  className,
}: {
  listing: ListingSummary;
  /** The lead tile: taller, and the only one carrying placeholder signals. */
  featured?: boolean;
  className?: string;
}) => (
  /*
    The wrapper is a sibling of the link, not its parent. `WishlistButton` is a
    real <button>, and a button inside an anchor is invalid markup — it also
    makes the heart unreachable by keyboard without the browser guessing. So the
    link fills the tile absolutely and the two controls sit above it.

    `overflow-hidden` would clip a focus ring drawn outside the box, so the ring
    is drawn inside via focus-within, the same way `ListingCard` does it.
  */
  <div
    className={cn(
      "group relative overflow-hidden rounded-xl bg-secondary ring-1 ring-inset ring-border transition-all hover:ring-primary/40 focus-within:ring-2 focus-within:ring-ring focus-within:ring-inset",
      className,
    )}
  >
    <Link to={`/product/${listing.id}`} className="absolute inset-0 block focus-visible:outline-none">
      {listing.photos?.[0] ? (
        <img
          src={listing.photos[0]}
          alt={listing.title}
          loading="eager"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
          No photo yet
        </span>
      )}

      {/*
        Price leads, title supports. It was the other way round — a 14px title
        over a 12px price — which made the tiles read as a photo gallery rather
        than as merchandise. A buyer scans for the number, not the caption.

        The block stays `aria-hidden` because the link's accessible name is the
        image alt above; announcing the same title twice is worse than silence.
      */}
      <span
        className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-3 pt-10 text-white"
        aria-hidden="true"
      >
        <span className="line-clamp-1 text-xs text-white/75">{listing.title}</span>

        {SHOWCASE_PLACEHOLDERS && featured && (
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-white/70">
            <span className="inline-flex items-center gap-1">
              <span className="inline-flex gap-px text-accent">
                {PLACEHOLDER_SIGNALS.stars.map((filled, index) => (
                  <Star
                    key={index}
                    className={cn("h-3 w-3", filled ? "fill-current" : "text-white/35")}
                  />
                ))}
              </span>
              <span className="tabular-nums">{PLACEHOLDER_SIGNALS.rating}</span>
              <span className="tabular-nums text-white/45">
                ({PLACEHOLDER_SIGNALS.reviewCount})
              </span>
            </span>
            <span className="text-white/30" aria-hidden="true">
              ·
            </span>
            <span className="tabular-nums">{PLACEHOLDER_SIGNALS.viewing} viewing</span>
          </span>
        )}

        <span className="flex items-baseline gap-2">
          <span className="text-sm font-semibold tabular-nums">
            {formatCoins(listing.price_ecocoins)}
          </span>
          {SHOWCASE_PLACEHOLDERS && featured && (
            <span className="text-xs tabular-nums text-white/50 line-through">
              {formatCoins(PLACEHOLDER_SIGNALS.wasPrice)}
            </span>
          )}
        </span>
      </span>
    </Link>

    {/*
      On an opaque `bg-card/90` rather than directly on the photo. The badge
      variants are translucent by design — `bg-success/10`, `bg-info/10` — which
      is correct over a page background and unreadable over a photograph.
    */}
    <span className="absolute left-2 top-2 z-10 rounded bg-card/85 backdrop-blur">
      <Badge variant={conditionVariant[listing.condition] ?? "secondary"}>
        {formatCondition(listing.condition)}
      </Badge>
    </span>

    <WishlistButton
      id={listing.id}
      title={listing.title}
      className="absolute right-2 top-2 z-10 h-8 w-8 rounded-lg"
    />
  </div>
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
  // a grid of grey placeholders is worse than no mosaic at all. Falls back to the
  // first listings regardless once stock exists.
  //
  // Five, because the `sm` grid is four columns by two rows with the lead tile
  // holding a 2×2 block: the remaining four cells need four tiles, and before
  // this there were two of them sitting empty next to a short column.
  const withPhotos = listings.filter((listing) => listing.photos?.[0]);
  const source = withPhotos.length >= 3 ? withPhotos : listings;
  const wide = source.slice(0, 5);
  const narrow = wide.slice(0, tilesOnNarrow);

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

          {/* The mosaic is real merchandise, not decoration: every tile is a live
              listing that links to that product, grades itself and can be saved.
              Compact on a phone — three tiles — and the full composition from `sm`. */}
          <div className="animate-fade-up lg:col-span-5">
            {wide.length > 0 ? (
              <div className="relative">
                {/* Two compositions, one source list. Five tiles would wrap raggedly
                    in three unsized columns, so the narrow layout renders its own
                    three rather than hiding two of them with `hidden sm:block` and
                    leaving them in the accessibility tree at every breakpoint. */}
                <div className="grid grid-cols-3 gap-2 sm:hidden">
                  {narrow.map((listing, index) => (
                    <MosaicTile
                      key={listing.id}
                      listing={listing}
                      featured={index === 0}
                      className={cn("aspect-[4/5]", index === 0 && "col-span-2 row-span-2")}
                    />
                  ))}
                </div>

                <div className="hidden grid-cols-4 grid-rows-2 gap-2.5 sm:grid">
                  {wide.map((listing, index) => (
                    <MosaicTile
                      key={listing.id}
                      listing={listing}
                      featured={index === 0}
                      className={cn(
                        "aspect-[4/5] sm:aspect-auto sm:h-full",
                        index === 0 ? "col-span-2 row-span-2 sm:min-h-[380px]" : "sm:min-h-0",
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

                    {/* The scarcity that is actually true here. Every listing is one
                        physical object, so "one of each" is a fact about the
                        inventory rather than a countdown timer. */}
                    <Separator className="my-3" />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      One of each. Nothing here is the same thing twice.
                    </p>
                  </div>
                )}

                {/* A caption for the imagery, not another row of pills. The
                    equivalent line used to sit under the whole hero as a
                    three-column list, which meant the same reassurance appeared
                    twice within one screenful and mobile got none of it. */}
                <div className="mt-5 border-t border-border pt-4">
                  <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground sm:flex-row sm:gap-6">
                    {mechanisms.map(({ icon: Icon, label }) => (
                      <li key={label} className="flex items-start gap-2.5">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        <span className="leading-snug">{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
    </section>
  );
};