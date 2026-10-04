import { Fingerprint, Lock, Scale, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/Reveal";

/**
 * The assurance strip: four icon tiles on a lifted band.
 *
 * These tiles were removed in §14.5 as a "generated landing page" tell, which
 * was wrong — they were the design. Restored, with two corrections: the icon
 * sits in a bordered tile rather than a flat tint (a flat `bg-primary/10` square
 * is the part that looks generated), and the copy says what each protection
 * actually does rather than asserting a score for it.
 */
const assurances = [
  { icon: Lock, title: "Custodied settlement", detail: "Funds release only on confirmed delivery" },
  { icon: Fingerprint, title: "Verified counterparties", detail: "ID checks before your first payout goes out" },
  { icon: Scale, title: "Auditable ledger", detail: "Every EcoCoin movement is a readable row" },
  { icon: ShieldCheck, title: "Buyer protection", detail: "Raise a dispute and the payout stops" },
];

export const TrustBar = () => (
  <section className="border-b border-border bg-card/60">
    <div className="container py-8 sm:py-10">
      <dl className="grid grid-cols-2 gap-x-5 gap-y-6 lg:grid-cols-4 lg:gap-x-8">
        {assurances.map((item, index) => (
          <Reveal key={item.title} delay={index * 60} className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-primary">
              <item.icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <dt className="text-sm font-semibold leading-snug text-foreground">{item.title}</dt>
              <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.detail}</dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </div>
  </section>
);
