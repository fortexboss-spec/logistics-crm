import { NextRequest, NextResponse } from "next/server";
const WB_TOKEN = process.env.WB_TOKEN || "";
const SUPPLIER_ID = "344813";
const SERVICE_MAP: Record<string, string> = {
  "reports": "https://logistics.wb.ru/reports-service",
  "reports-service": "https://logistics.wb.ru/reports-service",
  "vehicles-service": "https://logistics.wb.ru/vehicles-service",
  "drivers-service": "https://logistics.wb.ru/drivers-service",
  "shipments-service": "https://logistics.wb.ru/shipments-service",
  "client-gateway": "https://logistics.wb.ru/client-gateway",
  "transport-planning-service": "https://logistics.wb.ru/transport-planning-service",
};
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const serviceName = path[0];
  const baseUrl = SERVICE_MAP[serviceName];
  if (!baseUrl) {
    return NextResponse.json(
      { error: "Unknown service: " + serviceName, available: Object.keys(SERVICE_MAP) },
      { status: 400 }
    );
  }
  const restPath = path.slice(1).join("/");
  const search = req.nextUrl.searchParams.toString();
  const url = `${baseUrl}/${restPath}${search ? "?" + search : ""}`;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${WB_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}