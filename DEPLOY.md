# WorldSourced — Render.com deploy (not Vercel)

Docker web service on **Render free**. Do **not** deploy to Vercel.

## What ships

| File | Role |
|------|------|
| `Dockerfile` | `node:20-alpine`. `npm ci` → `prisma generate` → `prisma db push` + seed (bakes `prisma/dev.db`) → `next build`. Start script listens on `$PORT`. |
| `docker-entrypoint.sh` | `prisma db push`, seed **only if** the orders table is empty, then `next start -H 0.0.0.0 -p $PORT`. |
| `render.yaml` | Blueprint: web / docker / `plan: free`. |
| `.dockerignore` | Drops `node_modules` and `.next`; **keeps** `prisma/schema.prisma` + `prisma/seed.ts`. |

SQLite URL in the Blueprint is `file:./prisma/dev.db`. Prisma resolves relative `file:` URLs against `prisma/schema.prisma`, so the entrypoint rewrites that value to `file:/app/prisma/dev.db`.

## SQLite + Render free disk

- Render **free** instances have **ephemeral** disk. Anything written after boot is lost on restart/redeploy unless you attach a **persistent disk** (paid).
- This image **bakes** a seeded `prisma/dev.db` at build time, so a cold start still has demo codes (`WS-7K4M-92QX`, `WS-P3N8-4H2R`, `WS-F9Q2-1L7C`).
- Runtime orders live only until the instance is replaced. `/tmp` and `/data` exist in the image; they are also ephemeral on free.
- Longer-term: attach a disk at `/data` and set `DATABASE_URL=file:/data/dev.db` (entrypoint leaves absolute `/data` paths alone).

## Render signup + first deploy

CLI is **not** used here (no `render` binary / no API key). Use the dashboard:

1. Sign up at [https://dashboard.render.com/register](https://dashboard.render.com/register) (GitHub login is easiest).
2. Push this repo to GitHub (`vishnu-Swagan/worldsourced`).
3. **New → Blueprint** and select the repo (Render reads `render.yaml`), **or** **New → Web Service** → connect the repo → **Docker** runtime → instance **Free**.
4. Confirm env:
   - `ADMIN_PASSWORD=worldsourced-admin`
   - `DATABASE_URL=file:./prisma/dev.db`
5. Deploy. Public URL will look like `https://worldsourced.onrender.com`.
6. Free web services **spin down** when idle; the first request after sleep can take ~30–60s.

Manual Docker (same image Render builds):

```bash
docker build -t worldsourced /workspace/worldsourced
docker run --rm -p 10000:10000 \
  -e PORT=10000 \
  -e ADMIN_PASSWORD=worldsourced-admin \
  -e DATABASE_URL=file:./prisma/dev.db \
  worldsourced
```

## DuckDNS (A/AAAA only)

[DuckDNS](https://www.duckdns.org/) can only set **A** and **AAAA** records to an **IP**. It cannot CNAME to `*.onrender.com`.

After the Render service is live:

```bash
# IPv4 (and IPv6 if present)
dig +short A worldsourced.onrender.com
dig +short AAAA worldsourced.onrender.com
# then paste the A record into the DuckDNS panel (or update via their HTTP API)
```

**Limitation:** on Render **free**, the public IP behind `*.onrender.com` **can change** on sleep, restart, or redeploy. DuckDNS will go stale until you `dig` again and update. There is no stable IP on free.

Render custom domains expect a **CNAME** (or ALIAS/ANAME at the zone apex) to `worldsourced.onrender.com`, plus their DNS verification records — not a raw A record to today’s IP.

### Better long-term (free CNAME DNS)

Use a DNS host that supports CNAME (or ALIAS/ANAME for apex):

- [Cloudflare](https://www.cloudflare.com/) (free) — CNAME `www` → `worldsourced.onrender.com`; apex via CNAME flattening
- [FreeDNS](https://freedns.afraid.org/), [deSEC](https://desec.io/), or a registrar with free DNS

Then in Render: **Settings → Custom Domains** → add `www.yourdomain` → copy the CNAME target they show (usually the `onrender.com` hostname).

Keep using `https://worldsourced.onrender.com` until that CNAME is in place.

## Env

| Key | Value |
|-----|--------|
| `ADMIN_PASSWORD` | `worldsourced-admin` |
| `DATABASE_URL` | `file:./prisma/dev.db` (rewritten at start) |
| `PORT` | Injected by Render (default **10000**) |

Admin: `https://<host>/admin`

## Not Vercel

Do not run `vercel`, do not add a Vercel project, do not set `output: export` for static hosting. This app needs a Node server + Prisma/SQLite.
