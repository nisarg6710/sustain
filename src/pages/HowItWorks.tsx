import { Link } from "react-router-dom";
import { Bot, Check, Package, Search, ShieldCheck, Wallet } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const steps = [
  {
    icon: Package,
    step: "01",
    title: "Register the item",
    summary:
      "Attach up to ten photographs and complete the core attribute set: title, category, condition, description and fulfilment terms.",
    detail: [
      "Photograph multiple angles under neutral light",
      "Disclose every functional fault and cosmetic mark",
      "Select the most accurate category for discovery",
      "Choose the fulfilment and returns policy up front",
    ],
  },
  {
    icon: Bot,
    step: "02",
    title: "Valuation and impact",
    summary:
      "The valuation service returns a recommended EcoCoin price with its reasoning, plus the estimated carbon and waste impact of recirculating the item.",
    detail: [
      "Recommendation reflects condition, brand and category",
      "Impact estimate is stored against the listing",
      "Accept the recommendation or override the price",
      "Re-run the valuation if you change core attributes",
    ],
  },
  {
    icon: Search,
    step: "03",
    title: "Publication and discovery",
    summary:
      "Listings publish immediately and surface through search, category and condition filters, with impact data visible on the product page.",
    detail: [
      "Structured attributes keep inventory comparable",
      "Condition badges are shown consistently across views",
      "Impact data is attached for reporting",
      "Seller performance builds with each transaction",
    ],
  },
  {
    icon: Wallet,
    step: "04",
    title: "Fulfilment and settlement",
    summary:
      "Ship with tracking. EcoCoins are credited to your wallet once the buyer confirms delivery and escrow releases to the seller.",
    detail: [
      "Buyer funds are held in escrow at checkout",
      "Sellers record the carrier and tracking reference",
      "Buyer confirms delivery to release settlement",
      "Disputes pause settlement until they are resolved",
    ],
  },
];

const controls = [
  {
    icon: ShieldCheck,
    title: "Escrow on every order",
    body: "Funds move to a platform-held balance at checkout and are only released on confirmed delivery, with a complete audit trail.",
  },
  {
    icon: Wallet,
    title: "Auditable EcoCoin ledger",
    body: "Every credit and debit is recorded against your account with a reference, timestamp and counterparty.",
  },
  {
    icon: Search,
    title: "Structured catalogue data",
    body: "Listings are normalised into a consistent schema, keeping inventory comparable, searchable and reportable.",
  },
];

const HowItWorks = () => (
  <AppLayout contained={false}>
    <PageHeader
      eyebrow="Process guide"
      title="How it all works"
      description="The whole workflow for both sides of a trade, from listing something to getting paid for it. No jargon, we checked."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "How it works" }]}
      actions={
        <>
          <Button asChild variant="outline">
            <Link to="/faq">Read the help centre</Link>
          </Button>
          <Button asChild>
            <Link to="/create-listing">List an item</Link>
          </Button>
        </>
      }
    />

    <div className="container space-y-16 py-8 md:py-10">
      <section>
        <SectionHeading
          eyebrow="Four stages"
          title="Four stages, start to payout"
          description="Both sides of a trade can see exactly what happens next, and what each of them needs to have done before that."
        />

        <ol className="mt-10 space-y-px overflow-hidden rounded-lg border border-border bg-border">
          {steps.map((step) => (
            <li key={step.step}>
              <Card variant="bare" className="h-full">
                <CardContent className="grid gap-6 p-6 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] lg:gap-10 lg:p-8">
                  <div className="flex items-center gap-3 lg:block">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-sm font-semibold tabular-nums text-primary-foreground">
                      {step.step}
                    </span>
                    <step.icon className="mt-4 hidden h-5 w-5 text-muted-foreground lg:block" />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.summary}</p>
                  </div>

                  <ul className="space-y-2.5">
                    {step.detail.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <SectionHeading
          eyebrow="Controls"
          title="What keeps both sides honest"
          description="These are part of the process itself rather than something bolted on afterwards when something goes wrong."
        />

        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          {controls.map((control) => (
            <Card key={control.title} variant="bare">
              <CardContent className="p-6">
                <control.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-card-title font-semibold text-foreground">{control.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{control.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Card>
          <CardContent className="p-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
              <div>
                <Badge variant="accent">Next step</Badge>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                  Publish your first listing
                </h2>
                <p className="mt-3 text-lede leading-relaxed text-muted-foreground">
                  Registration is free and there are no listing fees. The valuation service will suggest a price once
                  your media and attributes are in place.
                </p>
                <Separator className="my-6" />
                <Tabs defaultValue="seller">
                  <TabsList>
                    <TabsTrigger value="seller">I am selling</TabsTrigger>
                    <TabsTrigger value="buyer">I am buying</TabsTrigger>
                  </TabsList>
                  <TabsContent value="seller" className="pt-4 text-sm text-muted-foreground">
                    Create a listing, request a valuation and publish. You are notified when an order is placed and
                    record dispatch with a tracking reference.
                  </TabsContent>
                  <TabsContent value="buyer" className="pt-4 text-sm text-muted-foreground">
                    Browse the marketplace, filter by category and condition, then purchase with EcoCoins. Confirm
                    delivery to release funds to the seller.
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex flex-col gap-3">
                <Button asChild size="lg">
                  <Link to="/create-listing">Create a listing</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/marketplace">Browse the marketplace</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  </AppLayout>
);

export default HowItWorks;
