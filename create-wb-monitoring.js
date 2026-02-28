const fs = require('fs');
const code = `'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { RefreshCw, AlertTriangle, TrendingDown } from 'lucide-react';
const tabs=['Удержания','Остатки ПМ','Отгрузки','Браки/дефекты'];
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
export default function WBMonitoringPage() {
  const [tab,setTab]=useState(0);
  const [data,setData]=useState<Operation[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/wb-finance');
      const json = await res.json();
      if(json.data) setData(json.data);
      else setError(JSON.stringify(json));
    } catch(e) {
      setError(String(e));
    }
    setLoading(false);
  };
  useEffect(()=>{ fetchData(); },[]);
  const penalties = data.filter(d=>d.operation_type==='OPERATION_TYPE_PENALTY');
  const totalFines = penalties.reduce((s,d)=>s+Math.abs(parseFloat(d.sum?.value||'0')),0);
  const totalOps = data.length;
  return (
    <div>
      <Header title="WB Мониторинг" actions={
        <button onClick={fetchData} style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 12px',background:'#2d1f3d',border:'1px solid #3b2a52',borderRadius:'8px',color:'#e7e2f0',fontSize:'13px',cursor:'pointer'}}>
          <RefreshCw size={14} className={loading?'animate-spin':''}/> {loading?'Загрузка...':'Обновить'}
        </button>
      }/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px',marginBottom:'20px'}}>
        <div style={{borderRadius:'12px',border:'1px solid #2d1f3d',padding:'16px',background:'#1e1530'}}>
          <div style={{fontSize:'12px',color:'#6b5f7a',marginBottom:'4px'}}>Всего операций</div>
          <div style={{fontSize:'28px',fontWeight:700,color:'#e7e2f0'}}>{totalOps}</div>
        </div>
        <div style={{borderRadius:'12px',border:'1px solid #2d1f3d',padding:'16px',background:'#1e1530'}}>
          <div style={{fontSize:'12px',color:'#6b5f7a',marginBottom:'4px'}}>Удержаний/штрафов</div>
          <div style={{fontSize:'28px',fontWeight:700,color:'#ef4444'}}>{penalties.length}</div>
        </div>
        <div style={{borderRadius:'12px',border:'1px solid #2d1f3d',padding:'16px',background:'#1e1530'}}>
          <div style={{fontSize:'12px',color:'#6b5f7a',marginBottom:'4px'}}>Сумма штрафов</div>
          <div style={{fontSize:'28px',fontWeight:700,color:'#ef4444'}}>{totalFines.toLocaleString()} ₽</div>
        </div>
      </div>
      <div style={{display:'flex',borderRadius:'8px',border:'1px solid #2d1f3d',marginBottom:'20px',overflow:'hidden',background:'#1e1530'}}>
        {tabs.map((t,i)=>(<button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:'12px',textAlign:'center',fontSize:'13px',border:'none',cursor:'pointer',backgroundColor:tab===i?'#3b1f5e':'transparent',color:tab===i?'#e7e2f0':'#6b5f7a',borderBottom:tab===i?'2px solid #8b5cf6':'2px solid transparent',transition:'all 0.2s'}}>{t}</button>))}
      </div>
      {error && <div style={{padding:'12px',background:'rgba(239,68,68,0.1)',border:'1px solid #ef4444',borderRadius:'8px',color:'#ef4444',marginBottom:'16px',fontSize:'13px'}}>{error}</div>}
      {tab===0&&(
        <div style={{borderRadius:'12px',border:'1px solid #2d1f3d',overflow:'hidden',background:'#1e1530'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
            <thead>
              <tr style={{borderBottom:'1px solid #2d1f3d',background:'#1a1125'}}>
                {['Дата','Тип операции','Описание','ID','Сумма'].map(h=>(<th key={h} style={{padding:'12px 16px',textAlign:'left',color:'#6b5f7a',fontWeight:500}}>{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{padding:'40px',textAlign:'center',color:'#6b5f7a'}}>Загрузка данных из WB...</td></tr>
              ) : penalties.length===0 ? (
                <tr><td colSpan={5} style={{padding:'40px',textAlign:'center',color:'#6b5f7a'}}>Нет данных</td></tr>
              ) : penalties.map((d,i)=>(
                <tr key={d.operation_id} style={{borderBottom:'1px solid #1a1125',transition:'background 0.15s'}}
                  onMouseEnter={(e:any)=>e.currentTarget.style.background='rgba(239,68,68,0.05)'}
                  onMouseLeave={(e:any)=>e.currentTarget.style.background='transparent'}>
                  <td style={{padding:'12px 16px',color:'#9d9dab',fontSize:'12px'}}>{new Date(d.created_at).toLocaleString('ru-RU')}</td>
                  <td style={{padding:'12px 16px'}}><span style={{background:'rgba(239,68,68,0.15)',color:'#ef4444',padding:'2px 8px',borderRadius:'12px',fontSize:'11px',fontWeight:600}}>{d.name}</span></td>
                  <td style={{padding:'12px 16px',color:'#e7e2f0'}}>{d.description}</td>
                  <td style={{padding:'12px 16px',color:'#8b5cf6',fontSize:'12px'}}>{d.ext_id}</td>
                  <td style={{padding:'12px 16px',textAlign:'right',color:'#ef4444',fontWeight:600}}>{parseFloat(d.sum?.value||'0').toLocaleString()} ₽</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab>0&&(
        <div style={{borderRadius:'12px',border:'1px solid #2d1f3d',padding:'40px',textAlign:'center',background:'#1e1530'}}>
          <p style={{color:'#6b5f7a',fontSize:'16px'}}>{tabs[tab]} — данные из WB API</p>
          <button onClick={fetchData} style={{marginTop:'16px',padding:'8px 20px',background:'#3b1f5e',border:'1px solid #8b5cf6',borderRadius:'8px',color:'#e7e2f0',cursor:'pointer',fontSize:'13px'}}>Загрузить из WB</button>
        </div>
      )}
    </div>
  );
}`;
fs.writeFileSync('src/app/(dashboard)/wb-monitoring/page.tsx', code, 'utf8');
console.log('done');
