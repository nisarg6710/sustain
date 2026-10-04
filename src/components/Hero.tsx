import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Search, ShieldCheck, Sparkles } from "lucide-react";

import { Aurora } from "@/components/Aurora";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import heroBackground from "@/assets/hero-background.jpg";

const heroProducts = [
  { title: "Sony WH-1000XM4", price: "210 EC", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=85", className: "col-span-2 row-span-2" },
  { title: "Oak side table", price: "145 EC", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=85", className: "col-span-1 row-span-1" },
  { title: "Trail running shoes", price: "95 EC", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85", className: "col-span-1 row-span-1" },
];

export const Hero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/marketplace?q=${encodeURIComponent(value)}` : "/marketplace");
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-card">
      <Aurora />
      <div className="hero-media absolute inset-0 bg-cover bg-center opacity-[0.055]" style={{ backgroundImage: `url(${heroBackground})` }} aria-hidden="true" />
      <div className="absolute inset-0 surface-grid opacity-60" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px rule-top" aria-hidden="true" />

      <div className="container relative py-9 sm:py-12 md:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,.95fr)] lg:gap-14">
          <div className="animate-fade-up">
            <Badge variant="outline" className="gap-1.5 border-primary/25 bg-card/70 text-primary backdrop-blur"><Sparkles className="h-3.5 w-3.5" /> Fresh finds added every day</Badge>
            <h1 className="mt-5 max-w-2xl text-[2.35rem] font-semibold leading-[1.04] tracking-tightest text-foreground sm:mt-6 sm:text-5xl lg:text-6xl">Find good stuff. <span className="text-primary">Give it another life.</span></h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lede">Shop quality pre-loved pieces across tech, fashion, home and the outdoors—priced in EcoCoins and protected from checkout to delivery.</p>

            <form onSubmit={search} className="mt-6 max-w-xl rounded-lg border border-border bg-card p-2 shadow-lg shadow-primary/5 sm:mt-8">
              <label htmlFor="hero-search" className="sr-only">Search the marketplace</label>
              <div className="flex gap-2"><div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="hero-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for cameras, furniture, jackets..." className="h-11 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0" /></div><Button type="submit" size="lg" className="shrink-0 px-4 sm:px-5"><span className="hidden sm:inline">Search</span><Search className="h-4 w-4 sm:hidden" /></Button></div>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm"><span className="text-muted-foreground">Trending:</span>{["Headphones", "Bikes", "Vintage denim"].map((term) => <Link key={term} to={`/marketplace?q=${encodeURIComponent(term)}`} className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground">{term}</Link>)}</div>
            <div className="mt-7 grid gap-3 sm:mt-8 sm:flex sm:flex-row"><Button asChild size="lg" className="w-full shadow-md transition-shadow hover:shadow-lg sm:w-auto"><Link to="/marketplace">Explore all products <ArrowRight className="h-4 w-4" /></Link></Button><Button asChild size="lg" variant="outline" className="w-full bg-card/70 backdrop-blur sm:w-auto"><Link to="/create-listing">Sell an item</Link></Button></div>
            <ul className="mt-7 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground sm:mt-8 sm:gap-x-5 sm:text-sm"><li className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" />No listing fees</li><li className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" />Buyer protection included</li></ul>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0"><div className="absolute -inset-5 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" aria-hidden="true" /><div className="grid aspect-[1.12] grid-cols-3 grid-rows-2 gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-xl backdrop-blur sm:aspect-[1.05] sm:gap-3 sm:p-3">{heroProducts.map((product) => <Link key={product.title} to={`/marketplace?q=${encodeURIComponent(product.title)}`} className={`group relative overflow-hidden rounded-xl bg-secondary ${product.className}`}><img src={product.image} alt={product.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent px-2 pb-2 pt-8 text-primary-foreground sm:px-3 sm:pb-3 sm:pt-10"><p className="text-xs font-semibold leading-tight sm:text-sm">{product.title}</p><p className="mt-0.5 text-[10px] text-primary-foreground/80 sm:text-xs">{product.price}</p></div></Link>)}</div><div className="ml-auto mt-3 w-fit rounded-xl border border-border bg-card px-3 py-2.5 shadow-lg sm:absolute sm:-bottom-5 sm:-left-8 sm:mt-0 sm:px-4 sm:py-3"><p className="eyebrow-muted">This month</p><p className="mt-1 text-xs font-semibold text-foreground sm:text-sm">12,806 items recirculated</p></div></div>
        </div>
      </div>
    </section>
  );
};
