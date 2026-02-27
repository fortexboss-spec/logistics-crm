import { NextRequest, NextResponse } from 'next/server';
const WB_HOSTS: Record<string, string> = {
  'reports': 'https://logistics.wb.ru/reports-service',
  'vehicles': 'https://logistics.wb.ru/vehicles-service',
  'drivers': 'https://logistics.wb.ru/drivers-service',
  'waysheets': 'https://drive.wb.ru/client-gateway',
  'shipments': 'https://logistics.wb.ru/shipments-service',
  'transport': 'https://logistics.wb.ru/transport-requests-service',
  'finance': 'https://drive.wb.ru/client-gateway',
  'planning': 'https://logistics.wb.ru/transport-planning-service',
  'courier': 'https://drive.wb.ru/client-gateway/courier',
};
async function proxyWB(request: NextRequest) {
  const token = process.env.WB_TOKEN;
  if (!token) return NextResponse.json({ error: 'WB_TOKEN not set' }, { status: 500 });
  const url = new URL(request.url);
  const fullPath = url.pathname.replace('/api/wb/', '');
  const parts = fullPath.split('/');
  const service = parts[0];
  const restPath = parts.slice(1).join('/');
  const host = WB_HOSTS[service];
  if (!host) return NextResponse.json({ error: 'Unknown service: ' + service }, { status: 400 });
  const targetUrl = host + '/api/' + restPath + url.search;
  try {
    const headers: Record<string, string> = {
      'Authorization': 'Bearer ' + token,
      'Accept': 'application/json',
    };
    let body: string | undefined;
    if (request.method !== 'GET') {
      body = await request.text();
      headers['Content-Type'] = 'application/json';
    }
    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: 'WB API error: ' + error.message, targetUrl }, { status: 500 });
  }
}
export async function GET(request: NextRequest) { return proxyWB(request); }
export async function POST(request: NextRequest) { return proxyWB(request); }