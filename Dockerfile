# WorldSourced — Render.com Docker web service (node:20-alpine)
# SQLite lives at /app/prisma/dev.db (ephemeral on Render free unless a disk is mounted).

FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma
ENV DATABASE_URL="file:/app/prisma/dev.db"
ENV NEXT_TELEMETRY_DISABLED=1
# NODE_ENV=production during npm ci would omit tailwind/typescript (devDeps) and break next build.
RUN npm ci
ENV NODE_ENV=production

COPY . .
# Bake schema + demo seed into the image so a fresh free instance has WS-* codes.
RUN npx prisma generate \
  && npx prisma db push \
  && npm run seed \
  && npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl \
  && mkdir -p /tmp /data /app/prisma

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=10000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL="file:./prisma/dev.db"
ENV ADMIN_PASSWORD=worldsourced-admin

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/tsconfig.json ./
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 10000
CMD ["/app/docker-entrypoint.sh"]
