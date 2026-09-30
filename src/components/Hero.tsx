import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Coins, ShieldCheck, TrendingUp } from "lucide-react";

import { Aurora } from "@/components/Aurora";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import heroBackground from "@/assets/hero-background.jpg";

const heroStats = [
  { label: "Active listings", value: 50000, suffix: "+", hint: "live today" },
  { label: "Registered accounts", value: 25000, suffix: "+", hint: "buying and selling" },
  { label: "EcoCoins settled", value: 1000000, suffix: "+", hint: "lifetime volume" },
  { label: "Items recirculated", value: 184000, suffix: "", hint: "instead of landfilled" },
];

const consoleRows = [
  { label: "Gross merchandise value", value: "£2.41M", delta: "+18.4%" },
  { label: "Items recirculated", value: "12,806", delta: "+9.1%" },
  { label: "Held in escrow", value: "£148,200", delta: "Active" },
  { label: "Median time to sale", value: "4.2 days", delta: "-0.8d" },
];

const StatBlock = ({ value, suffix, label, hint }: (typeof heroStats)[number]) => {
  const { ref, inView } = useInView<HTMLDivElement>();
  const current = useCountUp(value, { start: inView, duration: 1600 });

  return (
    <div ref={ref} className="flex flex-col">
      <dt className="order-2 mt-1 text-sm text-muted-foreground">{label}</dt>
      <dd className="order-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground md:text-3xl">
        {current.toLocaleString("en-GB")}
        {suffix}
        <span className="ml-2 align-middle text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {hint}
        </span>
      </dd>
    </div>
  );
};

export const Hero = () => (
  <section className="relative overflow-hidden border-b border-border bg-card">
    <Aurora />
    <div
      className="hero-media absolute inset-0 bg-cover bg-center opacity-[0.07]"
      style={{ backgroundImage: `url(${heroBackground})` }}
      aria-hidden="true"
    />
    <div className="absolute inset-0 surface-grid opacity-70" aria-hidden="true" />
    <div className="absolute inset-x-0 top-0 h-px rule-top" aria-hidden="true" />

    <div className="container relative py-16 md:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <div className="animate-fade-up">
          <Badge variant="outline" className="gap-1.5 border-primary/25 bg-card/60 text-primary backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Circular commerce platform
          </Badge>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tightest text-foreground sm:text-5xl lg:text-[3.5rem]">
            The secondary market for goods, rebuilt as{" "}
            <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
              infrastructure
            </span>
            .
          </h1>

          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
            Sustain settles pre-owned inventory through audited escrow, AI-assisted valuation and a verified
            EcoCoin ledger — giving brands, retailers and marketplaces a compliant route to circular revenue.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-md transition-shadow hover:shadow-lg">
              <Link to="/marketplace">
                Explore the marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-card/70 backdrop-blur">
              <Link to="/create-listing">
                <Coins className="h-4 w-4" />
                List an item
              </Link>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <li className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No listing fees
            </li>
            <li className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Escrow-protected settlement
            </li>
            <li className="inline-flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-primary" />
              Item-level impact reporting
            </li>
          </ul>
        </div>

        <Reveal delay={120}>
          <div className="animate-fade-up rounded-lg border border-border bg-card/85 p-6 shadow-lg backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Network overview
                </p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">Settlement summary</p>
              </div>
              <Badge variant="success" className="gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Live
              </Badge>
            </div>

            <Separator className="my-5" />

            <dl className="space-y-4">
              {consoleRows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-muted-foreground">{row.label}</dt>
                  <dd className="flex items-baseline gap-2">
                    <span className="text-base font-semibold tabular-nums text-foreground">{row.value}</span>
                    <span className="w-14 text-right text-xs font-medium tabular-nums text-success">{row.delta}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <Separator className="my-5" />

            <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
              <span>Reporting period: last 30 days</span>
              <Link to="/affiliate-dashboard" className="font-medium text-primary hover:underline">
                View reporting
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      <Separator className="my-14" />

      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
        {heroStats.map((stat) => (
          <StatBlock key={stat.label} {...stat} />
        ))}
      </dl>
    </div>
  </section>
);
