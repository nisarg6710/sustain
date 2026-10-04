import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Valuation that shows its working",
    body: "Upload the photos and get a suggested price in EcoCoins, plus the reasoning behind it. Ignore it if you disagree — it's a starting point, not a verdict.",
  },
  {
    title: "Condition, actually written down",
    body: "Five grades, and a box for the dents, the scratches and the switch that doesn't quite click. Buyers read all of it before they pay, not after.",
  },
  {
    title: "Money that moves in one go",
    body: "Buying debits the wallet, opens the order and locks the escrow inside a single database transaction. If any part of it fails, none of it happened.",
  },
  {
    title: "One currency, one ledger",
    body: "EcoCoins price, pay and pay out. Every movement is a row you can read back, with a timestamp and a counterparty on it.",
  },
  {
    title: "Dispatch and tracking",
    body: "Sellers log the carrier and the reference number. Buyers follow it from the order page and confirm when it actually turns up.",
  },
  {
    title: "Reporting worth handing over",
    body: "Sales, commission and referral performance, exportable. Built for partners who have to answer for the numbers at the end of the quarter.",
  },
];

/**
 * A spec list, not a grid of icon cards.
 *
 * Six tiles in a 3×2 grid, each with a lucide icon in a tinted rounded square and
 * a small uppercase stat underneath, is the default output of every generated
 * landing page. Setting the same six items as a numbered list with hairline rules
 * and a sticky left column reads as a page someone wrote.
 *
 * The old per-card `meta` line ("Median suggestion acceptance 78%", "2.1%
 * dispute rate", "4.2 day median dispatch") has been removed rather than restyled:
 * nothing measures those numbers, and the small-caps stat-under-a-description was
 * doing a lot of the work that made this look machine-made.
 */
export const Features = () => (
  <section id="capabilities" className="border-b border-border py-16 sm:py-20 lg:py-24">
    <div className="container">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Under the bonnet"
            title="Six things we've had to get right"
            description="None of this is visible while everything is working. It is most of what makes a marketplace safe to hand your money through."
          />
          <Button asChild variant="outline" className="mt-8 h-11 rounded-xl px-5">
            <Link to="/how-it-works">
              Read the full process
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ol className="grid gap-x-12 lg:grid-cols-2">
          {features.map((feature, index) => (
            <Reveal as="li" key={feature.title} delay={index * 60} className="border-t border-border py-7">
              <span className="block text-sm font-medium tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-3 text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                {feature.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  </section>
);
