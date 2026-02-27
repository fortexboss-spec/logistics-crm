import { NextRequest, NextResponse } from "next/server";
const WB_TOKEN = process.env.WB_TOKEN || "";
const DRIVE_URL = "https://drive.wb.ru/client-gateway/api/waysheets/v1/waysheets";
export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.toString();
  return doFetch("GET", search ? DRIVE_URL + "?" + search : DRIVE_URL, null);
}
export async function POST(req: NextRequest) {
  const body = await req.text();
  return doFetch("POST", DRIVE_URL, body);
}
async function doFetch(method: string, url: string, body: string | null) {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: "Bearer " + WB_TOKEN,
        "Content-Type": "application/json",
      },
      body,
    });
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch {
      return new NextResponse(text, { status: res.status });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}