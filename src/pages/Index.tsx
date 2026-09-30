import { AppLayout } from "@/components/AppLayout";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { CategoryTiles } from "@/components/CategoryTiles";
import { Testimonials } from "@/components/Testimonials";
import { Impact, CtaSection } from "@/components/Impact";

const Index = () => (
  <AppLayout contained={false}>
    <Hero />
    <TrustBar />
    <CategoryTiles />
    <Features />
    <HowItWorks />
    <Impact />
    <Testimonials />
    <CtaSection />
  </AppLayout>
);

export default Index;
