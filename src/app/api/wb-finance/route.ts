import { NextRequest, NextResponse } from 'next/server';
const WB_TOKEN = process.env.WB_TOKEN || '';
const SUPPLIER_ID = '344813';
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const dateFrom = searchParams.get('dateFrom') || '2026-02-14T00:00:00Z';
  const dateTo = searchParams.get('dateTo') || '2026-02-28T23:59:59Z';
  const params = new URLSearchParams({supplier_id:SUPPLIER_ID,date_from:dateFrom,date_to:dateTo});
  const url = 'https://drive.wb.ru/client-gateway/api/finance/credeber/v1/operations/history/details?' + params.toString();
  try {
    const res = await fetch(url,{headers:{Authorization:'Bearer '+WB_TOKEN}});
    const data = await res.json();
    return NextResponse.json(data,{status:res.status});
  } catch(e) {
    return NextResponse.json({error:String(e)},{status:500});
  }
}