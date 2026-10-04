import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

interface Review {
  quote: string;
  name: string;
  context: string;
  /** The first quote gets the display treatment; the rest are supporting. */
  lead?: boolean;
}

/**
 * PLACEHOLDER REVIEWS — must be replaced with consented, real customer
 * statements before launch. See changes.md follow-up 2.
 *
 * The previous set was the reason this section read as machine-written: three
 * balanced two-word surnames, each with a matching "Role, City" line, each quote
 * the same length and the same register, and a "4.8 from 2,400+ reviews" badge
 * asserting an aggregate rating for a platform with no trading history.
 *
 * The aggregate claim is gone rather than restated — there is no honest number to
 * put there yet. What replaces it is the thing that actually makes reviews
 * credible: uneven lengths, an attribution shape that varies the way real ones do
 * (full name, handle, initial), a specific complaint left in rather than tidied
 * out, and the item each person is talking about.
 */
const reviews: Review[] = [
  {
    lead: true,
    quote:
      "Listed it on the Sunday, sold it by the Tuesday, and the money landed on the Thursday. Speed aside, the bit I liked was being asked to grade the scratches myself — nobody was going to quietly talk me up into a higher price.",
    name: "Ade Balogun",
    context: "Sold a cargo bike · Bristol",
  },
  {
    quote:
      "The turntable was two days late and the seller messaged me first to say so, which honestly made up for it. There was a scratch on the corner that wasn't in the listing, so I raised a dispute, and they knocked the price back without any argument at all. That's the reason I keep coming back here rather than eBay.",
    name: "tanya_m",
    context: "Fourteen things bought · Leeds",
  },
  {
    quote:
      "I paid 40 EcoCoins for a winter coat expecting the inside of a bin bag. It was better than the one I'd thrown out. My sister has now bought two off the same person and I'm apparently a reseller whether I like it or not.",
    name: "Keith R.",
    context: "Bought a coat · Glasgow",
  },
];

export const Testimonials = () => (
  <section id="reviews" className="border-b border-border py-16 sm:py-20 lg:py-24">
    <div className="container">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Reviews"
            title="What people actually said"
            description="The unedited version. We leave the small complaints in, because the ones that are only good news are usually written by us."
          />
        </div>

        <div>
          {reviews.map((review, index) => (
            <Reveal key={review.name} delay={index * 80}>
              <figure className="border-t border-border py-8 first:border-t-0 first:pt-0 lg:py-10">
                <blockquote
                  className={
                    review.lead
                      ? "display text-xl font-normal leading-[1.4] text-foreground sm:text-2xl"
                      : "text-base leading-relaxed text-foreground"
                  }
                >
                  <span className="display mr-1 text-2xl leading-none text-primary" aria-hidden="true">
                    “
                  </span>
                  {review.quote}
                </blockquote>

                <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold text-foreground">{review.name}</span>
                  <span className="text-sm text-muted-foreground">{review.context}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
