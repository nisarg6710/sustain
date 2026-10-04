import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Dumbbell,
  House,
  Laptop,
  Shirt,
  ToyBrick,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";

interface Category {
  label: string;
  value: string;
  blurb: string;
  icon: LucideIcon;
}

const categories: Category[] = [
  { label: "Electronics", value: "electronics", icon: Laptop, blurb: "Cameras, audio, computing and kit" },
  { label: "Fashion", value: "fashion", icon: Shirt, blurb: "Outerwear, denim, footwear" },
  { label: "Home & garden", value: "home", icon: House, blurb: "Furniture, tools, decor" },
  { label: "Sports & outdoors", value: "sports", icon: Dumbbell, blurb: "Cycling, fitness, camping" },
  { label: "Books & media", value: "books", icon: BookOpen, blurb: "Paperbacks, vinyl, games" },
  { label: "Toys & games", value: "toys", icon: ToyBrick, blurb: "Collectables, board games" },
];

/**
 * Six category cards in a three-column grid, as in the original design.
 *
 * This went numbered-text-index (§14.5) and then card-with-blurb-hidden (§15.6),
 * and both were wrong: categories on a shop homepage are navigation, and
 * navigation should look enterable. The blurb is back because at three columns
 * there is room for it, and it is what tells someone whether the category holds
 * what they want before they tap.
 */
export const CategoryTiles = () => (
  <section id="categories" className="border-b border-border py-12 sm:py-16 lg:py-20">
    <div className="container">
      <SectionHeading
        eyebrow="Browse by category"
        title="Start with what you're looking for"
        description="Six categories covering the inventory that circulates most."
      >
        <Link
          to="/marketplace"
          className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          View all listings
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </SectionHeading>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {categories.map((category, index) => (
          <Link
            key={category.value}
            to={`/marketplace?category=${category.value}`}
            className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:bg-secondary/40"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-primary transition-colors group-hover:border-primary/30">
                <category.icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden="true"
              />
            </div>

            <h3 className="mt-5 text-base font-semibold text-foreground">{category.label}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{category.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
