import { Link } from "react-router-dom";
import { Github, Instagram, Linkedin, Mail, Twitter } from "lucide-react";

import { Brand } from "@/components/Brand";
import { Separator } from "@/components/ui/separator";

const columns = [
  {
    title: "Marketplace",
    links: [
      { label: "Browse all listings", to: "/marketplace" },
      { label: "Electronics", to: "/marketplace?category=electronics" },
      { label: "Fashion", to: "/marketplace?category=fashion" },
      { label: "Home & garden", to: "/marketplace?category=home" },
      { label: "List an item", to: "/create-listing" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "How it works", to: "/how-it-works" },
      { label: "Wallet & EcoCoins", to: "/wallet" },
      { label: "Order management", to: "/my-orders" },
      { label: "Affiliate reporting", to: "/affiliate-dashboard" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help centre", to: "/faq" },
      { label: "Buying guide", to: "/faq#buying" },
      { label: "Selling guide", to: "/faq#selling" },
      { label: "Shipping & delivery", to: "/faq#shipping" },
    ],
  },
];

const legal = [
  { label: "Terms of service", to: "/legal#terms" },
  { label: "Privacy notice", to: "/legal#privacy" },
  { label: "Cookie preferences", to: "/legal#cookies" },
  { label: "Modern slavery statement", to: "/legal#modern-slavery" },
];

const socials = [
  { label: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com" },
  { label: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { label: "Instagram", icon: Instagram, href: "https://www.instagram.com" },
  { label: "GitHub", icon: Github, href: "https://github.com" },
];

export const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container py-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div>
          <Brand />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Sustain operates a regulated secondary market for pre-owned goods — extending product lifecycles while
            keeping settlement, custody and environmental reporting auditable.
          </p>
          <a
            href="mailto:support@sustain.eco"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            <Mail className="h-4 w-4" />
            support@sustain.eco
          </a>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="eyebrow text-foreground">{column.title}</h3>
            <ul className="mt-4 space-y-1 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="-mx-3 inline-block rounded px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Separator className="my-10" />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Sustain Markets Ltd.</span>
          <span className="hidden sm:inline">Registered in England &amp; Wales</span>
          <span className="hidden sm:inline">EcoCoin settlement subject to KYC verification</span>
        </div>

        <div className="flex items-center gap-2">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={social.label}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <social.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      <nav aria-label="Legal" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
        {legal.map((item) => (
          <Link key={item.label} to={item.to} className="transition-colors hover:text-foreground">
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  </footer>
);
