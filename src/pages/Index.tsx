import { AppLayout } from "@/components/AppLayout";
import { Hero } from "@/components/Hero";
import { CategoryChips } from "@/components/CategoryChips";
import ProductShowcase from "@/components/ProductShowcase";
import { CategoryTiles } from "@/components/CategoryTiles";
import { TrustBar } from "@/components/TrustBar";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Impact, CtaSection } from "@/components/Impact";
import { FaqPreview } from "@/components/FaqPreview";
import { ResourcesStrip } from "@/components/ResourcesStrip";
import { Testimonials } from "@/components/Testimonials";

/**
 * Section order follows the original design, with products given the strongest
 * position the mentor asked for.
 *
 * Hero → assurance strip → category chips → twenty products → categories →
 * everything that explains the business. The chips sit directly above the grid
 * because that is where they are useful: a shopper who wants to narrow does it
 * before they scroll, not after.
 *
 * Two earlier orders are recorded in the changelog because both were wrong:
 * §13 put ~1,400px of brand ahead of the first product on a phone, and §15.3
 * showed the products as horizontal rails — one and a half cards at a time,
 * which is the opposite of "many products first".
 *
 * §16 added the two missing pieces of a landing page — an objection-handling
 * block and somewhere to send people who want the long version — between Impact
 * and Testimonials, and deliberately not further up. Nothing may come between the
 * hero and the products. These two sit after the honest-numbers section because
 * they are the same register: a visitor who has just read what the figures
 * aren't is exactly the person still holding "but is my money safe", so the
 * answer is the next thing they meet. Social proof and the closing CTA stay last.
 */
const Index = () => (
  <AppLayout contained={false}>
    <Hero />
    <TrustBar />
    <CategoryChips />
    <ProductShowcase />
    <CategoryTiles />
    <Features />
    <HowItWorks />
    <Impact />
    <FaqPreview />
    <ResourcesStrip />
    <Testimonials />
    <CtaSection />
  </AppLayout>
);

export default Index;
