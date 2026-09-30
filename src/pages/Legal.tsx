import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

interface LegalDocument {
  id: string;
  title: string;
  updated: string;
  sections: { heading: string; body: string }[];
}

const documents: LegalDocument[] = [
  {
    id: "terms",
    title: "Terms of service",
    updated: "Last updated 1 September 2026",
    sections: [
      {
        heading: "Who you are contracting with",
        body: "Sustain Markets Ltd. operates a marketplace for pre-owned goods. Listing an item makes you a seller and accepting an offer makes you a buyer. Both roles are governed by these terms. Accounts are free; we earn a transaction fee on completed sales, never a listing fee.",
      },
      {
        heading: "Escrow settlement",
        body: "When a buyer completes a purchase, the item price is held in escrow rather than paid to the seller immediately. Funds are released to the seller only when the buyer confirms delivery. While funds are held, either party may raise a settlement dispute with the Sustain operations team, which pauses release until the claim is resolved.",
      },
      {
        heading: "Condition and accuracy of listings",
        body: "Sellers must describe the condition of each item accurately and photograph any defect. Listings that misrepresent condition may be removed, and balances held against them may be withheld pending review.",
      },
      {
        heading: "Prohibited items",
        body: "We do not accept hazardous materials, counterfeit goods, items subject to an active recall, or anything whose resale would breach applicable law. We may remove listings and suspend accounts that breach this section.",
      },
      {
        heading: "Environmental claims",
        body: "Sustainability figures shown against a listing are estimates derived from the device category and condition you supply. They are indicative rather than measured, and must not be presented as audited figures.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy notice",
    updated: "Last updated 1 September 2026",
    sections: [
      {
        heading: "What we collect",
        body: "We collect the account details you provide at sign-up (name, email, and provider ID if you authenticate with Google or Facebook), the listings and orders you create, and the transaction records required to settle escrow. We do not collect payment card details; balances are held in EcoCoins.",
      },
      {
        heading: "Why we collect it",
        body: "Account details identify you and authenticate your session. Listings and orders are necessary to operate the marketplace and to resolve disputes. Transaction records are retained to meet audit and regulatory obligations around settlement.",
      },
      {
        heading: "Who we share it with",
        body: "We share the minimum necessary with our authentication, hosting, and payments infrastructure providers. We do not sell personal data. We disclose data only where required by law or to defend a legal claim.",
      },
      {
        heading: "Your rights",
        body: "You may request a copy of your data, ask for corrections, or ask us to delete your account. Because transaction records are retained for audit purposes, some settlement history must be kept even after an account is closed. Contact support@sustain.eco to exercise any of these rights.",
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookie preferences",
    updated: "Last updated 1 September 2026",
    sections: [
      {
        heading: "What we set",
        body: "We set one essential cookie to keep you signed in between visits. Without it you would be signed out on every page load. We do not use advertising or cross-site tracking cookies.",
      },
      {
        heading: "Analytics",
        body: "Aggregate, non-identifying usage measurement helps us find broken pages. It is disabled until you opt in, and declining it does not affect any feature of the marketplace.",
      },
      {
        heading: "Managing your choice",
        body: "You can clear or block cookies in your browser settings at any time. Blocking the session cookie simply means you will need to sign in again on each visit.",
      },
    ],
  },
  {
    id: "modern-slavery",
    title: "Modern slavery statement",
    updated: "Last updated 1 September 2026",
    sections: [
      {
        heading: "Our commitment",
        body: "Sustain Markets Ltd. opposes modern slavery in all its forms and confirms that no known practices of forced or bonded labour are used in our own operations or supply chain.",
      },
      {
        heading: "Supply chain due diligence",
        body: "Our supply chain consists of the logistics and authentication partners who inspect and ship pre-owned goods. We select partners on the basis of labour standards and audit them annually. High-risk routes are escalated for review before onboarding.",
      },
      {
        heading: "Reporting concerns",
        body: "Concerns can be raised confidentially at support@sustain.eco. We investigate all reports and will disclose the outcome where the reporter can lawfully be told.",
      },
    ],
  },
];

const Legal = () => (
  <AppLayout contained={false}>
    <PageHeader
      eyebrow="Legal"
      title="Policies and statements"
      description="The documents governing your use of the Sustain marketplace and the handling of your data."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Legal" }]}
    />

    <div className="container grid gap-10 py-8 md:py-10 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav aria-label="Documents" className="hidden lg:block">
        <div className="sticky top-28">
          <p className="eyebrow">Documents</p>
          <ul className="mt-4 space-y-1.5">
            {documents.map((doc) => (
              <li key={doc.id}>
                <a
                  href={`#${doc.id}`}
                  className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {doc.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="space-y-6">
        {documents.map((doc) => (
          <Card key={doc.id} id={doc.id} className="scroll-mt-28">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-foreground">{doc.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{doc.updated}</p>
            </div>
            <CardContent className="space-y-5 p-6">
              {doc.sections.map((section) => (
                <div key={section.heading}>
                  <h3 className="text-sm font-semibold text-foreground">{section.heading}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </AppLayout>
);

export default Legal;
