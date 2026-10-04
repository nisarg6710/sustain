import { Link } from "react-router-dom";
import { PackagePlus } from "lucide-react";

import { ProductGrid } from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { useActiveListingCount, useActiveListings } from "@/hooks/useActiveListings";

/**
 * The homepage's merchandise.
 *
 * Twenty listings in one grid. Two rows of four on desktop is a sample; five rows
 * is a catalogue, and the feedback was "displaying many products first" — so the
 * number is the argument, not the layout.
 *
 * The previous version ran two grids ("Just listed" and "Priced to move") behind
 * a JavaScript de-duplication pass, which cost a second query and, on a small
 * catalogue, left the second grid nearly empty. One grid of twenty is simpler and
 * cannot repeat itself.
 *
 * The count beside the heading is a live `head: true` count, not the length of
 * this grid — otherwise "20" would quietly become "everything" the moment a shop
 * passed twenty items.
 */
const ProductShowcase = () => {
  const { listings, loading } = useActiveListings(20);
  const liveCount = useActiveListingCount();

  // Hold the space rather than popping a grid in and pushing the page down under
  // the reader.
  if (loading && listings.length === 0) return null;

  // Zero stock used to `return null`, which meant a shop with no listings
  // rendered a homepage containing no products — indistinguishable from a
  // marketing site. State the fact and route onward instead.
  if (listings.length === 0) {
    return (
      <section className="border-b border-border py-12 sm:py-16">
        <div className="container">
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <PackagePlus className="mx-auto h-7 w-7 text-muted-foreground/40" aria-hidden="true" />
            <h2 className="display mt-4 text-xl font-semibold text-foreground sm:text-2xl">
              Nothing&rsquo;s listed yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Which means the first thing on here is yours. Ten photos and a price is genuinely all it takes.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link to="/create-listing">List the first thing</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/how-it-works">See how it works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <ProductGrid
      eyebrow="Fresh to the marketplace"
      title="Good finds, ready for another go"
      count={liveCount ?? undefined}
      seeAllTo="/marketplace?sort=newest"
      seeAllLabel="See everything"
      listings={listings}
    />
  );
};

export default ProductShowcase;
