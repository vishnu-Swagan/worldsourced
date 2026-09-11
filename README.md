# WorldSourced

Global sourcing **Mission Control** + **Brief Studio** order OS.  
Clients request anything from anywhere — physical & digital products and services, including financial solutions and banking setups. WorldSourced charges a sourcing fee; operator travel is a company cost.

**Owner:** Ganesh Kamankar · Nashik · hello@worldsourced.app

## Stack

- Next.js 14 (App Router) · TypeScript · Tailwind CSS  
- Prisma · SQLite  
- **3D Earth:** `three` + `@react-three/fiber` + `@react-three/drei` (client-only Canvas, `ssr: false`) with blue-marble textures, atmosphere rim, hub markers, and animated sourcing arcs  
- Dark ink + amber/cyan visual system

## Categories (intake)

Form / estimator options (not a marketed framework):

| Id | Label | Fee band | Min |
|----|-------|----------|-----|
| `physical_products` | Physical products | 8–15% | $150 |
| `physical_services` | Physical services | 12–25% | $500 |
| `digital_products` | Digital products | 10–18% | $200 |
| `digital_services` | Digital services | 12–22% | $400 |

Digital services examples include **Financial Solutions** and **Banking Setups** (legitimate sourcing/advisory).

## Setup

```bash
cd /workspace/worldsourced
cp .env.example .env   # if needed
npm install
npx prisma db push
npm run seed
npm run build
npm run start -- -p 3001
# or: npm run dev -- -p 3001
```

## URLs (local)

| Path | Purpose |
|------|---------|
| `/` | Mission Control landing + interactive 3D Earth + fee radar |
| `/order` | Brief Studio multi-step intake |
| `/order/success?code=WS-…` | Confirmation |
| `/track` | Lookup |
| `/track/WS-7K4M-92QX` | Ops theater timeline |
| `/admin` | Dense admin desk |

## Demo

1. Open `/` — drag the globe; tap category chips to highlight routes.  
2. Use fee radar → **Open Brief Studio**.  
3. Complete Brief Studio → get code `WS-XXXX-XXXX`.  
4. Track at `/track/[code]`.  
5. Admin: `/admin` password `worldsourced-admin` — update status / mark quoted.

Seeded codes: **WS-7K4M-92QX**, **WS-P3N8-4H2R**, **WS-F9Q2-1L7C**.

## Env

```
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="worldsourced-admin"
```

## Docs

See [BUSINESS.md](./BUSINESS.md) for fee tables, unit economics, and travel-margin risks.

## Deploy (Render, not Vercel)

Docker web service on Render free. See [DEPLOY.md](./DEPLOY.md) for `Dockerfile` / `render.yaml`, SQLite ephemeral-disk notes, and DuckDNS (A/AAAA-only) vs CNAME DNS.
