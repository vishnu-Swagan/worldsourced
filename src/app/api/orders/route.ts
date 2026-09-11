import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderCode } from "@/lib/order-code";
import { normalizeCategory } from "@/lib/fees";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      category: rawCategory,
      title,
      description,
      sourceRegion,
      destinationCountry,
      budgetUsd,
      deadline,
      urgency,
      companyName,
      contactName,
      contactEmail,
      contactPhone,
      estimatedFeePct,
      estimatedFeeMin,
      estimatedFeeMax,
    } = body;

    if (!rawCategory || !title || !description || !destinationCountry || !contactName || !contactEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const category = normalizeCategory(String(rawCategory));

    let orderCode = generateOrderCode();
    for (let i = 0; i < 5; i++) {
      const exists = await prisma.order.findUnique({ where: { orderCode } });
      if (!exists) break;
      orderCode = generateOrderCode();
    }

    const order = await prisma.order.create({
      data: {
        orderCode,
        category,
        title: String(title).slice(0, 200),
        description: String(description).slice(0, 5000),
        sourceRegion: sourceRegion || null,
        destinationCountry: String(destinationCountry).slice(0, 100),
        budgetUsd: budgetUsd != null ? Number(budgetUsd) : null,
        deadline: deadline || null,
        urgency: urgency || "standard",
        companyName: companyName || null,
        contactName: String(contactName).slice(0, 120),
        contactEmail: String(contactEmail).slice(0, 200),
        contactPhone: contactPhone || null,
        estimatedFeePct: estimatedFeePct != null ? Number(estimatedFeePct) : null,
        estimatedFeeMin: estimatedFeeMin != null ? Number(estimatedFeeMin) : null,
        estimatedFeeMax: estimatedFeeMax != null ? Number(estimatedFeeMax) : null,
        status: "SUBMITTED",
        statusHistory: {
          create: {
            status: "SUBMITTED",
            note: "Order submitted via WorldSourced webapp",
          },
        },
      },
    });

    return NextResponse.json({
      id: order.id,
      orderCode: order.orderCode,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "worldsourced-orders" });
}
