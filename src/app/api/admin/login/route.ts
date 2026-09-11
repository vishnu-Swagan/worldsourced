import { NextRequest, NextResponse } from "next/server";
import {
  clearAdminCookie,
  setAdminCookie,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body.action === "logout") {
    clearAdminCookie();
    return NextResponse.json({ ok: true });
  }
  if (!verifyAdminPassword(String(body.password || ""))) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  setAdminCookie();
  return NextResponse.json({ ok: true });
}
