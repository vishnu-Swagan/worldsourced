export type Category =
  | "physical_products"
  | "physical_services"
  | "digital_products"
  | "digital_services";
export type Urgency = "standard" | "rush" | "urgent";
export type ScoutRegion = "anywhere" | "eu" | "us" | "east_asia" | "middle_east";

export const CATEGORIES: Category[] = [
  "physical_products",
  "physical_services",
  "digital_products",
  "digital_services",
];

const LEGACY_CATEGORY: Record<string, Category> = {
  products: "physical_products",
  software: "digital_products",
  services: "physical_services",
  custom: "digital_services",
};

export function isCategory(v: string): v is Category {
  return (CATEGORIES as string[]).includes(v);
}

export function normalizeCategory(raw: string | null | undefined): Category {
  if (!raw) return "physical_products";
  if (isCategory(raw)) return raw;
  if (raw in LEGACY_CATEGORY) return LEGACY_CATEGORY[raw];
  return "physical_products";
}

export function categoryLabel(raw: string): string {
  if (isCategory(raw)) return CATEGORY_LABELS[raw];
  if (raw in LEGACY_CATEGORY) return CATEGORY_LABELS[LEGACY_CATEGORY[raw]];
  return raw.replace(/_/g, " ");
}

export const CATEGORY_LABELS: Record<Category, string> = {
  physical_products: "Physical products",
  physical_services: "Physical services",
  digital_products: "Digital products",
  digital_services: "Digital services",
};

export const CATEGORY_TAGLINES: Record<Category, string> = {
  physical_products:
    "Industrial components, specialty goods, machines, samples — found and forwarded.",
  physical_services:
    "Factory visits, vendor talks, on-ground QC, scouting, logistics, install support.",
  digital_products:
    "Licenses, SaaS, APIs, datasets, digital assets, compliance suites — unlocked.",
  digital_services:
    "Implementation, cloud, cybersecurity, financial solutions, banking setups, remote teams.",
};

export const CATEGORY_ITEMS: Record<Category, string[]> = {
  physical_products: [
    "Industrial components",
    "Specialty consumer goods",
    "Machinery & tooling",
    "Samples & small lots",
    "Medical devices",
    "Agri commodities",
    "Rare / regional SKUs",
    "Electronics & PCB assemblies",
    "Textiles & apparel lots",
    "Auto parts & aftermarket",
    "Packaging & labeling materials",
    "Lab & scientific equipment",
    "Cosmetics ingredients",
    "Furniture & fixtures",
    "Construction materials",
    "Renewable energy hardware",
  ],
  physical_services: [
    "Factory visits & audits",
    "Vendor negotiations",
    "On-ground QC & AQL sampling",
    "Market scouting trips",
    "Logistics coordination",
    "Installation support",
    "Sourcing agent embedding",
    "Trade-show booth presence",
    "Warehousing intros & 3PL setup",
    "Pre-shipment inspection",
    "Supplier due diligence visits",
    "Sample hand-carry & courier",
    "Local permit / compliance runs",
    "Packing line observation",
    "Port / CFS supervision",
    "After-sales service setup",
  ],
  digital_products: [
    "Enterprise software licenses",
    "SaaS seat access",
    "APIs & developer tools",
    "Datasets & data feeds",
    "Digital assets & media packs",
    "Compliance / security suites",
    "Plugin & extension licenses",
    "Design system / UI kits",
    "Certificate & training seats",
    "Cloud credit packs",
    "Map / GIS tile licenses",
    "Font & asset libraries",
    "Marketplace seller tools",
    "Analytics / BI seats",
    "E-signature & workflow seats",
    "Industry report subscriptions",
  ],
  digital_services: [
    "Software implementation",
    "Integration & automation",
    "Cloud architecture setup",
    "Cybersecurity engagements",
    "Financial solutions (advisory)",
    "Banking setups (legitimate intros)",
    "Fintech rails advisory",
    "Digital transformation programs",
    "Remote specialist teams",
    "Payment gateway onboarding help",
    "KYC / compliance process design",
    "ERP / CRM rollouts",
    "Data migration projects",
    "DevOps & SRE retainers",
    "Localization & i18n programs",
    "Vendor RFP & shortlist runs",
  ],
};

export const CATEGORY_FEES: Record<
  Category,
  { minPct: number; maxPct: number; minFee: number }
> = {
  physical_products: { minPct: 8, maxPct: 15, minFee: 150 },
  physical_services: { minPct: 12, maxPct: 25, minFee: 500 },
  digital_products: { minPct: 10, maxPct: 18, minFee: 200 },
  digital_services: { minPct: 12, maxPct: 22, minFee: 400 },
};

export const URGENCY_LABELS: Record<Urgency, string> = {
  standard: "Standard",
  rush: "Rush (1.25×)",
  urgent: "Urgent (1.5×)",
};

export const SCOUT_LABELS: Record<ScoutRegion, string> = {
  anywhere: "Anywhere",
  eu: "European Union",
  us: "United States",
  east_asia: "East Asia",
  middle_east: "Middle East",
};

const URGENCY_MULT: Record<Urgency, number> = {
  standard: 1,
  rush: 1.25,
  urgent: 1.5,
};

const ETA_BASE: Record<Category, [number, number]> = {
  physical_products: [14, 45],
  physical_services: [21, 60],
  digital_products: [7, 21],
  digital_services: [18, 50],
};

const REGION_BUMP: Record<ScoutRegion, number> = {
  anywhere: 1,
  eu: 1.05,
  us: 1.05,
  east_asia: 1.08,
  middle_east: 1.06,
};

export function estimateFee(input: {
  category: Category | string;
  orderValueUsd: number;
  urgency: Urgency;
  destinationCountry?: string;
  scoutRegion?: ScoutRegion;
}) {
  const cat = normalizeCategory(input.category);
  const row = CATEGORY_FEES[cat];
  const mult = URGENCY_MULT[input.urgency] ?? 1;
  const value = Math.max(0, input.orderValueUsd || 0);

  const dest = (input.destinationCountry || "").toLowerCase();
  let destBump = REGION_BUMP[input.scoutRegion || "anywhere"] || 1;
  if (
    dest.includes("china") ||
    dest.includes("japan") ||
    dest.includes("korea") ||
    dest.includes("germany") ||
    dest.includes("usa") ||
    dest.includes("united states") ||
    dest.includes("uae") ||
    dest.includes("dubai")
  ) {
    destBump = Math.max(destBump, 1.05);
  }
  if (
    dest.includes("remote") ||
    dest.includes("sanction") ||
    dest.includes("restricted")
  ) {
    destBump = Math.max(destBump, 1.2);
  }

  const midPct = ((row.minPct + row.maxPct) / 2) * mult * destBump;
  const feeMin = Math.max(
    row.minFee * mult,
    (value * row.minPct * mult * destBump) / 100
  );
  let feeMax = Math.max(
    row.minFee * mult * 1.2,
    (value * row.maxPct * mult * destBump) / 100
  );
  if (feeMax < feeMin) feeMax = feeMin * 1.15;

  const [etaLo, etaHi] = ETA_BASE[cat];
  const etaMult =
    input.urgency === "urgent" ? 0.55 : input.urgency === "rush" ? 0.75 : 1;
  const etaMin = Math.max(3, Math.round(etaLo * etaMult));
  const etaMax = Math.max(etaMin + 3, Math.round(etaHi * etaMult));

  return {
    suggestedPct: Math.round(midPct * 10) / 10,
    feeMin: Math.round(feeMin),
    feeMax: Math.round(feeMax),
    etaMinDays: etaMin,
    etaMaxDays: etaMax,
    minFeeFloor: Math.round(row.minFee * mult),
    multiplier: Math.round(mult * destBump * 100) / 100,
  };
}

export const ORDER_STATUSES = [
  "SUBMITTED",
  "REVIEWING",
  "SOURCING",
  "QUOTED",
  "CONFIRMED",
  "IN_PROGRESS",
  "DELIVERED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  SUBMITTED: "Submitted",
  REVIEWING: "Reviewing",
  SOURCING: "Sourcing",
  QUOTED: "Quoted",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In progress",
  DELIVERED: "Delivered",
};

export const STATUS_NEXT_ACTION: Record<OrderStatus, string> = {
  SUBMITTED: "Desk triage within 1 business day",
  REVIEWING: "Feasibility + market scan",
  SOURCING: "Supplier / operator engagement",
  QUOTED: "Awaiting your approval on fee & landed cost",
  CONFIRMED: "Lock PO / travel / license path",
  IN_PROGRESS: "Execution & logistics in flight",
  DELIVERED: "Mission complete — archive & feedback",
};
