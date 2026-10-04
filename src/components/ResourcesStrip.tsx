import { Link } from "react-router-dom";
import { ArrowUpRight, Route, ShoppingBag, Tag, Truck, type LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";

interface Guide {
  label: string;
  to: string;
  blurb: string;
  icon: LucideIcon;
}

/**
 * Four doors into the writing that already exists.
 *
 * The footer's Resources column has pointed at these four destinations since the
 * first commit, and on a homepage they were the only parts of the site with no
 * way in from above the fold. Nothing here is new copy in the sense of invented
 * copy — every blurb is one clause taken from the answers at the destination, so
 * the card is a promise the page it links to actually keeps.
 *
 * Four cards, not six: this is navigation, and a navigation strip that needs
 * scrolling has stopped being one. The card shape is `CategoryTiles` exactly —
 * this is the same pattern at four-up, not the icon-grid-of-features that
 * `Features` documents itself as having moved away from.
 */
const guides: Guide[] = [
  {
    label: "Buying guide",
    to: "/faq#buying",
    icon: ShoppingBag,
    blurb: "Purchase with EcoCoins, what escrow covers, return windows and how a dispute works.",
  },
  {
    label: "Selling guide",
    to: "/faq#selling",
    icon: Tag,
    blurb: "Photos, condition grades, the attribute set and what a valuation is allowed to do.",
  },
  {
    label: "Shipping & delivery",
    to: "/faq#shipping",
    icon: Truck,
    blurb: "Carriers, tracking references, local collection and what happens to a lost parcel.",
  },
  {
    label: "How it works",
    to: "/how-it-works",
    icon: Route,
    blurb: "The whole workflow for both sides of a trade, from listing a thing to getting paid.",
  },
];

export const ResourcesStrip = () => (
  <section className="border-b border-border py-12 sm:py-16 lg:py-20">
    <div className="container">
      <SectionHeading
        eyebrow="Read next"
        title="Guides worth two minutes"
        description="Short answers to the questions that come up most, in one place, for both sides of a trade."
      >
        <Link
          to="/faq"
          className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          Help centre
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </SectionHeading>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {guides.map((guide) => (
          <Link
            key={guide.to}
            to={guide.to}
            className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:bg-secondary/40"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-primary transition-colors group-hover:border-primary/30">
                <guide.icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden="true"
              />
            </div>

            <h3 className="mt-5 text-base font-semibold text-foreground">{guide.label}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{guide.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);