#!/bin/sh
set -eu

PORT="${PORT:-10000}"
WORKDIR="${WORKDIR:-/app}"
cd "$WORKDIR"

mkdir -p /tmp /data "$WORKDIR/prisma"

# Prisma SQLite paths are relative to prisma/schema.prisma, not the project root.
# render.yaml sets file:./prisma/dev.db (root-style). Rewrite to an absolute file
# so the DB is always $WORKDIR/prisma/dev.db. Leave /data or other abs paths alone.
case "${DATABASE_URL:-}" in
  file:./prisma/dev.db|file:prisma/dev.db|file:./dev.db|file:dev.db|"")
    export DATABASE_URL="file:${WORKDIR}/prisma/dev.db"
    ;;
esac

echo "worldsourced boot: PORT=${PORT} DATABASE_URL=${DATABASE_URL}"

echo "prisma db push…"
npx prisma db push --skip-generate

# Seed only when the orders table is empty (fresh image / wiped ephemeral disk).
# Do NOT re-seed a live DB — seed.ts deletes all orders.
ORDER_COUNT="$(
  node -e "
    const { PrismaClient } = require('@prisma/client');
    const p = new PrismaClient();
    p.order.count()
      .then((c) => process.stdout.write(String(c)))
      .catch(() => process.stdout.write('0'))
      .finally(() => p.\$disconnect());
  "
)"
echo "order count: ${ORDER_COUNT}"

if [ "${ORDER_COUNT}" = "0" ]; then
  echo "empty DB — running seed"
  npm run seed
fi

echo "starting next on 0.0.0.0:${PORT}"
exec npx next start -H 0.0.0.0 -p "$PORT"
