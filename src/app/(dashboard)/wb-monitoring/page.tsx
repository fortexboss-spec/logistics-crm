'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
const tabs = ['Удержания', 'Остатки ПМ', 'Отгрузки', 'Браки/дефекты'];
interface Retention {
  id: string;
  waybillId: string;
  openDate: string;
  office: string;
  tarCount: number;
  timer: string;
  amount: number;
}
const mockRetentions: Retention[] = [
  { id: '1', waybillId: '26106597', openDate: '23.02.2026, 00:35', office: 'Ярославль Громова', tarCount: 2, timer: '20ч 32м 14с', amount: 39926 },
  { id: '2', waybillId: '26145470', openDate: '24.02.2026, 13:55', office: 'Ярославль Громова', tarCount: 1, timer: '56ч 31м 33с', amount: 650 },
  { id: '3', waybillId: '26119046', openDate: '23.02.2026, 11:35', office: 'Ярославль Громова', tarCount: 10, timer: '70ч 25м 35с', amount: 27645 },
  { id: '4', waybillId: '26174072', openDate: '25.02.2026, 17:59', office: 'Ярославль Громова', tarCount: 1, timer: '93ч 43м 0с', amount: 832 },
  { id: '5', waybillId: '26164344', openDate: '25.02.2026, 08:35', office: 'Ярославль Громова', tarCount: 1, timer: '101ч 32м 35с', amount: 5928 },
];
export default function WBMonitoringPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [retentions, setRetentions] = useState<Retention[]>(mockRetentions);
  const [loading, setLoading] = useState(false);
  const totalSheets = retentions.length;
  const totalTar = retentions.reduce((sum, r) => sum + r.tarCount, 0);
  const totalAmount = retentions.reduce((sum, r) => sum + r.amount, 0);
  const fetchFromWB = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/wb/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: 'waysheets', method: 'POST', data: { status: 'open' } }),
      });
      const result = await res.json();
      if (result.data && Array.isArray(result.data)) {
        console.log('WB API response:', result.data);
      }
    } catch (e) {
      console.log('WB API not available, using mock data');
    }
    setLoading(false);
  };
  return (
    <div>
      <Header title="WB Мониторинг" subtitle="Удержания, остатки ПМ, отгрузки и браки/дефекты" />
      <div style={{display:'flex',backgroundColor:'#1a2235',borderRadius:'12px',border:'1px solid #2a3548',marginBottom:'20px',overflow:'hidden'}}>
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            style={{flex:1,padding:'12px',textAlign:'center',fontSize:'14px',border:'none',cursor:'pointer',
              backgroundColor: activeTab === i ? '#0f1729' : 'transparent',
              color: activeTab === i ? '#fff' : '#94a3b8',
              borderBottom: activeTab === i ? '2px solid #8b5cf6' : '2px solid transparent',
              transition:'all 0.2s'
            }}
          >{tab}</button>
        ))}
      </div>
      {activeTab === 0 && (
        <>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px',marginBottom:'20px'}}>
            <div style={{backgroundColor:'#1a2235',borderRadius:'12px',border:'1px solid #2a3548',padding:'16px'}}>
              <div style={{fontSize:'13px',color:'#94a3b8'}}>Путевых листов</div>
              <div style={{fontSize:'24px',fontWeight:'bold',color:'#f1f5f9',marginTop:'4px'}}>{totalSheets}</div>
            </div>
            <div style={{backgroundColor:'#1a2235',borderRadius:'12px',border:'1px solid #2a3548',padding:'16px'}}>
              <div style={{fontSize:'13px',color:'#94a3b8'}}>Всего тар</div>
              <div style={{fontSize:'24px',fontWeight:'bold',color:'#f1f5f9',marginTop:'4px'}}>{totalTar}</div>
            </div>
            <div style={{backgroundColor:'#1a2235',borderRadius:'12px',border:'1px solid #2a3548',padding:'16px'}}>
              <div style={{fontSize:'13px',color:'#94a3b8'}}>Общая сумма</div>
              <div style={{fontSize:'24px',fontWeight:'bold',color:'#f1f5f9',marginTop:'4px'}}>{totalAmount.toLocaleString()} &#8381;</div>
            </div>
          </div>
          <div style={{backgroundColor:'#1a2235',borderRadius:'12px',border:'1px solid #2a3548',overflow:'hidden'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
              <thead>
                <tr style={{borderBottom:'1px solid #2a3548'}}>
                  {['Путевой лист','Дата открытия','Офис','Тар','Таймер','Сумма'].map(h => (
                    <th key={h} style={{padding:'12px 16px',textAlign:'left',color:'#94a3b8',fontWeight:500}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {retentions.map(r => (
                  <tr key={r.id} style={{borderBottom:'1px solid #2a3548'}}>
                    <td style={{padding:'10px 16px',color:'#8b5cf6',fontWeight:500}}>{r.waybillId}</td>
                    <td style={{padding:'10px 16px',color:'#e2e8f0'}}>{r.openDate}</td>
                    <td style={{padding:'10px 16px',color:'#e2e8f0'}}>{r.office}</td>
                    <td style={{padding:'10px 16px'}}><span className="badge-purple">{r.tarCount} шт.</span></td>
                    <td style={{padding:'10px 16px',color:'#94a3b8'}}>{r.timer}</td>
                    <td style={{padding:'10px 16px',color:'#f1f5f9',fontWeight:500,textAlign:'right'}}>{r.amount.toLocaleString()} &#8381;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {activeTab === 1 && (
        <div style={{backgroundColor:'#1a2235',borderRadius:'12px',border:'1px solid #2a3548',padding:'40px',textAlign:'center'}}>
          <p style={{color:'#94a3b8',fontSize:'16px'}}>Остатки ПМ — данные загружаются из WB API</p>
          <button className="btn-purple" style={{marginTop:'16px'}} onClick={fetchFromWB}>{loading ? 'Загрузка...' : 'Загрузить из WB'}</button>
        </div>
      )}
      {activeTab === 2 && (
        <div style={{backgroundColor:'#1a2235',borderRadius:'12px',border:'1px solid #2a3548',padding:'40px',textAlign:'center'}}>
          <p style={{color:'#94a3b8',fontSize:'16px'}}>Отгрузки — данные загружаются из WB API</p>
          <button className="btn-purple" style={{marginTop:'16px'}} onClick={fetchFromWB}>{loading ? 'Загрузка...' : 'Загрузить из WB'}</button>
        </div>
      )}
      {activeTab === 3 && (
        <div style={{backgroundColor:'#1a2235',borderRadius:'12px',border:'1px solid #2a3548',padding:'40px',textAlign:'center'}}>
          <p style={{color:'#94a3b8',fontSize:'16px'}}>Браки и дефекты — данные загружаются из WB API</p>
          <button className="btn-purple" style={{marginTop:'16px'}} onClick={fetchFromWB}>{loading ? 'Загрузка...' : 'Загрузить из WB'}</button>
        </div>
      )}
    </div>
  );
}
