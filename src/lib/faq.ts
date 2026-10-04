export interface FaqQuestion {
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  label: string;
  questions: FaqQuestion[];
}

/**
 * Every question the platform is asked, in one place.
 *
 * This was declared inline in the help centre page, which meant the landing page
 * could not show any of it. Objection-handling is the one thing a marketplace
 * landing page is expected to have, and the answers already existed and were
 * already written in the right register — they were simply unreachable from the
 * front page. Both `pages/FAQ.tsx` and `components/FaqPreview.tsx` read from
 * here so the two can never drift apart.
 */
export const faqCategories: FaqCategory[] = [
  {
    id: "getting-started",
    label: "Getting started",
    questions: [
      {
        question: "What is Sustain?",
        answer:
          "Sustain is a marketplace for pre-owned goods. Sellers list items, buyers purchase with EcoCoins, and the platform holds funds in escrow until delivery is confirmed. Listings carry structured product data and an environmental impact estimate.",
      },
      {
        question: "How do I open an account?",
        answer:
          "Select Sign in in the header and choose Create account, or continue with Google or Facebook. You will be asked to verify your email address and complete identity verification before your first withdrawal.",
      },
      {
        question: "What does it cost?",
        answer:
          "Opening an account and publishing listings is free. A transaction fee is applied when an item sells. There is no monthly subscription.",
      },
    ],
  },
  {
    id: "eco-coins",
    label: "EcoCoins",
    questions: [
      {
        question: "What are EcoCoins?",
        answer:
          "EcoCoins are the platform unit of account used for pricing and settlement. They are held in your wallet, can be spent on any listing, and are recorded in an auditable ledger.",
      },
      {
        question: "How do I earn EcoCoins?",
        answer:
          "Completed sales credit your wallet once the buyer confirms delivery. Approved affiliates also earn a 10% commission on referred sales that settle.",
      },
      {
        question: "Can I withdraw EcoCoins?",
        answer:
          "Yes. Once your balance passes the minimum threshold you can request a payout to a verified account. Payouts typically clear within three to five business days.",
      },
    ],
  },
  {
    id: "selling",
    label: "Selling",
    questions: [
      {
        question: "How do I create a listing?",
        answer:
          "Open Create a listing, attach up to ten photos, and complete the attribute set: title, category, condition, description and fulfilment terms. Request a valuation to have a recommended EcoCoin price applied automatically.",
      },
      {
        question: "How does valuation work?",
        answer:
          "The valuation service reads your photos and attributes, then returns a recommended price in EcoCoins together with the reasoning and an estimated carbon and waste impact. You can accept or override the recommendation.",
      },
      {
        question: "What cannot be listed?",
        answer:
          "Illegal items, weapons, hazardous materials, counterfeit goods, recalled products and anything that breaches our marketplace rules are prohibited. Valuations on flagged items are rejected automatically.",
      },
    ],
  },
  {
    id: "buying",
    label: "Buying",
    questions: [
      {
        question: "How do I purchase an item?",
        answer:
          "Open a listing and select Purchase with EcoCoins. Your wallet balance is checked, funds move into escrow, and the seller is notified to dispatch.",
      },
      {
        question: "Is my payment protected?",
        answer:
          "Yes. Funds are held in escrow and only released to the seller after you confirm delivery. If the item is materially different from the listing, raise a dispute from your order history and settlement is paused during review.",
      },
      {
        question: "What are the return terms?",
        answer:
          "Return windows are set by the seller on each listing and range from no returns up to 30 days. The applicable policy is shown on the listing before you commit.",
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping",
    questions: [
      {
        question: "How is shipping handled?",
        answer:
          "The seller selects the fulfilment method on the listing. Once an order is placed they record the carrier and tracking reference, which appears in your order history.",
      },
      {
        question: "Who pays for shipping?",
        answer:
          "Shipping is agreed between the parties. Where collection is offered, large items can be collected locally, which reduces both cost and carbon impact.",
      },
      {
        question: "What if my order does not arrive?",
        answer:
          "Check the tracking reference first. If the parcel is lost or materially delayed, contact the seller and then raise a dispute. Escrow remains locked while the claim is open.",
      },
    ],
  },
  {
    id: "account",
    label: "Account & security",
    questions: [
      {
        question: "How is my data protected?",
        answer:
          "Credentials are handled by our identity provider and never stored by Sustain. Payment data is tokenised by our payment partners, and all access to operational data is role-based and logged.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "Use the Forgot password link on the sign-in panel. A single-use reset link will be emailed to the address on your account.",
      },
      {
        question: "Can I close my account?",
        answer:
          "Yes. Withdraw any remaining balance and allow open orders to settle before requesting closure, as unsettled escrow cannot be released once an account is closed.",
      },
    ],
  },
  {
    id: "sustainability",
    label: "Sustainability",
    questions: [
      {
        question: "How is impact calculated?",
        answer:
          "Each listing records an estimated carbon offset and waste diversion figure based on the avoided manufacture of an equivalent new unit. These roll up into seller, category and platform reporting.",
      },
      {
        question: "What is the circular economy?",
        answer:
          "A circular economy keeps products and materials in use for as long as possible through reuse, repair and resale. Sustain provides the settlement layer that makes secondary trade commercially viable.",
      },
      {
        question: "Can I get impact reporting for my business?",
        answer:
          "Yes. Sellers can export recirculation volumes, avoided emissions and settlement values by period. Contact the partnerships team for scheduled reporting.",
      },
    ],
  },
];

export const faqCategoryById = (id: string) => faqCategories.find((category) => category.id === id);

/**
 * A single question by category id and position within it.
 *
 * Callers name the two coordinates rather than slicing the flat list, so the
 * landing page's selection stays intentional: reordering or trimming an answer in
 * the help centre cannot silently change which question is featured up front.
 * Returns `null` for an unknown pair instead of throwing, because a typo here
 * should drop one accordion row, not take the page down.
 */
export const faqQuestion = (categoryId: string, index: number): FaqQuestion | null =>
  faqCategoryById(categoryId)?.questions[index] ?? null;