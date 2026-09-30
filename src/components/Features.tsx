import { Bot, Coins, Lock, Package, Sparkles, TrendingUp } from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Bot,
    title: "AI-assisted valuation",
    body: "Our models read condition, brand and category data to propose a defensible EcoCoin price, with the reasoning shown to the seller.",
    meta: "Median suggestion acceptance 78%",
  },
  {
    icon: Sparkles,
    title: "Structured catalogue data",
    body: "Listings are normalised into a consistent schema at creation, so inventory stays comparable, searchable and reportable.",
    meta: "12 attribute families",
  },
  {
    icon: Lock,
    title: "Escrow settlement",
    body: "Every transaction is held by the platform and released to the seller on confirmed delivery, with a full dispute trail.",
    meta: "2.1% dispute rate",
  },
  {
    icon: Coins,
    title: "EcoCoin ledger",
    body: "A single internal unit of account for pricing, commission and payouts, with balances reconciled on every movement.",
    meta: "Real-time balance",
  },
  {
    icon: Package,
    title: "Fulfilment & tracking",
    body: "Sellers record carrier and tracking references; buyers follow the shipment through to delivery confirmation.",
    meta: "4.2 day median dispatch",
  },
  {
    icon: TrendingUp,
    title: "Performance reporting",
    body: "Conversion, yield and settlement reporting for sellers, and click-to-earnings attribution for affiliate partners.",
    meta: "Exportable reporting",
  },
];

export const Features = () => (
  <section id="capabilities" className="border-b border-border py-20 md:py-24">
    <div className="container">
      <SectionHeading
        eyebrow="Platform capabilities"
        title="Operational controls for a regulated secondary market"
        description="Everything required to move, price and settle pre-owned inventory — with the audit trail to prove it."
      />

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 60}>
            <Card variant="bare" className="h-full transition-colors hover:bg-secondary/40">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-card-title font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
                <p className="eyebrow-muted mt-4 border-t border-border pt-3">
                  {feature.meta}
                </p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
