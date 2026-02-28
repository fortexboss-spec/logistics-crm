import { NextRequest, NextResponse } from 'next/server';
const WB_TOKEN = process.env.WB_TOKEN || '';
const DRIVE_URL = 'https://drive.wb.ru/client-gateway/api/waysheets/v1/waysheets';
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const res = await fetch(DRIVE_URL, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + WB_TOKEN, 'Content-Type': 'application/json' },
      body: body
    });
    const text = await res.text();
    try { return NextResponse.json(JSON.parse(text), {status: res.status}); }
    catch { return new NextResponse(text, {status: res.status}); }
  } catch(e) {
    return NextResponse.json({error: String(e)}, {status: 500});
  }
}