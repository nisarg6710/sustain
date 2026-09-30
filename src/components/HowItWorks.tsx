import { Camera, Coins, Package, Search } from "lucide-react";
import { Link } from "react-router-dom";

import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Camera,
    step: "01",
    title: "Register the item",
    body: "Upload up to ten images and complete a short attribute set: category, condition, description and fulfilment terms.",
  },
  {
    icon: Coins,
    step: "02",
    title: "Valuation and impact",
    body: "The valuation service returns a recommended EcoCoin price alongside the carbon and waste impact of recirculating the item.",
  },
  {
    icon: Search,
    step: "03",
    title: "Publication and discovery",
    body: "Listings publish immediately and surface through category, condition and price filters, with sustainability data attached.",
  },
  {
    icon: Package,
    step: "04",
    title: "Fulfilment and settlement",
    body: "Ship with tracking. EcoCoins are credited to the seller wallet once the buyer confirms delivery and escrow releases.",
  },
];

export const HowItWorks = () => (
  <section id="process" className="border-b border-border bg-secondary/30 py-20 md:py-24">
    <div className="container">
      <SectionHeading
        eyebrow="Operating process"
        title="Four steps from intake to settlement"
        description="A single workflow shared by sellers, buyers and operations teams."
      />

      <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <Reveal key={step.step} as="li" delay={index * 80} className="relative">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-[13px] font-semibold tabular-nums text-primary-foreground">
                {step.step}
              </span>
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
              <step.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <h3 className="mt-5 text-[15px] font-semibold text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </Reveal>
        ))}
      </ol>

      <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-8">
        <p className="mr-auto text-sm text-muted-foreground">
          Ready for a walkthrough of the full workflow?
        </p>
        <Button asChild variant="outline">
          <Link to="/how-it-works">Read the process guide</Link>
        </Button>
        <Button asChild>
          <Link to="/create-listing">List your first item</Link>
        </Button>
      </div>
    </div>
  </section>
);
