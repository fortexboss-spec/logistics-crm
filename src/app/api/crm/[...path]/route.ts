import { NextRequest, NextResponse } from 'next/server';
const CRM_BASE = process.env.CRM_API || 'http://5.42.101.250/api';
async function proxyRequest(request: NextRequest) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.replace('/api/crm/', '');
  const targetUrl = CRM_BASE + '/' + pathSegments + url.search;
  try {
    const res = await fetch(targetUrl, {
      method: request.method,
      headers: { 'Content-Type': 'application/json' },
      body: request.method !== 'GET' ? await request.text() : undefined,
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from CRM API' }, { status: 500 });
  }
}
export async function GET(request: NextRequest) { return proxyRequest(request); }
export async function POST(request: NextRequest) { return proxyRequest(request); }
export async function PUT(request: NextRequest) { return proxyRequest(request); }
export async function DELETE(request: NextRequest) { return proxyRequest(request); }