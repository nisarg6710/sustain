import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    title: "Photograph it properly",
    body: "Up to ten images, plus category, condition and a description that mentions the scratches. This is the bit that decides whether anyone buys it.",
    aside: "Two minutes of photos. Worth it.",
  },
  {
    step: "02",
    title: "Get a price, or set your own",
    body: "The valuation service reads your photos and attributes and suggests an EcoCoin price with its reasoning attached. Take it, or ignore it and name your own.",
    aside: "You always have the last word.",
  },
  {
    step: "03",
    title: "Publish and wait",
    body: "Listings go live immediately and surface through category, condition and price filters, with the impact data attached to the listing rather than buried in a report.",
    aside: "Live the second you press publish.",
  },
  {
    step: "04",
    title: "Post it, get paid",
    body: "Ship with tracking, then the buyer confirms it arrived. Only then does the escrow release into your wallet. Nobody gets paid for something that didn't turn up.",
    aside: "Money moves after delivery, not before.",
  },
];

/**
 * A four-step rail with a continuous rule, rather than four numbered boxes.
 *
 * The old version put a small rounded square containing "01" next to a 24px hairline
 * on every step, which reads as a progress bar rather than a process.
 */
export const HowItWorks = () => (
  <section id="process" className="border-b border-border py-16 sm:py-20 lg:py-24">
    <div className="container">
      <SectionHeading
        eyebrow="How a sale happens"
        title="Four steps, and none of them complicated"
        description="The same process whether you are listing a jumper or buying a kitchen table."
      />

      <ol className="mt-12 sm:mt-14">
        {steps.map((step, index) => (
          <Reveal as="li" key={step.step} delay={index * 70}>
            <div className="group grid gap-3 border-t border-border py-8 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,0.8fr)] lg:items-baseline lg:gap-8">
              <span className="display text-3xl font-semibold tabular-nums leading-none text-primary sm:text-4xl">
                {step.step}
              </span>

              <div>
                <h3 className="display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>

              {/* Three columns only from `lg`: at `sm` a numeral, a title and an
                  aside share 640px and all three get squeezed. */}
              <p className="text-sm italic leading-relaxed text-muted-foreground lg:text-right">{step.aside}</p>
            </div>
          </Reveal>
        ))}
        <li className="border-t border-border" aria-hidden="true" />
      </ol>

      <div className="mt-12 flex flex-wrap items-center gap-3">
        <p className="mr-auto text-sm text-muted-foreground">Want the long version, with the small print?</p>
        <Button asChild variant="outline" className="h-11 rounded-xl px-5">
          <Link to="/how-it-works">
            How it works, in detail
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild className="h-11 rounded-xl px-5">
          <Link to="/create-listing">List something</Link>
        </Button>
      </div>
    </div>
  </section>
);
