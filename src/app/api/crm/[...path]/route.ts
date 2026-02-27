import { NextRequest, NextResponse } from "next/server";
const CRM_BASE = process.env.CRM_API || "http://5.42.101.250";
const CRM_TOKEN = process.env.CRM_TOKEN || "";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const restPath = path.join("/");
  const search = req.nextUrl.searchParams.toString();
  const base = CRM_BASE.endsWith("/") ? CRM_BASE.slice(0, -1) : CRM_BASE;
  const hasApi = base.endsWith("/api");
  const prefix = hasApi ? base : base + "/api";
  const url = prefix + "/" + restPath + "/" + (search ? "?" + search : "");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (CRM_TOKEN) {
    headers["Authorization"] = "Bearer " + CRM_TOKEN;
  }
  try {
    const res = await fetch(url, { headers });
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch {
      return new NextResponse(text, {
        status: res.status,
        headers: { "Content-Type": res.headers.get("Content-Type") || "text/plain" },
      });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}