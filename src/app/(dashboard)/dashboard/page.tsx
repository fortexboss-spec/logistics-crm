'use client';
import Header from '@/components/Header';
import { RefreshCw, TrendingUp, TrendingDown, FileText, AlertTriangle, DollarSign, Package, UserPlus, Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState } from 'react';
const wbData = [
  {d:'18 фев',tasks:484,income:781426,fines:79204,net:702222},
  {d:'19 фев',tasks:456,income:931178,fines:76600,net:854577},
  {d:'20 фев',tasks:569,income:833903,fines:111109,net:722793},
  {d:'21 фев',tasks:667,income:709262,fines:114815,net:594446},
  {d:'22 фев',tasks:696,income:781871,fines:111331,net:670540},
  {d:'23 фев',tasks:653,income:819540,fines:119748,net:699791},
  {d:'24 фев',tasks:598,income:876573,fines:109941,net:766632},
  {d:'25 фев',tasks:639,income:846577,fines:116703,net:729874},
  {d:'26 фев',tasks:495,income:707970,fines:86932,net:621037},
  {d:'27 фев',tasks:701,income:722463,fines:130973,net:591490},
];
const totalIncome = wbData.reduce((s,d)=>s+d.income,0);
const totalFines = wbData.reduce((s,d)=>s+d.fines,0);
const totalNet = wbData.reduce((s,d)=>s+d.net,0);
const totalTasks = wbData.reduce((s,d)=>s+d.tasks,0);
const notifications = [
  { id:1, text:'Штрафы 27 фев выросли до 130 973 ₽', type:'error' },
  { id:2, text:'Баланс WB: 7 434 632 ₽', type:'info' },
  { id:3, text:'Доступно к выводу: 5 759 141 ₽', type:'info' },
];
const kpiCards = [
  { title:'Начисления за период', value: (totalIncome/1000000).toFixed(2)+' М₽', change:'+реальные данные WB', up:true, icon:DollarSign, color:'#22c55e', bg:'rgba(34,197,94,0.1)' },
  { title:'Чистый доход', value: (totalNet/1000000).toFixed(2)+' М₽', change:'начисления - штрафы', up:true, icon:FileText, color:'#8b5cf6', bg:'rgba(139,92,246,0.1)' },
  { title:'Штрафы за период', value: (totalFines/1000).toFixed(0)+' К₽', change:'опоздания, неотметки', up:false, icon:AlertTriangle, color:'#ef4444', bg:'rgba(239,68,68,0.1)' },
  { title:'Всего заданий', value: totalTasks.toLocaleString(), change:'транспортных заданий', up:true, icon:Package, color:'#f97316', bg:'rgba(249,115,22,0.1)' },
];
const ChartCard = ({title, sub, data, dataKey, color, formatter}: any) => (
  <div style={{border:'1px solid #2d1f3d',borderRadius:'12px',padding:'20px',backgroundColor:'#1e1530',transition:'border-color 0.2s'}}
    onMouseEnter={(e:any)=>e.currentTarget.style.borderColor='#4c2d7a'}
    onMouseLeave={(e:any)=>e.currentTarget.style.borderColor='#2d1f3d'}>
    <h3 style={{fontSize:'14px',fontWeight:600,color:'#e7e2f0',marginBottom:'2px'}}>{title}</h3>
    <p style={{fontSize:'12px',color:'#6b5f7a',marginBottom:'16px'}}>{sub}</p>
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d1f3d"/>
        <XAxis dataKey="d" tick={{fontSize:10,fill:'#6b5f7a'}} />
        <YAxis tick={{fontSize:10,fill:'#6b5f7a'}} tickFormatter={formatter} />
        <Tooltip contentStyle={{backgroundColor:'#1a1125',border:'1px solid #2d1f3d',borderRadius:'8px',color:'#e7e2f0'}} formatter={(v:any)=>formatter(v)} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{r:3,fill:color}} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
export default function DashboardPage() {
  const [period, setPeriod] = useState('10');
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
          <button style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 12px',background:'#2d1f3d',border:'1px solid #3b2a52',borderRadius:'8px',color:'#e7e2f0',fontSize:'13px',cursor:'pointer'}}>
            <RefreshCw size={14} /> Обновить
          </button>
        </div>
      } />
      {/* WB Balance Banner */}
      <div style={{background:'linear-gradient(135deg,#1e1530,#2d1f3d)',border:'1px solid #4c2d7a',borderRadius:'12px',padding:'16px 20px',marginBottom:'20px',display:'flex',gap:'32px',alignItems:'center'}}>
        <div>
          <div style={{fontSize:'11px',color:'#6b5f7a',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:'4px'}}>Баланс WB</div>
          <div style={{fontSize:'24px',fontWeight:700,color:'#e7e2f0'}}>7 434 632 ₽</div>
        </div>
        <div style={{width:'1px',height:'40px',background:'#2d1f3d'}}/>
        <div>
          <div style={{fontSize:'11px',color:'#6b5f7a',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:'4px'}}>Сумма штрафов</div>
          <div style={{fontSize:'24px',fontWeight:700,color:'#ef4444'}}>-1 081 743 ₽</div>
        </div>
        <div style={{width:'1px',height:'40px',background:'#2d1f3d'}}/>
        <div>
          <div style={{fontSize:'11px',color:'#6b5f7a',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:'4px'}}>Доступно к выводу</div>
          <div style={{fontSize:'24px',fontWeight:700,color:'#22c55e'}}>5 759 141 ₽</div>
        </div>
        <div style={{marginLeft:'auto',fontSize:'11px',color:'#6b5f7a'}}>📡 Данные WB · 28.02.2026</div>
      </div>
      {/* Quick Actions */}
      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'20px',flexWrap:'wrap'}}>
        <span style={{fontSize:'13px',color:'#6b5f7a',marginRight:'4px'}}>Быстрые действия:</span>
        {[
          {label:'+ Путевой лист', color:'#8b5cf6'},
          {label:'+ Водитель', color:'#22c55e'},
          {label:'+ Доставка', color:'#3b82f6'},
        ].map(a=>(
          <button key={a.label} style={{padding:'6px 12px',background:'#1e1530',border:'1px solid #2d1f3d',borderRadius:'8px',color:'#e7e2f0',fontSize:'12px',cursor:'pointer',transition:'all 0.15s'}}
            onMouseEnter={(e:any)=>{e.currentTarget.style.borderColor=a.color;e.currentTarget.style.color=a.color;}}
            onMouseLeave={(e:any)=>{e.currentTarget.style.borderColor='#2d1f3d';e.currentTarget.style.color='#e7e2f0';}}>
            {a.label}
          </button>
        ))}
      </div>
      {/* KPI Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'24px'}}>
        {kpiCards.map(card=>(
          <div key={card.title} style={{borderRadius:'12px',padding:'16px',background:'#1e1530',border:'1px solid #2d1f3d',transition:'all 0.2s'}}
            onMouseEnter={(e:any)=>{e.currentTarget.style.borderColor=card.color;e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={(e:any)=>{e.currentTarget.style.borderColor='#2d1f3d';e.currentTarget.style.transform='translateY(0)';}}>
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
        <h2 style={{fontSize:'18px',fontWeight:700,color:'#e7e2f0'}}>Графики <span style={{fontSize:'12px',color:'#6b5f7a',fontWeight:400}}>· реальные данные WB 18-27 фев</span></h2>
        <div style={{display:'flex',gap:'4px',background:'#1e1530',border:'1px solid #2d1f3d',borderRadius:'8px',padding:'3px'}}>
          {[{label:'7 дней',val:'7'},{label:'10 дней',val:'10'},{label:'Месяц',val:'30'}].map(p=>(
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
        <ChartCard title="Начисления по дням" sub="Транспортные задания WB (с НДС)" data={wbData} dataKey="income" color="#8b5cf6" formatter={(v:number)=>v>=1000?(v/1000).toFixed(0)+'К':v} />
        <ChartCard title="Штрафы по дням" sub="Опоздания, неотметки на точках маршрута" data={wbData} dataKey="fines" color="#ef4444" formatter={(v:number)=>v>=1000?(v/1000).toFixed(0)+'К':v} />
        <ChartCard title="Чистый доход по дням" sub="Начисления минус штрафы" data={wbData} dataKey="net" color="#22c55e" formatter={(v:number)=>v>=1000?(v/1000).toFixed(0)+'К':v} />
        <ChartCard title="Количество заданий" sub="Транспортных заданий в день" data={wbData} dataKey="tasks" color="#f97316" formatter={(v:number)=>v+' шт'} />
      </div>
      {/* Daily Table */}
      <h2 style={{fontSize:'18px',fontWeight:700,color:'#e7e2f0',marginBottom:'12px'}}>Детализация по дням</h2>
      <div style={{border:'1px solid #2d1f3d',borderRadius:'12px',overflow:'hidden',backgroundColor:'#1e1530'}}>
        <table style={{width:'100%',fontSize:'13px',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{borderBottom:'1px solid #2d1f3d',background:'#1a1125'}}>
              <th style={{padding:'12px 16px',textAlign:'left',color:'#6b5f7a',fontWeight:500}}>Дата</th>
              <th style={{padding:'12px 16px',textAlign:'center',color:'#6b5f7a',fontWeight:500}}>Заданий</th>
              <th style={{padding:'12px 16px',textAlign:'right',color:'#6b5f7a',fontWeight:500}}>Начисления</th>
              <th style={{padding:'12px 16px',textAlign:'right',color:'#6b5f7a',fontWeight:500}}>Штрафы</th>
              <th style={{padding:'12px 16px',textAlign:'right',color:'#6b5f7a',fontWeight:500}}>Итог</th>
            </tr>
          </thead>
          <tbody>
            {wbData.map((d,i)=>(
              <tr key={i} style={{borderBottom:'1px solid #1a1125',transition:'background 0.15s'}}
                onMouseEnter={(e:any)=>e.currentTarget.style.background='rgba(139,92,246,0.05)'}
                onMouseLeave={(e:any)=>e.currentTarget.style.background='transparent'}>
                <td style={{padding:'12px 16px',color:'#e7e2f0',fontWeight:500}}>{d.d}</td>
                <td style={{padding:'12px 16px',textAlign:'center'}}><span style={{background:'rgba(249,115,22,0.15)',color:'#f97316',padding:'2px 8px',borderRadius:'12px',fontSize:'12px',fontWeight:600}}>{d.tasks} шт</span></td>
                <td style={{padding:'12px 16px',textAlign:'right',color:'#8b5cf6',fontWeight:500}}>{d.income.toLocaleString()} ₽</td>
                <td style={{padding:'12px 16px',textAlign:'right',color:'#ef4444',fontWeight:500}}>-{d.fines.toLocaleString()} ₽</td>
                <td style={{padding:'12px 16px',textAlign:'right',color:'#22c55e',fontWeight:700}}>{d.net.toLocaleString()} ₽</td>
              </tr>
            ))}
            <tr style={{background:'#1a1125',borderTop:'2px solid #2d1f3d'}}>
              <td style={{padding:'12px 16px',color:'#e7e2f0',fontWeight:700}}>ИТОГО</td>
              <td style={{padding:'12px 16px',textAlign:'center',color:'#f97316',fontWeight:700}}>{totalTasks} шт</td>
              <td style={{padding:'12px 16px',textAlign:'right',color:'#8b5cf6',fontWeight:700}}>{totalIncome.toLocaleString()} ₽</td>
              <td style={{padding:'12px 16px',textAlign:'right',color:'#ef4444',fontWeight:700}}>-{totalFines.toLocaleString()} ₽</td>
              <td style={{padding:'12px 16px',textAlign:'right',color:'#22c55e',fontWeight:700}}>{totalNet.toLocaleString()} ₽</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
