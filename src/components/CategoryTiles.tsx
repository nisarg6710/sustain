import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Dumbbell,
  House,
  Laptop,
  Shirt,
  ToyBrick,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

interface Category {
  label: string;
  value: string;
  blurb: string;
  icon: LucideIcon;
  tone: string;
}

const categories: Category[] = [
  {
    label: "Electronics",
    value: "electronics",
    blurb: "Cameras, audio, computing and kit",
    icon: Laptop,
    tone: "from-primary/20 via-primary/10 to-transparent",
  },
  {
    label: "Fashion",
    value: "fashion",
    blurb: "Outerwear, denim, footwear",
    icon: Shirt,
    tone: "from-accent/25 via-accent/10 to-transparent",
  },
  {
    label: "Home & garden",
    value: "home",
    blurb: "Furniture, tools, decor",
    icon: House,
    tone: "from-success/20 via-success/10 to-transparent",
  },
  {
    label: "Sports & outdoors",
    value: "sports",
    blurb: "Cycling, fitness, camping",
    icon: Dumbbell,
    tone: "from-info/20 via-info/10 to-transparent",
  },
  {
    label: "Books & media",
    value: "books",
    blurb: "Paperbacks, vinyl, games",
    icon: BookOpen,
    tone: "from-warning/25 via-warning/10 to-transparent",
  },
  {
    label: "Toys & games",
    value: "toys",
    blurb: "Collectables, board games",
    icon: ToyBrick,
    tone: "from-primary/25 via-warning/10 to-transparent",
  },
];

export const CategoryTiles = () => (
  <section id="categories" className="border-b border-border py-14 sm:py-20 md:py-24">
    <div className="container">
      <SectionHeading
        eyebrow="Browse by category"
        title="Start with what you're looking for"
        description="Six categories covering the inventory that circulates most. Every listing is escrowed and impact-rated."
      >
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          View all listings
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </SectionHeading>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-3">
        {categories.map((category, index) => (
          <Reveal key={category.value} delay={index * 60}>
            <Link
              to={`/marketplace?category=${category.value}`}
              className="group relative flex min-h-[164px] h-full flex-col justify-between overflow-hidden rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md sm:min-h-0 sm:p-6"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${category.tone} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
                aria-hidden="true"
              />

              <div className="relative">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/60 bg-card/80 text-foreground shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-11 sm:w-11">
                  <category.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
              </div>

              <div className="relative mt-6 sm:mt-8">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-foreground sm:text-base">{category.label}</h3>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">{category.blurb}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
