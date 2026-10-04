import { AppLayout } from "@/components/AppLayout";
import { Hero } from "@/components/Hero";
import { CategoryChips } from "@/components/CategoryChips";
import ProductShowcase from "@/components/ProductShowcase";
import { CategoryTiles } from "@/components/CategoryTiles";
import { TrustBar } from "@/components/TrustBar";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Impact, CtaSection } from "@/components/Impact";
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
    <Testimonials />
    <CtaSection />
  </AppLayout>
);

export default Index;
