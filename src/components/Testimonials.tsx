import { Quote, Star } from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  tone: string;
  saved: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "My camera kit had been sitting in a cupboard for three years. It was valued, sold and paid out inside a week, and I reinvested the EcoCoins into a lens I actually wanted.",
    name: "Priya Raman",
    role: "Seller, Manchester",
    initials: "PR",
    tone: "from-primary to-primary/60",
    saved: "£480 recovered",
  },
  {
    quote:
      "I furnished a whole flat from here instead of buying new. The condition ratings were honest, escrow meant I never paid for something that never turned up, and it cost less than the high street.",
    name: "Tom Whitfield",
    role: "Buyer, Bristol",
    initials: "TW",
    tone: "from-accent to-accent/60",
    saved: "31 items bought",
  },
  {
    quote:
      "We run sustainability reporting for a retail estate, and this was the first marketplace where the numbers were attached to individual listings rather than vague annual claims.",
    name: "Elena Duarte",
    role: "Sustainability lead",
    initials: "ED",
    tone: "from-info to-info/60",
    saved: "4,200 kg CO₂e avoided",
  },
];

const StarRow = () => (
  <div className="flex items-center gap-1">
    {/* The stars are decorative; the rating is stated in text beside them, so
        exposing the icons individually would just add noise. */}
    <span className="flex items-center gap-1" role="img" aria-label="Rated 4.8 out of 5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
      ))}
    </span>
    <span className="ml-2 text-sm font-semibold tabular-nums text-foreground">4.8</span>
    <span className="text-sm text-muted-foreground">from 2,400+ reviews</span>
  </div>
);

export const Testimonials = () => (
  <section id="reviews" className="border-b border-border py-20 md:py-24">
    <div className="container">
      <SectionHeading
        eyebrow="Community"
        title="Trusted by people clearing and re-buying"
        description="Settlement is protected on every order, so both sides can commit with confidence."
      >
        <StarRow />
      </SectionHeading>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.name} delay={index * 90}>
            <figure className="relative flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
              <Quote className="h-6 w-6 text-primary/30" aria-hidden="true" />

              <blockquote className="mt-4 flex-1 text-lede leading-relaxed text-foreground">
                {testimonial.quote}
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span
                  className={cn(
                    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[13px] font-semibold text-white",
                    testimonial.tone,
                  )}
                  aria-hidden="true"
                >
                  {testimonial.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {testimonial.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{testimonial.role}</span>
                </span>
                <span className="shrink-0 whitespace-nowrap rounded border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] font-medium text-primary">
                  {testimonial.saved}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
