import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
export async function POST(req: NextRequest) {
  const { path, content } = await req.json();
  const fp = join(process.cwd(), path);
  mkdirSync(dirname(fp), { recursive: true });
  writeFileSync(fp, content, "utf8");
  return NextResponse.json({ ok: true, path: fp });
}