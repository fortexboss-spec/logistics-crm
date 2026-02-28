import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const WB_TOKEN = process.env.WB_TOKEN || '';

export async function GET() {
  try {
    const res = await fetch('https://logistics.wb.ru/reports-service/api/v1/last-mile', {
      headers: {
        Authorization: 'Bearer ' + WB_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();

    // Save snapshots to DB in background (don't block response)
    if (data?.data) {
      try {
        const offices = data.data;
        const snapshots: any[] = [];

        for (const office of offices) {
          if (!office.routes) continue;
          for (const route of office.routes) {
            snapshots.push({
              routeCarId: route.route_car_id,
              officeId: office.office_id,
              officeName: office.office_name || null,
              countShk: route.count_shk || 0,
              countTares: route.count_tares || 0,
              volumeMl: route.volume_ml_by_content || 0,
              normLiters: route.normative_liters || 0,
              distance: route.distance || 0,
              shkLastHours: route.shk_last_hours || 0,
              planDeparture: route.plan_count_departure || 0,
            });
          }
        }

        if (snapshots.length > 0) {
          await prisma.routeSnapshot.createMany({ data: snapshots });
        }
      } catch (dbErr) {
        console.error('Failed to save route snapshots:', dbErr);
      }
    }

    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
