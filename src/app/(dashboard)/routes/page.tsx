'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { RefreshCw, Search, Calendar, Download, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
interface Waysheet {
  id: string;
  opened_at: string;
  closed_at: string;
  office_id: number;
  office_name: string;
  distance_km: number;
  route_name: string;
  car_number: string;
  driver_name: string;
  org_id: number;
  org_name: string;
  boxes_delivered: number;
  boxes_total: number;
  amount: number;
  fine: number;
  total: number;
}
const PAGE_SIZE = 15;
export default function RoutesPage() {
  const [data, setData] = useState<Waysheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('2026-02-22');
  const [dateTo, setDateTo] = useState('2026-02-28');
  const [page, setPage] = useState(1);
  const fetchData = async () => {
    setLoading(true); setError(''); setPage(1);
    try {
      const res = await fetch('/api/wb-finance?dateFrom=' + dateFrom + 'T00:00:00Z&dateTo=' + dateTo + 'T23:59:59Z');
      const json = await res.json();
      if (!json.data) { setError(JSON.stringify(json)); setLoading(false); return; }
      const wsMap = new Map<string, Waysheet>();
      json.data.forEach((op: any) => {
        const id = op.ext_id;
        if (!id) return;
        if (!wsMap.has(id)) {
          wsMap.set(id, {
            id, opened_at: op.created_at, closed_at: op.created_at,
            office_id: 338827, office_name: 'Ярославль Громова',
            distance_km: 0, route_name: '—', car_number: '—', driver_name: '—',
            org_id: 344813, org_name: 'ООО "ФРЕШКО..."',
            boxes_delivered: 0, boxes_total: 0, amount: 0, fine: 0, total: 0,
          });
        }
        const ws = wsMap.get(id)!;
        const val = parseFloat(op.sum?.value || '0');
        if (op.operation_type === 'OPERATION_TYPE_WAYSHEET') ws.amount += val;
        if (op.operation_type === 'OPERATION_TYPE_PENALTY') ws.fine += val;
        ws.total = ws.amount + ws.fine;
      });
      setData(Array.from(wsMap.values()).sort((a,b) => b.opened_at > a.opened_at ? 1 : -1));
    } catch(e) { setError(String(e)); }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);
  const filtered = data.filter(w => w.id.includes(search) || w.driver_name.toLowerCase().includes(search.toLowerCase()));
  const totalAmount = filtered.reduce((s,w)=>s+w.amount,0);
  const totalFine = filtered.reduce((s,w)=>s+w.fine,0);
  const totalNet = filtered.reduce((s,w)=>s+w.total,0);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const fmt = (v: number) => v.toLocaleString('ru-RU', {minimumFractionDigits:2,maximumFractionDigits:2});
  const fmtDate = (d: string) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'}) + '\\n' + dt.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
  };
  const pageNums = () => {
    const pages = [];
    for(let i=1;i<=Math.min(totalPages,8);i++) pages.push(i);
    return pages;
  };
  return (
    <div style={{background:'#f8f9fc',minHeight:'100vh',padding:'0'}}>
      <div style={{padding:'24px 32px'}}>
        <h1 style={{fontSize:'24px',fontWeight:700,color:'#1a1a2e',marginBottom:'4px'}}>Реестр заданий</h1>
        {/* Tabs */}
        <div style={{display:'flex',gap:'0',marginBottom:'24px',borderBottom:'2px solid #e8e8f0'}}>
          {['Последняя миля','Межсклад'].map((t,i)=>(
            <button key={t} style={{padding:'10px 20px',border:'none',background:'transparent',fontSize:'14px',cursor:'pointer',
              color: i===0?'#7c3aed':'#6b7280',
              borderBottom: i===0?'2px solid #7c3aed':'2px solid transparent',
              marginBottom:'-2px',fontWeight: i===0?600:400}}>
              {t}
            </button>
          ))}
        </div>
        {/* Filters */}
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'8px',flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',background:'white',border:'1px solid #e0e0f0',borderRadius:'8px',padding:'8px 12px'}}>
            <Calendar size={14} style={{color:'#7c3aed'}}/>
            <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}
              style={{border:'none',outline:'none',fontSize:'13px',color:'#1a1a2e',background:'transparent'}}/>
            <span style={{color:'#9ca3af'}}>–</span>
            <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)}
              style={{border:'none',outline:'none',fontSize:'13px',color:'#1a1a2e',background:'transparent'}}/>
            <button onClick={fetchData} style={{background:'none',border:'none',cursor:'pointer',color:'#9ca3af',fontSize:'16px'}}>×</button>
          </div>
          <div style={{background:'white',border:'1px solid #e0e0f0',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',color:'#6b7280',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}}>
            Офис выезда ▾
          </div>
          <div style={{background:'white',border:'1px solid #e0e0f0',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',color:'#6b7280',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}}>
            Маршрут ▾
          </div>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'8px'}}>
            <button style={{background:'none',border:'none',fontSize:'13px',color:'#7c3aed',cursor:'pointer',display:'flex',alignItems:'center',gap:'4px'}}>
              <Filter size={14}/> Все фильтры ▾
            </button>
            <button onClick={fetchData} style={{background:'#7c3aed',color:'white',border:'none',borderRadius:'8px',padding:'8px 20px',fontSize:'13px',fontWeight:600,cursor:'pointer'}}>
              {loading?'Загрузка...':'Применить'}
            </button>
          </div>
        </div>
        <div style={{fontSize:'12px',color:'#9ca3af',marginBottom:'20px'}}>Макс. допустимый диапазон дат – 7 дней</div>
        {error && <div style={{padding:'12px',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'8px',color:'#ef4444',marginBottom:'16px',fontSize:'13px'}}>{error}</div>}
        {/* Summary */}
        {!loading && data.length>0 && (
          <div style={{display:'flex',alignItems:'flex-start',gap:'80px',marginBottom:'16px',padding:'16px 0',borderTop:'1px solid #e8e8f0',borderBottom:'1px solid #e8e8f0'}}>
            <div>
              <div style={{fontSize:'12px',color:'#9ca3af',marginBottom:'2px'}}>Найдено заданий</div>
              <div style={{fontSize:'22px',fontWeight:700,color:'#1a1a2e'}}>{filtered.length}</div>
            </div>
            <div>
              <div style={{fontSize:'12px',color:'#9ca3af',marginBottom:'2px'}}>Общая сумма</div>
              <div style={{fontSize:'22px',fontWeight:700,color:'#1a1a2e'}}>{fmt(totalAmount)} ₽</div>
            </div>
            <div>
              <div style={{fontSize:'12px',color:'#9ca3af',marginBottom:'2px'}}>Сумма штрафов</div>
              <div style={{fontSize:'22px',fontWeight:700,color:'#1a1a2e'}}>{fmt(totalFine)} ₽</div>
            </div>
            <div>
              <div style={{fontSize:'12px',color:'#9ca3af',marginBottom:'2px'}}>Итог</div>
              <div style={{fontSize:'22px',fontWeight:700,color:'#1a1a2e'}}>{fmt(totalNet)} ₽</div>
            </div>
            <div style={{marginLeft:'auto',display:'flex',alignItems:'center'}}>
              <button style={{display:'flex',alignItems:'center',gap:'6px',background:'none',border:'none',color:'#7c3aed',fontSize:'13px',cursor:'pointer',fontWeight:500}}>
                <Download size={14}/> Скачать .xlsx
              </button>
            </div>
          </div>
        )}
        {/* Table */}
        <div style={{background:'white',borderRadius:'12px',overflow:'hidden',border:'1px solid #e8e8f0'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
            <thead>
              <tr style={{borderBottom:'1px solid #f0f0f8'}}>
                {['ID','Дата открытия','Дата закрытия','Офис выезда','Маршрут','Водитель + ТС','Перевозчик','Коробки','Сумма по заданию','Сумма штрафа','Итого'].map(h=>(
                  <th key={h} style={{padding:'12px 16px',textAlign:'left',color:'#9ca3af',fontWeight:500,fontSize:'12px',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={11} style={{padding:'60px',textAlign:'center',color:'#9ca3af'}}>Загрузка данных из WB API...</td></tr>
              ) : paged.length===0 ? (
                <tr><td colSpan={11} style={{padding:'60px',textAlign:'center',color:'#9ca3af'}}>Нет данных за выбранный период</td></tr>
              ) : paged.map((w,i)=>(
                <tr key={w.id} style={{borderBottom:'1px solid #f8f8fc',transition:'background 0.1s',cursor:'pointer'}}
                  onMouseEnter={(e:any)=>e.currentTarget.style.background='#fafafa'}
                  onMouseLeave={(e:any)=>e.currentTarget.style.background='transparent'}>
                  <td style={{padding:'14px 16px'}}>
                    <span style={{color:'#7c3aed',fontWeight:500,cursor:'pointer'}}>{w.id}</span>
                  </td>
                  <td style={{padding:'14px 16px',color:'#374151',fontSize:'12px',whiteSpace:'pre-line'}}>{fmtDate(w.opened_at)}</td>
                  <td style={{padding:'14px 16px',color:'#374151',fontSize:'12px',whiteSpace:'pre-line'}}>{fmtDate(w.closed_at)}</td>
                  <td style={{padding:'14px 16px'}}>
                    <div style={{color:'#9ca3af',fontSize:'11px'}}>{w.office_id}</div>
                    <div style={{color:'#374151',fontSize:'12px'}}>{w.office_name}</div>
                  </td>
                  <td style={{padding:'14px 16px'}}>
                    <div style={{color:'#9ca3af',fontSize:'11px'}}>{w.distance_km>0?w.distance_km+' км':'—'}</div>
                    <div style={{color:'#374151',fontSize:'12px'}}>{w.route_name}</div>
                  </td>
                  <td style={{padding:'14px 16px'}}>
                    <div style={{color:'#374151',fontSize:'12px'}}>{w.car_number}</div>
                    <div style={{color:'#374151',fontSize:'12px'}}>{w.driver_name}</div>
                  </td>
                  <td style={{padding:'14px 16px'}}>
                    <div style={{color:'#9ca3af',fontSize:'11px'}}>{w.org_id}</div>
                    <div style={{color:'#374151',fontSize:'12px'}}>{w.org_name}</div>
                  </td>
                  <td style={{padding:'14px 16px'}}>
                    <div style={{color:'#9ca3af',fontSize:'11px'}}>Доставлено / Всего</div>
                    <div style={{color:'#374151',fontSize:'12px'}}>{w.boxes_delivered} / {w.boxes_total}</div>
                  </td>
                  <td style={{padding:'14px 16px',color:'#374151',fontWeight:500,whiteSpace:'nowrap'}}>{w.amount>0?fmt(w.amount)+' ₽':'—'}</td>
                  <td style={{padding:'14px 16px',whiteSpace:'nowrap'}}>
                    {w.fine<0 ? <span style={{color:'#ef4444',fontWeight:500}}>{fmt(w.fine)} ₽</span> : <span style={{color:'#9ca3af'}}>—</span>}
                  </td>
                  <td style={{padding:'14px 16px',fontWeight:600,whiteSpace:'nowrap',color: w.total>=0?'#374151':'#ef4444'}}>{fmt(w.total)} ₽</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{padding:'16px',borderTop:'1px solid #f0f0f8',display:'flex',justifyContent:'center',alignItems:'center',gap:'4px'}}>
              <button onClick={()=>setPage(Math.max(1,page-1))} disabled={page===1}
                style={{width:'32px',height:'32px',borderRadius:'6px',border:'1px solid #e0e0f0',background:'white',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:page===1?'#d1d5db':'#374151'}}>
                <ChevronLeft size={14}/>
              </button>
              {pageNums().map(p=>(
                <button key={p} onClick={()=>setPage(p)}
                  style={{width:'32px',height:'32px',borderRadius:'6px',border:'1px solid',fontSize:'13px',cursor:'pointer',fontWeight: p===page?600:400,
                    borderColor: p===page?'#7c3aed':'#e0e0f0',
                    background: p===page?'#7c3aed':'white',
                    color: p===page?'white':'#374151'}}>
                  {p}
                </button>
              ))}
              {totalPages > 8 && <span style={{color:'#9ca3af'}}>...</span>}
              {totalPages > 8 && (
                <button onClick={()=>setPage(totalPages)}
                  style={{width:'32px',height:'32px',borderRadius:'6px',border:'1px solid #e0e0f0',background:'white',cursor:'pointer',fontSize:'13px',color:'#374151'}}>
                  {totalPages}
                </button>
              )}
              <button onClick={()=>setPage(Math.min(totalPages,page+1))} disabled={page===totalPages}
                style={{width:'32px',height:'32px',borderRadius:'6px',border:'1px solid #e0e0f0',background:'white',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:page===totalPages?'#d1d5db':'#374151'}}>
                <ChevronRight size={14}/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
