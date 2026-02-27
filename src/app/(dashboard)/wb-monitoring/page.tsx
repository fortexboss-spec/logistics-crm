'use client';
import { useState } from 'react';
import Header from '@/components/Header';
const tabs=['Удержания','Остатки ПМ','Отгрузки','Браки/дефекты'];
interface Ret { id:string;wId:string;date:string;office:string;tar:number;timer:string;amount:number; }
const mockR: Ret[] = [
  {id:'1',wId:'26106597',date:'23.02.2026, 00:35',office:'Ярославль Громова',tar:2,timer:'20ч 32м 14с',amount:39926},
  {id:'2',wId:'26145470',date:'24.02.2026, 13:55',office:'Ярославль Громова',tar:1,timer:'56ч 31м 33с',amount:650},
  {id:'3',wId:'26119046',date:'23.02.2026, 11:35',office:'Ярославль Громова',tar:10,timer:'70ч 25м 35с',amount:27645},
  {id:'4',wId:'26174072',date:'25.02.2026, 17:59',office:'Ярославль Громова',tar:1,timer:'93ч 43м 0с',amount:832},
  {id:'5',wId:'26164344',date:'25.02.2026, 08:35',office:'Ярославль Громова',tar:1,timer:'101ч 32м 35с',amount:5928},
];
export default function WBMonitoringPage() {
  const [tab,setTab]=useState(0);const [data]=useState<Ret[]>(mockR);const [loading,setLoading]=useState(false);
  const total=data.length;const totalTar=data.reduce((s,r)=>s+r.tar,0);const totalAmt=data.reduce((s,r)=>s+r.amount,0);
  const fetchWB=async()=>{setLoading(true);try{await fetch('/api/wb/proxy',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({endpoint:'waysheets',method:'POST',data:{status:'open'}})});}catch(e){}setLoading(false);};
  return (<div>
    <Header title="WB Мониторинг"/>
    <p style={{fontSize:'14px',color:'#9d9dab',marginBottom:'16px'}}>Удержания, остатки ПМ, отгрузки и браки/дефекты</p>
    <div style={{display:'flex',borderRadius:'8px',border:'1px solid #464652',marginBottom:'20px',overflow:'hidden'}}>
      {tabs.map((t,i)=>(<button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:'12px',textAlign:'center',fontSize:'14px',border:'none',cursor:'pointer',backgroundColor:tab===i?'#18181b':'transparent',color:tab===i?'#e7e2f0':'#9d9dab',borderBottom:tab===i?'2px solid #ba85ff':'2px solid transparent',transition:'all 0.2s'}}>{t}</button>))}
    </div>
    {tab===0&&(<>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px',marginBottom:'20px'}}>
        <div style={{borderRadius:'8px',border:'1px solid #464652',padding:'16px'}}><div style={{fontSize:'13px',color:'#9d9dab'}}>Путевых листов</div><div style={{fontSize:'24px',fontWeight:'bold',color:'#e7e2f0',marginTop:'4px'}}>{total}</div></div>
        <div style={{borderRadius:'8px',border:'1px solid #464652',padding:'16px'}}><div style={{fontSize:'13px',color:'#9d9dab'}}>Всего тар</div><div style={{fontSize:'24px',fontWeight:'bold',color:'#e7e2f0',marginTop:'4px'}}>{totalTar}</div></div>
        <div style={{borderRadius:'8px',border:'1px solid #464652',padding:'16px'}}><div style={{fontSize:'13px',color:'#9d9dab'}}>Общая сумма</div><div style={{fontSize:'24px',fontWeight:'bold',color:'#e7e2f0',marginTop:'4px'}}>{totalAmt.toLocaleString()} &#8381;</div></div>
      </div>
      <div style={{borderRadius:'8px',border:'1px solid #464652',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'14px'}}>
          <thead><tr style={{borderBottom:'1px solid #464652'}}>{['Путевой лист','Дата открытия','Офис','Тар','Таймер','Сумма'].map(h=>(<th key={h} style={{padding:'12px 16px',textAlign:'left',color:'#9d9dab',fontWeight:500}}>{h}</th>))}</tr></thead>
          <tbody>{data.map(r=>(<tr key={r.id} style={{borderBottom:'1px solid #464652'}}>
            <td style={{padding:'14px 16px',color:'#ba85ff',fontWeight:500}}>{r.wId}</td>
            <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{r.date}</td>
            <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{r.office}</td>
            <td style={{padding:'14px 16px'}}><span className="badge-active">{r.tar} шт.</span></td>
            <td style={{padding:'14px 16px',color:'#9d9dab'}}>{r.timer}</td>
            <td style={{padding:'14px 16px',color:'#e7e2f0',fontWeight:500,textAlign:'right'}}>{r.amount.toLocaleString()} &#8381;</td>
          </tr>))}</tbody></table></div>
    </>)}
    {tab>0&&(<div style={{borderRadius:'8px',border:'1px solid #464652',padding:'40px',textAlign:'center'}}><p style={{color:'#9d9dab',fontSize:'16px'}}>{tabs[tab]} — данные из WB API</p><button className="btn-primary" style={{marginTop:'16px'}} onClick={fetchWB}>{loading?'Загрузка...':'Загрузить из WB'}</button></div>)}
  </div>);
}
