import { Leaf, Recycle, Wind } from "lucide-react";
import { Link } from "react-router-dom";

import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";

const metrics = [
  { value: 31400, prefix: "", suffix: " t", decimals: 0, label: "CO₂e avoided", detail: "Against replacement manufacture" },
  { value: 184000, prefix: "", suffix: "", decimals: 0, label: "Items recirculated", detail: "Cumulative to date" },
  { value: 4.2, prefix: "£", suffix: "", decimals: 2, label: "Saved per household", detail: "Average annual resale value" },
  { value: 92, prefix: "", suffix: "%", decimals: 0, label: "Diverted from landfill", detail: "Of all listed inventory" },
];

const MetricBlock = ({ value, prefix, suffix, decimals, label, detail }: (typeof metrics)[number]) => {
  const { ref, inView } = useInView<HTMLDivElement>();
  const current = useCountUp(value, { start: inView, decimals, duration: 1700 });

  return (
    <div ref={ref} className="flex flex-col bg-card p-6">
      <dt className="order-2 mt-2 text-sm font-medium text-foreground">{label}</dt>
      <dd className="order-1 text-3xl font-semibold tabular-nums tracking-tight text-foreground">
        {prefix}
        {current.toLocaleString("en-GB", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        {suffix}
      </dd>
      <p className="order-3 mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
};

const pillars = [
  {
    icon: Recycle,
    title: "Extend product life",
    body: "Every completed transaction represents an avoided purchase of new goods, keeping materials in circulation for longer.",
  },
  {
    icon: Wind,
    title: "Measure real impact",
    body: "Carbon and waste estimates are attached to individual listings, so impact can be reported per seller, per category or per quarter.",
  },
  {
    icon: Leaf,
    title: "Align incentives",
    body: "EcoCoin settlement rewards recirculation with an internal unit of account rather than discounting resale value to zero.",
  },
];

export const Impact = () => (
  <section id="impact" className="border-b border-border py-20 md:py-24">
    <div className="container">
      <SectionHeading
        eyebrow="Sustainability reporting"
        title="Impact you can put in a board pack"
        description="Sustain records the environmental outcome of each listing so circularity is measurable, not just claimed."
      />

      <dl className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricBlock key={metric.label} {...metric} />
        ))}
      </dl>

      <Separator className="my-14" />

      <div className="grid gap-10 lg:grid-cols-3">
        {pillars.map((pillar, index) => (
          <Reveal key={pillar.title} delay={index * 80}>
            <pillar.icon className="h-5 w-5 text-primary" />
            <h3 className="mt-4 text-[15px] font-semibold text-foreground">{pillar.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export const CtaSection = () => (
  <section className="border-b border-border bg-primary text-primary-foreground">
    <div className="container flex flex-col items-start justify-between gap-8 py-16 lg:flex-row lg:items-center">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">
          Get started
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Open an account and start recirculating inventory today
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-primary-foreground/80">
          Free to register, no listing fees, and settlement held safely in escrow until delivery is confirmed.
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" variant="accent">
          <Link to="/create-listing">Create a listing</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <Link to="/marketplace">Browse listings</Link>
        </Button>
      </div>
    </div>
  </section>
);
