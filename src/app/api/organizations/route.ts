import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() {
  const orgs = await prisma.organization.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(orgs);
}
export async function POST(request: NextRequest) {
  const body = await request.json();
  const org = await prisma.organization.create({
    data: {
      name: body.name,
      inn: body.inn || null,
      paymentType: body.paymentType || 'fixed',
      paymentValue: body.paymentValue || '0',
      withVat: body.withVat ?? false,
      withPenalties: body.withPenalties ?? true,
      isActive: body.isActive ?? true,
    },
  });
  return NextResponse.json(org, { status: 201 });
}