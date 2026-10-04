import { Fingerprint, Lock, Scale, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/Reveal";

const assurances = [
  { icon: Lock, title: "Custodied settlement", detail: "Funds release only on confirmed delivery" },
  { icon: Fingerprint, title: "Verified counterparties", detail: "KYC checks and role-based permissions" },
  { icon: Scale, title: "Auditable ledger", detail: "Immutable EcoCoin transaction history" },
  { icon: ShieldCheck, title: "Buyer protection", detail: "Dispute resolution on every order" },
];

export const TrustBar = () => (
  <section className="border-b border-border bg-secondary/40">
    <div className="container grid grid-cols-2 gap-x-4 gap-y-5 py-6 sm:gap-6 sm:py-8 lg:grid-cols-4">
      {assurances.map((item, index) => (
        <Reveal key={item.title} delay={index * 70} className="flex items-start gap-2.5 sm:gap-3">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-primary sm:h-9 sm:w-9">
            <item.icon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold leading-snug text-foreground sm:text-sm">{item.title}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">{item.detail}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);
