const fs = require('fs');
// API route
fs.mkdirSync('src/app/api/wb-lastmile', {recursive: true});
const apiCode = `import { NextResponse } from 'next/server';
const WB_TOKEN = process.env.WB_TOKEN || '';
export async function GET() {
  try {
    const res = await fetch('https://logistics.wb.ru/reports-service/api/v1/last-mile', {
      headers: { Authorization: 'Bearer ' + WB_TOKEN, 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    return NextResponse.json(data, {status: res.status});
  } catch(e) {
    return NextResponse.json({error: String(e)}, {status: 500});
  }
}`;
fs.writeFileSync('src/app/api/wb-lastmile/route.ts', apiCode, 'utf8');
console.log('API done');
