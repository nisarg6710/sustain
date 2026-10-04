import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { supabase } from "@/integrations/supabase/client";

/**
 * What the environmental figures on a listing actually mean.
 *
 * The previous version of this section printed four platform-wide statistics —
 * 31,400 t CO₂e avoided, 184,000 items recirculated, £4.2 saved per household,
 * 92% diverted from landfill — and none of them came from a query. The £4.2 and
 * the 92% in particular read like figures pulled from a sustainability report for
 * a company that does not exist. Rather than restyle them, they are gone, and
 * the section says the uncomfortable thing instead: the per-listing figure is an
 * estimate derived from category and condition, not a measurement.
 */
const claims = [
  {
    title: "What we do measure",
    body: "Whether a transaction completed. Everything on this site that counts orders, payouts and balances is read live from the database, including the number opposite.",
  },
  {
    title: "What we estimate",
    body: "The carbon and waste figure on each listing. It is derived from the category and condition the seller declares, and it estimates the impact of not manufacturing a new equivalent. It is a reasonable guess, not a reading off a meter.",
  },
  {
    title: "What we won't claim",
    body: "Anything platform-wide we can't currently query — total weight diverted, cumulative carbon, households affected. We would rather show you one honest number than four impressive ones.",
  },
];

/**
 * A live count of active listings. This is the only aggregate the public can
 * read: `orders`, `wallets` and `transactions` are all behind RLS policies scoped
 * to the owning user, so a public "items recirculated" figure would need a new
 * RPC. Counting what is on the shelf right now needs none.
 */
const LiveShelfCount = () => {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "active")
      .then(({ count: total }) => {
        if (active) setCount(total ?? 0);
      });

    return () => {
      active = false;
    };
  }, []);

  const current = useCountUp(count ?? 0, { start: inView, duration: 1400 });

  return (
    <div ref={ref} className="rounded-2xl border border-border bg-card p-7 sm:p-9">
      <p className="eyebrow-muted">On the shelves right now</p>
      <p className="display mt-3 text-6xl font-semibold tabular-nums leading-none tracking-tight text-foreground sm:text-7xl">
        {current.toLocaleString("en-GB")}
      </p>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Active listings, counted straight from the database when this page loaded. It goes up and down like a real
        shop&rsquo;s window.
      </p>
    </div>
  );
};

export const Impact = () => (
  <section id="impact" className="border-b border-border bg-secondary/40 py-16 sm:py-20 lg:py-24">
    <div className="container">
      {/* Deliberately not the sticky-heading-plus-list shape used by Features:
          a wide live figure with the argument set beside it, then the three
          claims as a row underneath. */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
        <LiveShelfCount />
        <div>
          <p className="eyebrow">The green bit, honestly</p>
          <h2 className="display mt-4 text-display font-semibold text-foreground">
            Here&rsquo;s what our numbers aren&rsquo;t
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lede">
            Most marketplaces print a savings figure per customer and a tonnage saved per platform. Neither of those
            is measurable from where we&rsquo;re standing, so here&rsquo;s the truth instead.
          </p>
        </div>
      </div>

      <dl className="mt-12 grid gap-x-10 gap-y-8 border-t border-border pt-10 md:grid-cols-3">
        {claims.map((claim, index) => (
          <Reveal key={claim.title} delay={index * 70}>
            <dt className="display text-lg font-semibold text-foreground sm:text-xl">{claim.title}</dt>
            <dd className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{claim.body}</dd>
          </Reveal>
        ))}
      </dl>
    </div>
  </section>
);

export const CtaSection = () => (
  <section className="bg-primary text-primary-foreground">
    <div className="container py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div>
          <p className="eyebrow text-primary-foreground/70">Get started</p>
          <h2 className="display mt-4 max-w-2xl text-display font-semibold">
            One of the three things you own is probably on someone else&rsquo;s shelf.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/80 sm:text-lede">
            Joining is free, listing is free, and we only take a cut when something actually sells. Your money sits
            with us until the buyer confirms it turned up.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Button asChild size="lg" variant="accent" className="h-12 rounded-xl px-6">
            <Link to="/create-listing">
              Sell something
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-xl border-primary-foreground/30 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link to="/marketplace">Browse the marketplace</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);
