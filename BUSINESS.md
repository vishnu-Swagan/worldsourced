# WorldSourced — Business model & unit economics

**Brand:** WorldSourced  
**Owner:** Ganesh Kamankar · Nashik, India  
**Contact:** hello@worldsourced.app

## What we sell

Clients request **anything from anywhere** — physical products, physical services, digital products, and digital services (including financial solutions and banking setups framed as legitimate sourcing/advisory). We charge a **sourcing fee** based on order value and complexity. Product/license cost is passed through or quoted separately; the fee is our revenue.

## Operator cost doctrine (locked messaging)

**Tickets, stay, food, visas, and on-mission travel are company operating costs.**  
They are **not** billed as separate client line items unless already included inside the agreed sourcing fee. Marketing copy must keep this clear: *“You buy the outcome. We absorb the journey.”* Travel costs stay on WorldSourced.

Implication: travel burn eats **gross margin**. High-travel missions (on-site services) need higher fee floors.

## Fee table (estimator defaults)

| Category | Fee % of order value | Minimum fee | Notes |
|----------|----------------------|-------------|--------|
| Physical products | 8–15% | $150 | Components, specialty goods, machinery, samples |
| Physical services | 12–25% | $500 | Audits, QC, negotiations, scouting, logistics |
| Digital products | 10–18% | $200 | Licenses, SaaS, APIs, datasets, digital assets |
| Digital services | 12–22% | $400 | Implementation, cloud, cyber, financial solutions, banking setups |

**Urgency multipliers:** Rush **1.25×** · Urgent **1.5×** (applied to % and floors).  
**Scout region bump (estimator):** East Asia ~1.08×, EU/US ~1.05×, Middle East ~1.06×, Anywhere 1×.

Estimator ETA bands (business days, before urgency compression):

- Physical products: 14–45  
- Physical services: 21–60  
- Digital products: 7–21  
- Digital services: 18–50  

## Unit economics (assumptions)

Illustrative mid-case (physical products, $10,000 order value, standard urgency):

| Line | Amount |
|------|--------|
| Order value (client budget) | $10,000 |
| Mid fee (~11.5%) | ~$1,150 |
| Assumed COGS (pass-through goods) | ~$10,000 (client-funded / quoted) |
| Gross fee revenue | ~$1,150 |
| Operator travel (if needed) | $0–$1,800 (company cost) |
| Desk / overhead allocation | ~$150–$300 |
| **Contribution after travel** | Can go **near-zero or negative** on heavy travel |

**Physical services** at 12–25% with $500 floor are designed so a single short trip does not wipe the fee. Still: a long multi-city trip can exceed fee — mitigate with higher quoted %, remote-first sourcing, or bundling multiple client jobs on one itinerary.

### Honest risks

1. **Travel eats margin** — especially physical services; never promise “free travel” as unlimited scope.  
2. **Currency / FX** on international POs.  
3. **Export controls / sanctions** — refuse restricted goods/regions.  
4. **Supplier fraud** — deposits, escrow, verified channels.  
5. **License territory** — software seats often non-transferable without VAR path.  
6. **Financial / banking advisory** — stay in legitimate sourcing and intros; no illegal banking facilitation.  
7. **Reputation** — overselling ETA damages trust; estimator is indicative only.

## Pricing discipline

- Always show **fee range + floor**, not a fake single number.  
- Final quote after desk review.  
- Rush/urgent: compress ETA, raise fee — document in quote.  
- If travel is expected to exceed ~40% of fee, **raise fee or decline** unless strategic.

## Demo seed orders

| Code | Status | Category |
|------|--------|----------|
| `WS-7K4M-92QX` | SOURCING | Physical products |
| `WS-P3N8-4H2R` | QUOTED | Digital products |
| `WS-F9Q2-1L7C` | REVIEWING | Digital services (financial / banking) |

## Admin

Password from env `ADMIN_PASSWORD` (default `worldsourced-admin`).

## Product tech note

Landing hero uses an original Three.js / React Three Fiber globe (day map + night lights + specular water + atmosphere rim) with animated sourcing arcs between hubs. Textures live under `/public/earth`. Canvas is dynamically imported with `ssr: false`.
