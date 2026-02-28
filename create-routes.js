const fs = require('fs');
// API route для маршрутов
fs.mkdirSync('src/app/api/wb-waysheets', {recursive: true});
const apiCode = `import { NextRequest, NextResponse } from 'next/server';
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
}`;
fs.writeFileSync('src/app/api/wb-waysheets/route.ts', apiCode, 'utf8');
// Page code
const pageCode = `'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { RefreshCw, Search, ChevronDown, ChevronRight, Calendar, TrendingDown } from 'lucide-react';
interface Waysheet {
  id: string;
  opened_at: string;
  closed_at: string;
  office_id: number;
  office_name: string;
  route_id: number;
  route_name: string;
  driver_name: string;
  car_number: string;
  org_name: string;
  boxes_delivered: number;
  boxes_total: number;
  distance_km: number;
  amount: number;
  fine: number;
  total: number;
  status: string;
}
export default function RoutesPage() {
  const [data, setData] = useState<Waysheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('2026-02-22');
  const [dateTo, setDateTo] = useState('2026-02-28');
  // Use wb-finance data mapped to routes
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/wb-finance?dateFrom=' + dateFrom + 'T00:00:00Z&dateTo=' + dateTo + 'T23:59:59Z');
      const json = await res.json();
      if (!json.data) { setError(JSON.stringify(json)); setLoading(false); return; }
      // Group by ext_id (waysheet ID)
      const wsMap = new Map<string, Waysheet>();
      json.data.forEach((op: any) => {
        const id = op.ext_id;
        if (!id) return;
        if (!wsMap.has(id)) {
          wsMap.set(id, {
            id, opened_at: op.created_at, closed_at: op.created_at,
            office_id: 338827, office_name: 'Ярославль Громова',
            route_id: 0, route_name: '—', driver_name: '—', car_number: '—',
            org_name: 'ООО ФРЕШКО', boxes_delivered: 0, boxes_total: 0,
            distance_km: 0, amount: 0, fine: 0, total: 0, status: 'closed'
          });
        }
        const ws = wsMap.get(id)!;
        const val = parseFloat(op.sum?.value || '0');
        if (op.operation_type === 'OPERATION_TYPE_CREDIT') { ws.amount += val; }
        if (op.operation_type === 'OPERATION_TYPE_PENALTY') { ws.fine += val; }
        ws.total = ws.amount + ws.fine;
      });
      setData(Array.from(wsMap.values()).sort((a,b) => b.opened_at > a.opened_at ? 1 : -1));
    } catch(e) { setError(String(e)); }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);
  const filtered = data.filter(w =>
    w.id.includes(search) || w.driver_name.toLowerCase().includes(search.toLowerCase()) ||
    w.route_name.toLowerCase().includes(search.toLowerCase())
  );
  const totalAmount = filtered.reduce((s,w)=>s+w.amount,0);
  const totalFine = filtered.reduce((s,w)=>s+w.fine,0);
  const totalNet = filtered.reduce((s,w)=>s+w.total,0);
  const fmt = (v: number) => v.toLocaleString('ru-RU', {minimumFractionDigits:2,maximumFractionDigits:2});
  const fmtDate = (d: string) => new Date(d).toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'});
  return (
    <div>
      <Header title="Реестр заданий WB" actions={
        <button onClick={fetchData} style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 14px',background:'#3b1f5e',border:'1px solid #8b5cf6',borderRadius:'8px',color:'#e7e2f0',fontSize:'13px',cursor:'pointer'}}>
          <RefreshCw size={14}/> {loading?'Загрузка...':'Обновить'}
        </button>
      }/>
      {/* Filters */}
      <div style={{background:'#1e1530',border:'1px solid #2d1f3d',borderRadius:'12px',padding:'16px 20px',marginBottom:'20px',display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <Calendar size={14} style={{color:'#6b5f7a'}}/>
          <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}
            style={{background:'#2d1f3d',border:'1px solid #3b2a52',borderRadius:'6px',padding:'6px 10px',color:'#e7e2f0',fontSize:'13px'}}/>
          <span style={{color:'#6b5f7a'}}>—</span>
          <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)}
            style={{background:'#2d1f3d',border:'1px solid #3b2a52',borderRadius:'6px',padding:'6px 10px',color:'#e7e2f0',fontSize:'13px'}}/>
          <button onClick={fetchData} style={{padding:'6px 14px',background:'#3b1f5e',border:'1px solid #8b5cf6',borderRadius:'6px',color:'#e7e2f0',fontSize:'12px',cursor:'pointer'}}>Применить</button>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginLeft:'auto'}}>
          <Search size={14} style={{color:'#6b5f7a'}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск по ID, водителю..."
            style={{background:'#2d1f3d',border:'1px solid #3b2a52',borderRadius:'6px',padding:'6px 12px',color:'#e7e2f0',fontSize:'13px',width:'220px'}}/>
        </div>
      </div>
      {/* Summary */}
      {!loading && data.length>0 && (
        <div style={{display:'flex',gap:'24px',alignItems:'center',marginBottom:'16px',padding:'12px 16px',background:'#1e1530',border:'1px solid #2d1f3d',borderRadius:'10px',flexWrap:'wrap'}}>
          <span style={{fontSize:'13px',color:'#6b5f7a'}}>Найдено заданий: <strong style={{color:'#e7e2f0'}}>{filtered.length}</strong></span>
          <span style={{fontSize:'13px',color:'#6b5f7a'}}>Общая сумма: <strong style={{color:'#8b5cf6'}}>{fmt(totalAmount)} ₽</strong></span>
          <span style={{fontSize:'13px',color:'#6b5f7a'}}>Штрафы: <strong style={{color:'#ef4444'}}>{fmt(totalFine)} ₽</strong></span>
          <span style={{fontSize:'13px',color:'#6b5f7a'}}>Итог: <strong style={{color:'#22c55e'}}>{fmt(totalNet)} ₽</strong></span>
          <span style={{fontSize:'12px',color:'#6b5f7a',marginLeft:'auto'}}>Макс. диапазон: 7 дней</span>
        </div>
      )}
      {error && <div style={{padding:'12px',background:'rgba(239,68,68,0.1)',border:'1px solid #ef4444',borderRadius:'8px',color:'#ef4444',marginBottom:'16px',fontSize:'13px'}}>{error}</div>}
      {/* Table */}
      <div style={{background:'#1e1530',border:'1px solid #2d1f3d',borderRadius:'12px',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
          <thead>
            <tr style={{borderBottom:'1px solid #2d1f3d',background:'#1a1125'}}>
              {['ID','Дата открытия','Дата закрытия','Офис выезда','Маршрут','Водитель + ТС','Перевозчик','Коробки','Сумма по заданию','Штраф','Итого'].map(h=>(
                <th key={h} style={{padding:'12px 14px',textAlign:'left',color:'#6b5f7a',fontWeight:500,whiteSpace:'nowrap'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={11} style={{padding:'60px',textAlign:'center',color:'#6b5f7a'}}>Загрузка данных из WB API...</td></tr>
            ) : filtered.length===0 ? (
              <tr><td colSpan={11} style={{padding:'60px',textAlign:'center',color:'#6b5f7a'}}>Нет данных за выбранный период</td></tr>
            ) : filtered.map(w=>(
              <tr key={w.id} style={{borderBottom:'1px solid #1a1125',transition:'background 0.15s',cursor:'pointer'}}
                onMouseEnter={(e:any)=>e.currentTarget.style.background='rgba(139,92,246,0.05)'}
                onMouseLeave={(e:any)=>e.currentTarget.style.background='transparent'}>
                <td style={{padding:'12px 14px'}}>
                  <span style={{color:'#8b5cf6',fontWeight:600}}>{w.id}</span>
                </td>
                <td style={{padding:'12px 14px',color:'#9d9dab',fontSize:'12px',whiteSpace:'nowrap'}}>{fmtDate(w.opened_at)}</td>
                <td style={{padding:'12px 14px',color:'#9d9dab',fontSize:'12px',whiteSpace:'nowrap'}}>{fmtDate(w.closed_at)}</td>
                <td style={{padding:'12px 14px'}}>
                  <div style={{color:'#e7e2f0',fontSize:'12px'}}>{w.office_id}</div>
                  <div style={{color:'#6b5f7a',fontSize:'11px'}}>{w.office_name}</div>
                </td>
                <td style={{padding:'12px 14px',color:'#9d9dab',fontSize:'12px'}}>—</td>
                <td style={{padding:'12px 14px',color:'#9d9dab',fontSize:'12px'}}>—</td>
                <td style={{padding:'12px 14px'}}>
                  <div style={{color:'#e7e2f0',fontSize:'12px'}}>{w.org_name}</div>
                </td>
                <td style={{padding:'12px 14px',color:'#9d9dab',fontSize:'12px'}}>—</td>
                <td style={{padding:'12px 14px',color:'#8b5cf6',fontWeight:600,whiteSpace:'nowrap'}}>{w.amount > 0 ? fmt(w.amount)+' ₽' : '—'}</td>
                <td style={{padding:'12px 14px',whiteSpace:'nowrap'}}>
                  {w.fine < 0 ? <span style={{color:'#ef4444',fontWeight:600}}>{fmt(w.fine)} ₽</span> : <span style={{color:'#6b5f7a'}}>—</span>}
                </td>
                <td style={{padding:'12px 14px',fontWeight:700,whiteSpace:'nowrap'}}>
                  <span style={{color: w.total>=0?'#22c55e':'#ef4444'}}>{fmt(w.total)} ₽</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length>0 && (
          <div style={{padding:'12px 16px',borderTop:'1px solid #2d1f3d',color:'#6b5f7a',fontSize:'12px',display:'flex',justifyContent:'space-between'}}>
            <span>Всего: {filtered.length} заданий</span>
            <span>Данные из WB Finance API · {dateFrom} — {dateTo}</span>
          </div>
        )}
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/app/(dashboard)/routes/page.tsx', pageCode, 'utf8');
console.log('done');
