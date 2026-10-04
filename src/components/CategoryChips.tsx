import { Link } from "react-router-dom";

/**
 * Category chips, immediately under the hero.
 *
 * This is the other half of what makes a marketplace feel like a marketplace on
 * a phone: products to look at, and one tap to narrow them. Previously
 * categories lived in a card section below the first product grid, which meant
 * filtering required scrolling back up.
 *
 * A horizontal strip rather than a wrapped row, because a wrapped row of six
 * chips costs three lines of height on a 360px screen and pushes the grid
 * further down — the opposite of the point. Scroll-snap plus a peeking next chip
 * says "there are more" without a scrollbar.
 */
const categories = [
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Home & garden", value: "home" },
  { label: "Sports", value: "sports" },
  { label: "Books", value: "books" },
  { label: "Toys", value: "toys" },
  { label: "Everything", value: "" },
];

export const CategoryChips = () => (
  <nav aria-label="Shop by category" className="border-b border-border bg-background">
    <div className="snap-rail -mx-4 flex gap-2 px-4 py-2.5 sm:-mx-5 sm:px-5 sm:py-3 lg:mx-0 lg:flex-wrap lg:px-0">
      {categories.map((category) => (
        <Link
          key={category.value}
          to={category.value ? `/marketplace?category=${category.value}` : "/marketplace"}
          className="inline-flex h-9 shrink-0 snap-item items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
        >
          {category.label}
        </Link>
      ))}
    </div>
  </nav>
);
