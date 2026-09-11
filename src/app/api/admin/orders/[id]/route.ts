import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ORDER_STATUSES } from "@/lib/fees";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const status = String(body.status || "");
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id: params.id },
    data: {
      status,
      adminNotes: body.adminNotes != null ? String(body.adminNotes) : undefined,
      statusHistory: {
        create: {
          status,
          note: body.note ? String(body.note) : `Status set to ${status}`,
        },
      },
    },
  });

  return NextResponse.json({ order });
}
