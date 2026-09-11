import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.statusEvent.deleteMany();
  await prisma.order.deleteMany();

  const o1 = await prisma.order.create({
    data: {
      orderCode: "WS-7K4M-92QX",
      status: "SOURCING",
      category: "physical_products",
      title: "Industrial servo motors — Osaka preference",
      description:
        "Need 40× compact AC servo motors (400W class), IP65, with compatible drives. Prefer Japanese OEMs or authorized distributors. Destination Nashik warehouse.",
      sourceRegion: "East Asia / Osaka",
      destinationCountry: "India",
      budgetUsd: 18000,
      deadline: "2026-11-15",
      urgency: "standard",
      companyName: "Demo Robotics Pvt Ltd",
      contactName: "Asha Patil",
      contactEmail: "asha@demo-robotics.example",
      contactPhone: "+91 90000 11111",
      estimatedFeePct: 11.5,
      estimatedFeeMin: 1440,
      estimatedFeeMax: 2700,
      adminNotes: "Demo seed — mid-sourcing",
      statusHistory: {
        create: [
          {
            status: "SUBMITTED",
            note: "Brief received via Brief Studio",
            createdAt: new Date("2026-09-01T04:30:00Z"),
          },
          {
            status: "REVIEWING",
            note: "Desk validated specs; Japan channel viable",
            createdAt: new Date("2026-09-02T06:00:00Z"),
          },
          {
            status: "SOURCING",
            note: "Operator engaging Osaka distributor shortlist",
            createdAt: new Date("2026-09-05T09:15:00Z"),
          },
        ],
      },
    },
  });

  const o2 = await prisma.order.create({
    data: {
      orderCode: "WS-P3N8-4H2R",
      status: "QUOTED",
      category: "digital_products",
      title: "Regional CAD suite seats — EU license pool",
      description:
        "12 floating seats of industrial CAD with EU compliance pack. Need invoice to UAE entity; users in Dubai + Nashik.",
      sourceRegion: "European Union",
      destinationCountry: "United Arab Emirates",
      budgetUsd: 24000,
      deadline: "2026-10-01",
      urgency: "rush",
      companyName: "Gulf Proto Labs",
      contactName: "Omar Al Falasi",
      contactEmail: "omar@gulfproto.example",
      contactPhone: "+971 50 000 2222",
      estimatedFeePct: 17.5,
      estimatedFeeMin: 3000,
      estimatedFeeMax: 5400,
      adminNotes: "Quoted fee USD 4200",
      statusHistory: {
        create: [
          {
            status: "SUBMITTED",
            note: "Digital products brief filed",
            createdAt: new Date("2026-08-20T10:00:00Z"),
          },
          {
            status: "REVIEWING",
            note: "License territory check complete",
            createdAt: new Date("2026-08-21T08:00:00Z"),
          },
          {
            status: "SOURCING",
            note: "VAR quote + seat transfer path confirmed",
            createdAt: new Date("2026-08-25T12:30:00Z"),
          },
          {
            status: "QUOTED",
            note: "Sourcing fee $4,200 · awaiting client approval",
            createdAt: new Date("2026-08-28T07:45:00Z"),
          },
        ],
      },
    },
  });

  const o3 = await prisma.order.create({
    data: {
      orderCode: "WS-F9Q2-1L7C",
      status: "REVIEWING",
      category: "digital_services",
      title: "Payment stack + banking setup intros — GCC",
      description:
        "Need sourcing/advisory for fintech rails and banking setup intros for a UAE-registered SaaS. Account structuring intros, payment stack vendors, compliance tooling — legitimate advisory only.",
      sourceRegion: "Middle East",
      destinationCountry: "United Arab Emirates",
      budgetUsd: 35000,
      deadline: "2026-12-01",
      urgency: "standard",
      companyName: "Sandbar Commerce",
      contactName: "Priya Mehta",
      contactEmail: "priya@sandbar.example",
      contactPhone: "+971 50 000 3333",
      estimatedFeePct: 17,
      estimatedFeeMin: 4200,
      estimatedFeeMax: 7700,
      adminNotes: "Demo — financial solutions / banking setups",
      statusHistory: {
        create: [
          {
            status: "SUBMITTED",
            note: "Digital services brief — financial solutions",
            createdAt: new Date("2026-09-08T05:00:00Z"),
          },
          {
            status: "REVIEWING",
            note: "Compliance framing check; advisory scope only",
            createdAt: new Date("2026-09-09T07:20:00Z"),
          },
        ],
      },
    },
  });

  console.log("Seeded:", o1.orderCode, o2.orderCode, o3.orderCode);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
