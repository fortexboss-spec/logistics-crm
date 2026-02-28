const fs = require('fs');
const code = `'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { RefreshCw, ChevronDown, ChevronRight, Calendar } from 'lucide-react';
interface Operation {
  operation_id: string;
  created_at: string;
  sum: { value: string };
  sum_fine: { value: string };
  operation_type: string;
  description: string;
  name: string;
  ext_id: string;
}
interface DayGroup {
  date: string;
  operations: Operation[];
  totalIncome: number;
  totalFine: number;
  totalNet: number;
  tasks: number;
}
export default function WBMonitoringPage() {
  const [data, setData] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [dateFrom, setDateFrom] = useState('2026-02-13');
  const [dateTo, setDateTo] = useState('2026-02-28');
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/wb-finance?dateFrom=' + dateFrom + 'T00:00:00Z&dateTo=' + dateTo + 'T23:59:59Z');
      const json = await res.json();
      if (json.data) setData(json.data);
      else setError(JSON.stringify(json));
    } catch (e) { setError(String(e)); }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);
  const toggleDay = (date: string) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };
  // Group by day
  const dayMap = new Map<string, DayGroup>();
  data.forEach(op => {
    const date = op.created_at.split('T')[0];
    if (!dayMap.has(date)) dayMap.set(date, { date, operations: [], totalIncome: 0, totalFine: 0, totalNet: 0, tasks: 0 });
    const day = dayMap.get(date)!;
    day.operations.push(op);
    const val = parseFloat(op.sum?.value || '0');
    const fine = parseFloat(op.sum_fine?.value || '0');
    if (op.operation_type === 'OPERATION_TYPE_CREDIT') { day.totalIncome += val; day.tasks++; }
    if (op.operation_type === 'OPERATION_TYPE_PENALTY') day.totalFine += fine;
  });
  const days = Array.from(dayMap.values()).sort((a,b) => a.date > b.date ? -1 : 1);
  days.forEach(d => { d.totalNet = d.totalIncome + d.totalFine; });
  const totalBalance = 7434632.16;
  const totalFines = -1081743.02;
  const totalAvail = 5759141.48;
  const fmt = (v: number) => v.toLocaleString('ru-RU', {minimumFractionDigits:2,maximumFractionDigits:2});
  return (
    <div>
      <Header title="WB Мониторинг" actions={
        <button onClick={fetchData} style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 14px',background:'#3b1f5e',border:'1px solid #8b5cf6',borderRadius:'8px',color:'#e7e2f0',fontSize:'13px',cursor:'pointer'}}>
          <RefreshCw size={14} /> {loading ? 'Загрузка...' : 'Обновить'}
        </button>
      }/>
      {/* Balance Banner */}
      <div style={{background:'#1e1530',border:'1px solid #2d1f3d',borderRadius:'12px',padding:'0',marginBottom:'20px',overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid #2d1f3d',display:'flex',alignItems:'center',gap:'16px',flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <Calendar size={14} style={{color:'#6b5f7a'}}/>
            <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}
              style={{background:'#2d1f3d',border:'1px solid #3b2a52',borderRadius:'6px',padding:'4px 8px',color:'#e7e2f0',fontSize:'13px'}}/>
            <span style={{color:'#6b5f7a'}}>—</span>
            <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)}
              style={{background:'#2d1f3d',border:'1px solid #3b2a52',borderRadius:'6px',padding:'4px 8px',color:'#e7e2f0',fontSize:'13px'}}/>
            <button onClick={fetchData} style={{padding:'4px 12px',background:'#3b1f5e',border:'1px solid #8b5cf6',borderRadius:'6px',color:'#e7e2f0',fontSize:'12px',cursor:'pointer'}}>Применить</button>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',borderBottom:'1px solid #2d1f3d'}}>
          <div style={{padding:'16px 24px',borderRight:'1px solid #2d1f3d'}}>
            <div style={{fontSize:'11px',color:'#6b5f7a',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.5px'}}>Текущий баланс</div>
            <div style={{fontSize:'22px',fontWeight:700,color:'#e7e2f0'}}>{fmt(totalBalance)} ₽</div>
          </div>
          <div style={{padding:'16px 24px',borderRight:'1px solid #2d1f3d'}}>
            <div style={{fontSize:'11px',color:'#6b5f7a',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.5px'}}>Сумма штрафов</div>
            <div style={{fontSize:'22px',fontWeight:700,color:'#ef4444'}}>{fmt(totalFines)} ₽</div>
          </div>
          <div style={{padding:'16px 24px'}}>
            <div style={{fontSize:'11px',color:'#6b5f7a',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.5px'}}>Доступно к выводу</div>
            <div style={{fontSize:'22px',fontWeight:700,color:'#22c55e'}}>{fmt(totalAvail)} ₽</div>
          </div>
        </div>
        {/* Table Header */}
        <div style={{display:'grid',gridTemplateColumns:'40px 160px 120px 1fr 1fr 1fr 140px',padding:'10px 16px',borderBottom:'1px solid #2d1f3d'}}>
          {['','Дата','Заданий','Начисления (с НДС)','Штрафы','Итог за день','Заявка на оплату'].map((h,i)=>(
            <div key={i} style={{fontSize:'12px',color:'#6b5f7a',fontWeight:500}}>{h}</div>
          ))}
        </div>
        {/* Days */}
        {loading ? (
          <div style={{padding:'40px',textAlign:'center',color:'#6b5f7a'}}>Загрузка данных из WB API...</div>
        ) : error ? (
          <div style={{padding:'20px',color:'#ef4444',fontSize:'13px'}}>{error}</div>
        ) : days.map(day => {
          const isExpanded = expandedDays.has(day.date);
          const dateLabel = new Date(day.date).toLocaleDateString('ru-RU', {day:'2-digit',month:'2-digit',year:'numeric'});
          const penalties = day.operations.filter(o=>o.operation_type==='OPERATION_TYPE_PENALTY');
          return (
            <div key={day.date} style={{borderBottom:'1px solid #1a1125'}}>
              {/* Day Row */}
              <div onClick={()=>toggleDay(day.date)}
                style={{display:'grid',gridTemplateColumns:'40px 160px 120px 1fr 1fr 1fr 140px',padding:'14px 16px',cursor:'pointer',transition:'background 0.15s'}}
                onMouseEnter={(e:any)=>e.currentTarget.style.background='rgba(139,92,246,0.05)'}
                onMouseLeave={(e:any)=>e.currentTarget.style.background='transparent'}>
                <div style={{display:'flex',alignItems:'center',color:'#6b5f7a'}}>
                  {isExpanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                </div>
                <div style={{fontSize:'14px',color:'#e7e2f0',fontWeight:500}}>{dateLabel}</div>
                <div style={{color:'#a855f7',fontWeight:600}}>{day.tasks > 0 ? day.tasks + ' шт' : '—'}</div>
                <div style={{color:'#e7e2f0'}}>{day.totalIncome > 0 ? fmt(day.totalIncome) + ' ₽' : '—'}</div>
                <div style={{color:'#ef4444'}}>{day.totalFine < 0 ? fmt(day.totalFine) + ' ₽' : '—'}</div>
                <div style={{color: day.totalNet >= 0 ? '#22c55e' : '#ef4444',fontWeight:600}}>{day.totalNet !== 0 ? fmt(day.totalNet) + ' ₽' : '—'}</div>
                <div style={{color:'#6b5f7a'}}>—</div>
              </div>
              {/* Expanded Operations */}
              {isExpanded && penalties.map(op => (
                <div key={op.operation_id}
                  style={{display:'grid',gridTemplateColumns:'40px 160px 120px 1fr 1fr 1fr 140px',padding:'10px 16px',background:'rgba(239,68,68,0.03)',borderTop:'1px solid #1a1125'}}>
                  <div/>
                  <div>
                    <div style={{fontSize:'12px',color:'#9d9dab'}}>{new Date(op.created_at).toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'})}</div>
                    <div style={{marginTop:'2px'}}><span style={{fontSize:'10px',background:'rgba(239,68,68,0.2)',color:'#ef4444',padding:'1px 6px',borderRadius:'4px',fontWeight:600}}>ШТРАФЫ</span></div>
                  </div>
                  <div style={{color:'#a855f7',fontSize:'12px'}}>{op.ext_id}</div>
                  <div style={{fontSize:'12px',color:'#9d9dab'}}>{op.name}</div>
                  <div>
                    <div style={{color:'#ef4444',fontSize:'13px'}}>{fmt(parseFloat(op.sum_fine?.value||'0'))} ₽</div>
                    <div style={{fontSize:'11px',color:'#6b5f7a'}}>{op.description}</div>
                  </div>
                  <div style={{color:'#ef4444',fontSize:'13px'}}>{fmt(parseFloat(op.sum?.value||'0'))} ₽</div>
                  <div style={{color:'#6b5f7a',fontSize:'12px'}}>—</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/app/(dashboard)/wb-monitoring/page.tsx', code, 'utf8');
console.log('done');
