import { ArrowUpRight, Heart, Leaf, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

const featuredProducts = [
  { title: "Fujifilm X-T30 camera", category: "Electronics", condition: "Like new", price: "640", place: "Manchester", impact: "1.8 kg CO₂ saved", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85" },
  { title: "Arket wool overshirt", category: "Fashion", condition: "Excellent", price: "72", place: "Bristol", impact: "4.2 kg CO₂ saved", image: "https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&q=85" },
  { title: "Herman Miller task chair", category: "Home", condition: "Good", price: "390", place: "London", impact: "18 kg CO₂ saved", image: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=900&q=85" },
  { title: "Specialized commuter bike", category: "Outdoors", condition: "Serviced", price: "560", place: "Leeds", impact: "42 kg CO₂ saved", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=85" },
  { title: "Technics SL-1200 turntable", category: "Audio", condition: "Good", price: "315", place: "Glasgow", impact: "10 kg CO₂ saved", image: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=900&q=85" },
  { title: "Le Creuset casserole dish", category: "Kitchen", condition: "Like new", price: "58", place: "Bath", impact: "6.6 kg CO₂ saved", image: "https://images.unsplash.com/photo-1584990347449-a7b52950ba0f?auto=format&fit=crop&w=900&q=85" },
  { title: "Nintendo Switch bundle", category: "Gaming", condition: "Good", price: "190", place: "Sheffield", impact: "7.4 kg CO₂ saved", image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=900&q=85" },
  { title: "Weekend canvas holdall", category: "Fashion", condition: "Excellent", price: "46", place: "Brighton", impact: "3.1 kg CO₂ saved", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85" },
];

export const FeaturedProducts = () => (
  <section className="border-b border-border bg-background py-14 sm:py-16 md:py-20">
    <div className="container">
      <SectionHeading eyebrow="Fresh to the marketplace" title="Good finds, ready for their next chapter" description="A preview of what our community is passing on. Browse the live marketplace to see every available listing.">
        <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">View all products <ArrowUpRight className="h-4 w-4" /></Link>
      </SectionHeading>
      <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-7 sm:mt-10 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-5">
        {featuredProducts.map((product, index) => (
          <Reveal key={product.title} delay={Math.min(index * 45, 180)}>
            <Link to={`/marketplace?q=${encodeURIComponent(product.title)}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary sm:rounded-xl">
                <img src={product.image} alt={product.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <Badge className="absolute left-2 top-2 bg-card/95 text-[10px] text-card-foreground shadow-sm backdrop-blur sm:left-3 sm:top-3" variant="secondary">{product.condition}</Badge>
                <span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-card/95 text-foreground shadow-sm backdrop-blur transition-transform group-hover:scale-110 sm:right-3 sm:top-3 sm:h-9 sm:w-9"><Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></span>
              </div>
              <div className="pt-2.5 sm:pt-3"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">{product.category}</p><h3 className="mt-1 line-clamp-1 text-sm font-semibold text-foreground sm:text-base">{product.title}</h3><div className="mt-1.5 flex items-center justify-between gap-2 sm:mt-2"><p className="text-base font-semibold tabular-nums text-foreground">{product.price} <span className="text-xs font-medium text-muted-foreground">EC</span></p><span className="hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex"><MapPin className="h-3 w-3" />{product.place}</span></div><p className="mt-1.5 flex items-center gap-1 text-[11px] text-primary sm:mt-2 sm:text-xs"><Leaf className="h-3.5 w-3.5" />{product.impact}</p></div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
