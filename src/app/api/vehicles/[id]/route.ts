import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const vehicle = await prisma.vehicle.update({
    where: { id: Number(id) },
    data: {
      licensePlate: body.licensePlate,
      brand: body.brand || "Неизвестно",
      model: body.model || "Неизвестно",
      fuelType: body.fuelType || "diesel",
      tankCapacity: body.tankCapacity || 60,
      year: body.year || 2020,
      averageConsumption: body.averageConsumption || 10,
      initialMileage: body.initialMileage || 0,
      status: body.status || "active",
      driverId: body.driverId || null,
    },
  });
  return NextResponse.json(vehicle);
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.vehicle.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}