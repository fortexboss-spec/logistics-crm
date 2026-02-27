import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const org = await prisma.organization.update({
    where: { id: parseInt(id) },
    data: {
      name: body.name,
      inn: body.inn || null,
      paymentType: body.paymentType,
      paymentValue: body.paymentValue,
      withVat: body.withVat,
      withPenalties: body.withPenalties,
      isActive: body.isActive,
    },
  });
  return NextResponse.json(org);
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.organization.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}