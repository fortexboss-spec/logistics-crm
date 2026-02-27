'use client';
import Header from '@/components/Header';
import { RefreshCw, TrendingUp, TrendingDown, FileText, AlertTriangle, DollarSign, Package, Plus, UserPlus, Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
const waysheetsData = [{d:'14 фев.',v:200000},{d:'15 фев.',v:650000},{d:'16 фев.',v:500000},{d:'17 фев.',v:550000},{d:'18 фев.',v:480000},{d:'19 фев.',v:600000},{d:'20 фев.',v:650000},{d:'21 фев.',v:550000},{d:'22 фев.',v:700000},{d:'23 фев.',v:600000},{d:'24 фев.',v:650000},{d:'25 фев.',v:500000},{d:'26 фев.',v:200000},{d:'27 фев.',v:100000}];
const finesData = [{d:'14 фев.',v:60000},{d:'15 фев.',v:75000},{d:'16 фев.',v:70000},{d:'17 фев.',v:80000},{d:'18 фев.',v:65000},{d:'19 фев.',v:85000},{d:'20 фев.',v:75000},{d:'21 фев.',v:90000},{d:'22 фев.',v:85000},{d:'23 фев.',v:92000},{d:'24 фев.',v:88000},{d:'25 фев.',v:80000},{d:'26 фев.',v:90000},{d:'27 фев.',v:15000}];
const defectsData = [{d:'14 фев.',v:65},{d:'15 фев.',v:15},{d:'16 фев.',v:230},{d:'17 фев.',v:240},{d:'18 фев.',v:220},{d:'19 фев.',v:80},{d:'20 фев.',v:230},{d:'21 фев.',v:250},{d:'22 фев.',v:200},{d:'23 фев.',v:180},{d:'24 фев.',v:130},{d:'25 фев.',v:120},{d:'26 фев.',v:100}];
const incomeData = [{d:'14 фев.',v:600000},{d:'15 фев.',v:700000},{d:'16 фев.',v:500000},{d:'17 фев.',v:200000},{d:'18 фев.',v:650000},{d:'19 фев.',v:600000},{d:'20 фев.',v:550000},{d:'21 фев.',v:600000},{d:'22 фев.',v:500000},{d:'23 фев.',v:650000},{d:'24 фев.',v:600000},{d:'25 фев.',v:550000},{d:'26 фев.',v:500000},{d:'27 фев.',v:150000}];
const topProblematic = [{n:'Тимофеичев Иван Александрович',b:43,w:16,p:'268.8%'},{n:'Кравченко Александр Николаевич',b:43,w:20,p:'215%'},{n:'Шемякин Виталий Александрович',b:39,w:13,p:'300%'},{n:'Павлюченков Олег Евгеньевич',b:36,w:19,p:'189.5%'},{n:'Иванов Станислав Александрович',b:35,w:12,p:'291.7%'}];
const topIncome = [{n:'Олейник Илья Андреевич',w:9,inc:353498,f:14356},{n:'Аланго Дмитрий Евгеньевич',w:8,inc:317993,f:10324},{n:'Крылов Роман Дмитриевич',w:8,inc:311702,f:15416},{n:'Левин Артём Андреевич',w:8,inc:309531,f:20180},{n:'Малышев Данил Владимирович',w:6,inc:246686,f:37008}];
const notifications = [
  { id:1, text:'Водитель Тимофеичев: 43 брака за неделю', type:'error' },
  { id:2, text:'Штрафы выросли на 12% за последние 3 дня', type:'warning' },
  { id:3, text:'5 путевых листов ожидают подтверждения', type:'info' },
];
const kpiCards = [
  { title:'Доход за период', value:'7 200 000 ₽', change:'+8.2%', up:true, icon:DollarSign, color:'#22c55e', bg:'rgba(34,197,94,0.1)' },
  { title:'Путевых листов', value:'142', change:'+12 за неделю', up:true, icon:FileText, color:'#8b5cf6', bg:'rgba(139,92,246,0.1)' },
  { title:'Сумма штрафов', value:'1 095 000 ₽', change:'+5.1%', up:false, icon:AlertTriangle, color:'#ef4444', bg:'rgba(239,68,68,0.1)' },
  { title:'Браков', value:'1 730', change:'-3.2%', up:true, icon:Package, color:'#f97316', bg:'rgba(249,115,22,0.1)' },
];
const ChartCard = ({title, sub, data, color}: {title:string, sub:string, data:{d:string,v:number}[], color:string}) => (
  <div style={{border:'1px solid #2d1f3d',borderRadius:'12px',padding:'20px',backgroundColor:'#1e1530',transition:'border-color 0.2s'}}
    onMouseEnter={(e)=>e.currentTarget.style.borderColor='#4c2d7a'}
    onMouseLeave={(e)=>e.currentTarget.style.borderColor='#2d1f3d'}>
    <h3 style={{fontSize:'14px',fontWeight:600,color:'#e7e2f0',marginBottom:'2px'}}>{title}</h3>
    <p style={{fontSize:'12px',color:'#6b5f7a',marginBottom:'16px'}}>{sub}</p>
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#2d1f3d"/><XAxis dataKey="d" tick={{fontSize:10,fill:'#6b5f7a'}} /><YAxis tick={{fontSize:10,fill:'#6b5f7a'}} /><Tooltip contentStyle={{backgroundColor:'#1a1125',border:'1px solid #2d1f3d',borderRadius:'8px',color:'#e7e2f0'}} /><Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={{r:3,fill:color}} /></LineChart>
    </ResponsiveContainer>
  </div>
);
export default function DashboardPage() {
  const [period, setPeriod] = useState('14');
  const [showNotif, setShowNotif] = useState(false);
  return (
    <div>
      <Header title="Dashboard" actions={
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{position:'relative'}}>
            <button onClick={()=>setShowNotif(!showNotif)}
              style={{background:'#2d1f3d',border:'1px solid #3b2a52',borderRadius:'8px',padding:'6px 10px',color:'#e7e2f0',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'13px'}}>
              <Bell size={14} />
              <span style={{background:'#ef4444',borderRadius:'50%',width:'16px',height:'16px',fontSize:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{notifications.length}</span>
            </button>
            {showNotif && (
              <div style={{position:'absolute',right:0,top:'40px',width:'320px',background:'#1a1125',border:'1px solid #2d1f3d',borderRadius:'12px',padding:'12px',zIndex:100,boxShadow:'0 8px 32px rgba(0,0,0,0.4)'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#e7e2f0',marginBottom:'10px'}}>Уведомления</div>
                {notifications.map(n=>(
                  <div key={n.id} style={{padding:'8px 10px',borderRadius:'8px',marginBottom:'6px',backgroundColor: n.type==='error'?'rgba(239,68,68,0.1)':n.type==='warning'?'rgba(249,115,22,0.1)':'rgba(139,92,246,0.1)',borderLeft:`3px solid ${n.type==='error'?'#ef4444':n.type==='warning'?'#f97316':'#8b5cf6'}`}}>
                    <span style={{fontSize:'12px',color:'#e7e2f0'}}>{n.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="btn-outline" style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'13px'}}><RefreshCw size={14} /> Обновить</button>
        </div>
      } />
      {/* Quick Actions */}
      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'20px',flexWrap:'wrap'}}>
        <span style={{fontSize:'13px',color:'#6b5f7a',marginRight:'4px'}}>Быстрые действия:</span>
        {[
          {label:'+ Путевой лист', icon:FileText, color:'#8b5cf6'},
          {label:'+ Водитель', icon:UserPlus, color:'#22c55e'},
          {label:'+ Доставка', icon:Package, color:'#3b82f6'},
        ].map(a=>(
          <button key={a.label} style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 12px',background:'#1e1530',border:'1px solid #2d1f3d',borderRadius:'8px',color:'#e7e2f0',fontSize:'12px',cursor:'pointer',transition:'all 0.15s'}}
            onMouseEnter={(e)=>{e.currentTarget.style.borderColor=a.color;e.currentTarget.style.color=a.color;}}
            onMouseLeave={(e)=>{e.currentTarget.style.borderColor='#2d1f3d';e.currentTarget.style.color='#e7e2f0';}}>
            <a.icon size={13} /> {a.label}
          </button>
        ))}
      </div>
      {/* KPI Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'24px'}}>
        {kpiCards.map(card=>(
          <div key={card.title} style={{borderRadius:'12px',padding:'16px',background:'#1e1530',border:'1px solid #2d1f3d',transition:'all 0.2s'}}
            onMouseEnter={(e)=>{e.currentTarget.style.borderColor=card.color;e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={(e)=>{e.currentTarget.style.borderColor='#2d1f3d';e.currentTarget.style.transform='translateY(0)';}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
              <div style={{fontSize:'12px',color:'#6b5f7a',fontWeight:500}}>{card.title}</div>
              <div style={{width:'32px',height:'32px',borderRadius:'8px',background:card.bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <card.icon size={16} color={card.color} />
              </div>
            </div>
            <div style={{fontSize:'22px',fontWeight:700,color:'#e7e2f0',marginBottom:'6px'}}>{card.value}</div>
            <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
              {card.up ? <TrendingUp size={12} color="#22c55e" /> : <TrendingDown size={12} color="#ef4444" />}
              <span style={{fontSize:'11px',color: card.up?'#22c55e':'#ef4444'}}>{card.change}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Period Filter */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
        <h2 style={{fontSize:'18px',fontWeight:700,color:'#e7e2f0'}}>Графики</h2>
        <div style={{display:'flex',gap:'4px',background:'#1e1530',border:'1px solid #2d1f3d',borderRadius:'8px',padding:'3px'}}>
          {[{label:'7 дней',val:'7'},{label:'14 дней',val:'14'},{label:'Месяц',val:'30'},{label:'Квартал',val:'90'}].map(p=>(
            <button key={p.val} onClick={()=>setPeriod(p.val)}
              style={{padding:'5px 12px',borderRadius:'6px',border:'none',fontSize:'12px',cursor:'pointer',fontWeight: period===p.val?600:400,
                background: period===p.val?'#3b1f5e':'transparent',
                color: period===p.val?'#e7e2f0':'#6b5f7a',transition:'all 0.15s'}}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
        <ChartCard title="Сумма путевых листов" sub="Общая стоимость закрытых путевых за период" data={waysheetsData} color="#8b5cf6" />
        <ChartCard title="Штрафы" sub="Сумма штрафов по путевым листам за период" data={finesData} color="#ef4444" />
        <ChartCard title="Браки" sub="Количество браков по дням за период" data={defectsData} color="#f97316" />
        <ChartCard title="Доходы (путевые - штрафы)" sub="Чистый доход по дням за период" data={incomeData} color="#22c55e" />
      </div>
      <h2 style={{fontSize:'18px',fontWeight:700,color:'#e7e2f0',marginBottom:'12px'}}>Топ водителей</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
        <div style={{border:'1px solid #2d1f3d',borderRadius:'12px',padding:'20px',backgroundColor:'#1e1530'}}>
          <h3 style={{fontSize:'14px',fontWeight:600,color:'#e7e2f0',marginBottom:'2px'}}>Топ-10 проблемных водителей</h3>
          <p style={{fontSize:'12px',color:'#6b5f7a',marginBottom:'16px'}}>Водители с наибольшим количеством браков за неделю</p>
          <table style={{width:'100%',fontSize:'13px'}}>
            <thead><tr style={{borderBottom:'1px solid #2d1f3d'}}>
              <th style={{padding:'8px',textAlign:'left',color:'#6b5f7a',fontWeight:500}}>№</th>
              <th style={{padding:'8px',textAlign:'left',color:'#6b5f7a',fontWeight:500}}>Водитель</th>
              <th style={{padding:'8px',textAlign:'center',color:'#6b5f7a',fontWeight:500}}>Браков</th>
              <th style={{padding:'8px',textAlign:'center',color:'#6b5f7a',fontWeight:500}}>Путевых</th>
              <th style={{padding:'8px',textAlign:'center',color:'#6b5f7a',fontWeight:500}}>% браков</th>
            </tr></thead>
            <tbody>{topProblematic.map((d,i) => (
              <tr key={i} style={{borderBottom:'1px solid #1a1125',transition:'background 0.15s'}}
                onMouseEnter={(e)=>e.currentTarget.style.background='rgba(139,92,246,0.05)'}
                onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                <td style={{padding:'10px 8px',color:'#6b5f7a',fontWeight:600}}>{i+1}</td>
                <td style={{padding:'10px 8px',color:'#e7e2f0'}}>{d.n}</td>
                <td style={{padding:'10px 8px',textAlign:'center'}}><span className="badge-red">{d.b}</span></td>
                <td style={{padding:'10px 8px',textAlign:'center',color:'#e7e2f0'}}>{d.w}</td>
                <td style={{padding:'10px 8px',textAlign:'center'}}><span className="badge-yellow">{d.p}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div style={{border:'1px solid #2d1f3d',borderRadius:'12px',padding:'20px',backgroundColor:'#1e1530'}}>
          <h3 style={{fontSize:'14px',fontWeight:600,color:'#e7e2f0',marginBottom:'2px'}}>Топ-10 водителей по доходу</h3>
          <p style={{fontSize:'12px',color:'#6b5f7a',marginBottom:'16px'}}>Водители с наибольшим чистым доходом за неделю</p>
          <table style={{width:'100%',fontSize:'13px'}}>
            <thead><tr style={{borderBottom:'1px solid #2d1f3d'}}>
              <th style={{padding:'8px',textAlign:'left',color:'#6b5f7a',fontWeight:500}}>№</th>
              <th style={{padding:'8px',textAlign:'left',color:'#6b5f7a',fontWeight:500}}>Водитель</th>
              <th style={{padding:'8px',textAlign:'center',color:'#6b5f7a',fontWeight:500}}>Путевых</th>
              <th style={{padding:'8px',textAlign:'right',color:'#6b5f7a',fontWeight:500}}>Доход</th>
            </tr></thead>
            <tbody>{topIncome.map((d,i) => (
              <tr key={i} style={{borderBottom:'1px solid #1a1125',transition:'background 0.15s'}}
                onMouseEnter={(e)=>e.currentTarget.style.background='rgba(34,197,94,0.05)'}
                onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                <td style={{padding:'10px 8px',color:'#6b5f7a',fontWeight:600}}>{i+1}</td>
                <td style={{padding:'10px 8px',color:'#e7e2f0'}}>{d.n}</td>
                <td style={{padding:'10px 8px',textAlign:'center',color:'#e7e2f0'}}>{d.w}</td>
                <td style={{padding:'10px 8px',textAlign:'right'}}>
                  <span style={{color:'#22c55e',fontWeight:700}}>{d.inc.toLocaleString()} ₽</span><br/>
                  <span style={{fontSize:'11px',color:'#6b5f7a'}}>штрафы: {d.f.toLocaleString()} ₽</span>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
