import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const routeId = searchParams.get('routeId');
    const hours = parseInt(searchParams.get('hours') || '24');
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    if (routeId) {
      // Get history for a specific route
      const snapshots = await prisma.routeSnapshot.findMany({
        where: {
          routeCarId: parseInt(routeId),
          createdAt: { gte: since }
        },
        orderBy: { createdAt: 'asc' }
      });
      return NextResponse.json({ data: snapshots });
    }

    // Get latest snapshot per route with delta from previous
    const allLatest = await prisma.$queryRaw`
      SELECT 
        rs1.routeCarId,
        rs1.officeName,
        rs1.countShk,
        rs1.countTares,
        rs1.volumeMl,
        rs1.normLiters,
        rs1.createdAt,
        rs1.countShk - COALESCE(rs2.countShk, rs1.countShk) as shkDelta,
        rs1.countTares - COALESCE(rs2.countTares, rs1.countTares) as taresDelta,
        rs1.volumeMl - COALESCE(rs2.volumeMl, rs1.volumeMl) as volumeDelta
      FROM RouteSnapshot rs1
      LEFT JOIN RouteSnapshot rs2 ON rs1.routeCarId = rs2.routeCarId
        AND rs2.createdAt = (
          SELECT MAX(rs3.createdAt) FROM RouteSnapshot rs3 
          WHERE rs3.routeCarId = rs1.routeCarId 
          AND rs3.createdAt < rs1.createdAt
        )
      WHERE rs1.createdAt = (
        SELECT MAX(rs4.createdAt) FROM RouteSnapshot rs4 
        WHERE rs4.routeCarId = rs1.routeCarId
      )
      ORDER BY rs1.routeCarId
    `;

    // Also get summary stats
    const totalSnapshots = await prisma.routeSnapshot.count();
    const uniqueRoutes = await prisma.routeSnapshot.groupBy({
      by: ['routeCarId'],
    });
    const oldestSnapshot = await prisma.routeSnapshot.findFirst({
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true }
    });

    return NextResponse.json({
      data: allLatest,
      stats: {
        totalSnapshots,
        uniqueRoutes: uniqueRoutes.length,
        trackingSince: oldestSnapshot?.createdAt || null
      }
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
