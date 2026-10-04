import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { ListingCard, type ListingSummary } from "@/components/ListingCard";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  listings: ListingSummary[];
  /** Small label above the title. */
  eyebrow?: string;
  title: string;
  /** Shown beside the title — a live count is the strongest "this is a real shop" signal there is. */
  count?: number;
  seeAllTo?: string;
  seeAllLabel?: string;
  className?: string;
}

/**
 * The product grid.
 *
 * Two columns on a phone is the convention — Vinted, Depop, Gumtree and eBay all
 * land on two — and it is what lets a condition badge, a title and a price stay
 * legible at ~180px. Three-up leaves ~114px per card, which fits a price and
 * nothing else; it remains a one-token change if maximum density is ever wanted
 * over legibility (follow-up 31).
 */
export const ProductGrid = ({
  listings,
  eyebrow,
  title,
  count,
  seeAllTo,
  seeAllLabel = "See all",
  className,
}: ProductGridProps) => {
  if (listings.length === 0) return null;

  return (
    <section className={cn("border-b border-border py-8 sm:py-12 lg:py-16", className)}>
      <div className="container">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 className="display mt-2 text-2xl font-semibold text-foreground sm:text-section-title">
              {title}
              {typeof count === "number" && (
                <span className="ml-2.5 align-middle text-sm font-normal tabular-nums text-muted-foreground sm:text-base">
                  {count.toLocaleString("en-GB")}
                </span>
              )}
            </h2>
          </div>

          {seeAllTo && (
            <Link
              to={seeAllTo}
              className="link-underline inline-flex shrink-0 items-center gap-1.5 pb-1 text-sm font-medium text-foreground"
            >
              {seeAllLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
};
