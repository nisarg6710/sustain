import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  meta,
  className,
}: PageHeaderProps) => (
  <header className={cn("border-b border-border bg-card", className)}>
    <div className="container py-8 md:py-10">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/50" aria-hidden="true" />}
                {crumb.to ? (
                  <Link to={crumb.to} className="transition-colors hover:text-foreground">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-foreground">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
          <h1 className="display text-display font-semibold text-foreground">{title}</h1>
          {description && <p className="mt-3.5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lede">{description}</p>}
          {meta && <div className="mt-5">{meta}</div>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </div>
  </header>
);
