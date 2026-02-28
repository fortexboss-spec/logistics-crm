const fs = require('fs');
const code = `import { NextRequest, NextResponse } from 'next/server';
const WB_TOKEN = process.env.WB_TOKEN || '';
const SUPPLIER_ID = '344813';
async function fetchDay(date: string) {
  const dateFrom = date + 'T00:00:00Z';
  const dateTo = date + 'T23:59:59Z';
  const params = new URLSearchParams({supplier_id:SUPPLIER_ID,date_from:dateFrom,date_to:dateTo});
  const url = 'https://drive.wb.ru/client-gateway/api/finance/credeber/v1/operations/history/details?' + params.toString();
  const res = await fetch(url, {headers:{Authorization:'Bearer '+WB_TOKEN}});
  const json = await res.json();
  return json.data || [];
}
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const dateFrom = searchParams.get('dateFrom') || '2026-02-14';
  const dateTo = searchParams.get('dateTo') || '2026-02-28';
  try {
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    const days: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
      days.push(d.toISOString().split('T')[0]);
    }
    const results = await Promise.all(days.map(fetchDay));
    const allData = results.flat();
    return NextResponse.json({data: allData, days: days.length, total: allData.length});
  } catch(e) {
    return NextResponse.json({error:String(e)},{status:500});
  }
}`;
fs.writeFileSync('src/app/api/wb-finance/route.ts', code, 'utf8');
console.log('done');
