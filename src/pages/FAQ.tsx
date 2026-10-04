import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LifeBuoy, Mail } from "lucide-react";

import { faqCategories } from "@/lib/faq";

/**
 * The full help centre.
 *
 * The content itself now lives in `lib/faq.ts`, because the landing page
 * features five of these same answers and two copies of the copy is how they end
 * up disagreeing. This page stays the complete reference; `FaqPreview` is the
 * short version with a route back here.
 */
const FAQ = () => (
  <AppLayout contained={false}>
    <PageHeader
      eyebrow="Support"
      title="Help centre"
      description="Answers on account management, settlement, listing standards and environmental reporting."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Help centre" }]}
      meta={
        <div className="flex flex-wrap gap-2">
          {faqCategories.map((category) => (
            <a key={category.id} href={`#${category.id}`}>
              <Badge variant="outline" className="transition-colors hover:border-primary/40 hover:text-primary">
                {category.label}
              </Badge>
            </a>
          ))}
        </div>
      }
    />

    <div className="container grid gap-10 py-8 md:py-10 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav aria-label="Sections" className="hidden lg:block">
        <div className="sticky top-28">
          <p className="eyebrow-muted">Sections</p>
          <ul className="mt-4 space-y-1.5">
            {faqCategories.map((category) => (
              <li key={category.id}>
                <a
                  href={`#${category.id}`}
                  className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {category.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="space-y-6">
        {faqCategories.map((category) => (
          <Card key={category.id} id={category.id} className="scroll-mt-28">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-foreground">{category.label}</h2>
            </div>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, index) => (
                  <AccordionItem
                    key={item.question}
                    value={`${category.id}-${index}`}
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
        ))}

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Still need help?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Our operations team responds within one business day.
                </p>
              </div>
            </div>
            <Button asChild className="shrink-0">
              <a href="mailto:support@sustain.eco">
                <Mail className="h-4 w-4" />
                Email support
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </AppLayout>
);

export default FAQ;
