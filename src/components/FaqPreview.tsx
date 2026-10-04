import { Link } from "react-router-dom";
import { ArrowUpRight, LifeBuoy, Mail, Route } from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqQuestion } from "@/lib/faq";

/**
 * The five questions worth answering before someone leaves.
 *
 * Every marketplace landing page is expected to handle objections, and this one
 * had none: the answers existed, in the right register, a page away — but a
 * visitor who had to go and find the help centre was already halfway out. The
 * questions and answers are read from `lib/faq`, so this section and the help
 * centre cannot say different things about the same thing.
 *
 * Chosen by category and position rather than sliced off the front of a flat
 * list. Five questions taken in document order would have been "What is Sustain",
 * "How do I open an account" and "What does it cost" — three answers for people
 * who have already decided to exist, and none of the ones a first-time visitor
 * actually stalls on: what the currency is, whether their money is safe, and what
 * selling involves.
 */
const featured = [
  { category: "eco-coins", index: 0 },
  { category: "buying", index: 1 },
  { category: "selling", index: 1 },
  { category: "selling", index: 0 },
  { category: "sustainability", index: 1 },
]
  .map(({ category, index }) => faqQuestion(category, index))
  .filter((item): item is NonNullable<typeof item> => item !== null);

/**
 * Deliberately not a third copy of the sticky-heading-plus-list shape that
 * `Features` and `Testimonials` both use. Two sections can share that column and
 * read as a system; three stops being one. The help centre's own layout works
 * better here anyway — an accordion wants a wide, readable measure and a narrow
 * column beside it, which is the split below.
 */
export const FaqPreview = () => (
  <section id="questions" className="border-b border-border py-16 sm:py-20 lg:py-24">
    <div className="container">
      <SectionHeading
        eyebrow="Support"
        title="The questions we get asked most"
        description="Short answers to the five things people want settled before they commit. Anything longer lives in the help centre."
      >
        <Link
          to="/faq"
          className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          All answers
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </SectionHeading>

      <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-6">
        <Card>
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              {featured.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`preview-${index}`}
                  className="px-6 first:border-t-0"
                >
                  <AccordionTrigger className="text-left text-sm font-medium text-foreground">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Hairline pair rather than two stacked Cards, so the column reads as one
            block beside the accordion instead of three competing boxes. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex h-full flex-col gap-5 p-6 sm:flex-row sm:items-center lg:flex-col lg:items-start lg:justify-between">
              <LifeBuoy className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-foreground">Still need help?</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Our operations team responds within one business day.
                </p>
              </div>
              <Button asChild className="shrink-0">
                <a href="mailto:support@sustain.eco">
                  <Mail className="h-4 w-4" />
                  Email support
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="flex h-full flex-col gap-5 p-6 lg:justify-between">
              <Route className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-foreground">New to the whole idea?</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  The full workflow for both sides of a trade, from listing a thing to getting paid for it.
                </p>
              </div>
              <Link
                to="/how-it-works"
                className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
              >
                How it works
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
);