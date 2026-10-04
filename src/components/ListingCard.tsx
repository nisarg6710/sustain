import { useState } from "react";
import { ArrowUpRight, Heart, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useWishlist } from "@/hooks/useWishlist";
import { conditionVariant, formatCategory, formatCondition, formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface ListingSummary {
  id: string;
  title: string;
  category: string;
  condition: string;
  price_ecocoins: number;
  photos?: string[] | null;
  created_at?: string | null;
}

export const ListingThumbnail = ({
  photo,
  title,
  decorative = false,
  className,
}: {
  photo?: string | null;
  title: string;
  /** Set when the title is rendered next to the image, to avoid announcing it twice. */
  decorative?: boolean;
  className?: string;
}) => {
  if (!photo) {
    return (
      <div className={cn("flex items-center justify-center bg-secondary text-muted-foreground", className)}>
        <ImageOff className="h-5 w-5" aria-hidden="true" />
      </div>
    );
  }

  return <img src={photo} alt={decorative ? "" : title} loading="lazy" className={cn("object-cover", className)} />;
};

/** Wishlist toggle. Sits outside the card's <Link> to keep the markup valid. */
export const WishlistButton = ({
  id,
  title,
  className,
}: {
  id: string;
  title: string;
  className?: string;
}) => {
  const { has, toggle } = useWishlist();
  const [popping, setPopping] = useState(false);
  const saved = has(id);

  return (
    <button
      type="button"
      onClick={() => {
        toggle(id);
        setPopping(true);
        window.setTimeout(() => setPopping(false), 340);
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved items` : `Save ${title} for later`}
      title={saved ? "Remove from saved" : "Save for later"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card/90 text-muted-foreground backdrop-blur transition-colors hover:text-destructive",
        saved && "border-destructive/30 text-destructive",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", saved && "fill-current", popping && "heart-pop")} />
    </button>
  );
};

export const EcoCoinAmount = ({
  value,
  className,
  size = "default",
}: {
  value: number;
  className?: string;
  size?: "sm" | "default" | "lg";
}) => (
  <span className={cn("inline-flex items-baseline gap-1.5 font-semibold tabular-nums text-foreground", className)}>
    {size === "lg" ? (
      <span className="text-4xl tracking-tight">{formatNumber(value)}</span>
    ) : size === "sm" ? (
      <span className="text-sm">{formatNumber(value)}</span>
    ) : (
      <span className="text-xl tracking-tight">{formatNumber(value)}</span>
    )}
    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">EC</span>
  </span>
);

/**
 * The product card, used on the homepage, the marketplace grid, the wishlist
 * filter and the order tables. One design, no variants.
 *
 * Portrait 4:5 rather than landscape: second-hand photos are almost always taken
 * standing up, and a 4:3 crop decapitates the subject. The condition badge and
 * the wishlist heart sit on the image where the eye already is, and the text
 * block below carries category, title, price and date.
 *
 * Prices deliberately stay in the sans even though the headings are a serif —
 * a column of costs has to be scannable, and `tabular-nums` matters more than
 * character at this size.
 */
export const ListingCard = ({ listing }: { listing: ListingSummary }) => (
  // `overflow-hidden` would clip the global focus ring, so the ring is drawn
  // inside the card via focus-within instead.
  <Card className="group relative overflow-hidden rounded-xl transition-all hover:border-primary/40 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-inset">
    <WishlistButton id={listing.id} title={listing.title} className="absolute right-3 top-3 z-10 rounded-lg" />

    <Link
      to={`/product/${listing.id}`}
      className="flex h-full flex-col rounded-xl focus-visible:outline-none"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-border bg-secondary">
        <ListingThumbnail
          photo={listing.photos?.[0]}
          title={listing.title}
          decorative
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3">
          <Badge variant={conditionVariant[listing.condition] ?? "secondary"}>
            {formatCondition(listing.condition)}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="eyebrow-muted">{formatCategory(listing.category)}</p>
        <h3 className="mt-2 line-clamp-2 text-[0.9375rem] font-medium leading-snug text-foreground">
          {listing.title}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <EcoCoinAmount value={listing.price_ecocoins} />
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            {formatDate(listing.created_at)}
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  </Card>
);
