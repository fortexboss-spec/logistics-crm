
import { NextResponse } from "next/server";
import { readdirSync, existsSync } from "fs";
import { join } from "path";

export async function GET() {
  const base = join(process.cwd(), "src/app");
  const dirs = readdirSync(base).filter(f => {
    try { return readdirSync(join(base, f)).length > 0; } catch { return false; }
  });
  const result: any = {};
  for (const d of dirs) {
    const sub = readdirSync(join(base, d));
    result[d] = sub;
    // Check for nested routes-analytics
    if (sub.includes("routes-analytics")) {
      result[d + "/routes-analytics"] = readdirSync(join(base, d, "routes-analytics"));
    }
  }
  return NextResponse.json(result);
}