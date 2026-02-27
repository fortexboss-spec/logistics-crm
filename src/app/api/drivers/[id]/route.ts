import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const driver = await prisma.driver.update({
    where: { id: Number(id) },
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
  return NextResponse.json(driver);
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.driver.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}