import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const vehicles = await prisma.vehicle.findMany({
    include: { driver: true },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(vehicles);
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const vehicle = await prisma.vehicle.create({
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
  return NextResponse.json(vehicle, { status: 201 });
}