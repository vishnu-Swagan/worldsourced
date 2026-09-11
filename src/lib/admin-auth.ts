import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "ws_admin";

function token(): string {
  const secret = process.env.ADMIN_PASSWORD || "worldsourced-admin";
  return createHmac("sha256", secret).update("worldsourced-admin-session").digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "worldsourced-admin";
  try {
    const a = Buffer.from(password);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function setAdminCookie() {
  cookies().set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAdminCookie() {
  cookies().set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export function isAdminAuthenticated(): boolean {
  const val = cookies().get(COOKIE)?.value;
  if (!val) return false;
  try {
    const a = Buffer.from(val);
    const b = Buffer.from(token());
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
