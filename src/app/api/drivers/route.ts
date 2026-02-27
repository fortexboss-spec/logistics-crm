import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const drivers = await prisma.driver.findMany({
    include: { organization: true },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(drivers);
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const driver = await prisma.driver.create({
    data: {
      fullName: body.fullName,
      vehicleNumber: body.vehicleNumber || null,
      phone: body.phone || null,
      paymentType: body.paymentType || "fixed",
      paymentValue: body.paymentValue || "0.00",
      withPenalties: body.withPenalties ?? true,
      withVat: body.withVat ?? false,
      driverIdWb: body.driverIdWb || null,
      freelancerIdWb: body.freelancerIdWb || null,
      status: body.status || "на линии",
      organizationId: body.organizationId || null,
    },
  });
  return NextResponse.json(driver, { status: 201 });
}