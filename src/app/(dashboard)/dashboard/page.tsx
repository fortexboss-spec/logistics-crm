'use client';
import Header from '@/components/Header';
import { RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const waysheetsData = [{d:'14 фев.',v:200000},{d:'15 фев.',v:650000},{d:'16 фев.',v:500000},{d:'17 фев.',v:550000},{d:'18 фев.',v:480000},{d:'19 фев.',v:600000},{d:'20 фев.',v:650000},{d:'21 фев.',v:550000},{d:'22 фев.',v:700000},{d:'23 фев.',v:600000},{d:'24 фев.',v:650000},{d:'25 фев.',v:500000},{d:'26 фев.',v:200000},{d:'27 фев.',v:100000}];
const finesData = [{d:'14 фев.',v:60000},{d:'15 фев.',v:75000},{d:'16 фев.',v:70000},{d:'17 фев.',v:80000},{d:'18 фев.',v:65000},{d:'19 фев.',v:85000},{d:'20 фев.',v:75000},{d:'21 фев.',v:90000},{d:'22 фев.',v:85000},{d:'23 фев.',v:92000},{d:'24 фев.',v:88000},{d:'25 фев.',v:80000},{d:'26 фев.',v:90000},{d:'27 фев.',v:15000}];
const defectsData = [{d:'14 фев.',v:65},{d:'15 фев.',v:15},{d:'16 фев.',v:230},{d:'17 фев.',v:240},{d:'18 фев.',v:220},{d:'19 фев.',v:80},{d:'20 фев.',v:230},{d:'21 фев.',v:250},{d:'22 фев.',v:200},{d:'23 фев.',v:180},{d:'24 фев.',v:130},{d:'25 фев.',v:120},{d:'26 фев.',v:100}];
const incomeData = [{d:'14 фев.',v:600000},{d:'15 фев.',v:700000},{d:'16 фев.',v:500000},{d:'17 фев.',v:200000},{d:'18 фев.',v:650000},{d:'19 фев.',v:600000},{d:'20 фев.',v:550000},{d:'21 фев.',v:600000},{d:'22 фев.',v:500000},{d:'23 фев.',v:650000},{d:'24 фев.',v:600000},{d:'25 фев.',v:550000},{d:'26 фев.',v:500000},{d:'27 фев.',v:150000}];
const topProblematic = [{n:'Тимофеичев Иван Александрович',b:43,w:16,p:'268.8%'},{n:'Кравченко Александр Николаевич',b:43,w:20,p:'215%'},{n:'Шемякин Виталий Александрович',b:39,w:13,p:'300%'},{n:'Павлюченков Олег Евгеньевич',b:36,w:19,p:'189.5%'},{n:'Иванов Станислав Александрович',b:35,w:12,p:'291.7%'}];
const topIncome = [{n:'Олейник Илья Андреевич',w:9,inc:353498,f:14356},{n:'Аланго Дмитрий Евгеньевич',w:8,inc:317993,f:10324},{n:'Крылов Роман Дмитриевич',w:8,inc:311702,f:15416},{n:'Левин Артём Андреевич',w:8,inc:309531,f:20180},{n:'Малышев Данил Владимирович',w:6,inc:246686,f:37008}];
const ChartCard = ({title, sub, data, color}: {title:string, sub:string, data:{d:string,v:number}[], color:string}) => (
  <div style={{border:'1px solid #464652',borderRadius:'8px',padding:'16px'}}>
    <h3 style={{fontSize:'14px',fontWeight:600,color:'#e7e2f0'}}>{title}</h3>
    <p style={{fontSize:'12px',color:'#9d9dab',marginBottom:'12px'}}>{sub}</p>
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#464652"/><XAxis dataKey="d" tick={{fontSize:10,fill:'#9d9dab'}} /><YAxis tick={{fontSize:10,fill:'#9d9dab'}} /><Tooltip contentStyle={{backgroundColor:'#26262a',border:'1px solid #464652',borderRadius:'8px',color:'#e7e2f0'}} /><Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={{r:3,fill:color}} /></LineChart>
    </ResponsiveContainer>
  </div>
);
export default function DashboardPage() {
  return (
    <div>
      <Header title="Dashboard" actions={<button className="btn-outline"><RefreshCw size={14} /> Обновить</button>} />
      <p style={{fontSize:'14px',color:'#9d9dab',marginBottom:'16px'}}>Статистика по путевым листам и бракам за последние 14 дней</p>
      <h2 style={{fontSize:'18px',fontWeight:700,color:'#e7e2f0',marginBottom:'12px'}}>Графики за неделю</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
        <ChartCard title="Сумма путевых листов" sub="Общая стоимость закрытых путевых за неделю" data={waysheetsData} color="#8b5cf6" />
        <ChartCard title="Штрафы" sub="Сумма штрафов по путевым листам за неделю" data={finesData} color="#ef4444" />
        <ChartCard title="Браки" sub="Количество браков по дням за неделю" data={defectsData} color="#f97316" />
        <ChartCard title="Доходы (путевые - штрафы)" sub="Чистый доход по дням за неделю" data={incomeData} color="#22c55e" />
      </div>
      <h2 style={{fontSize:'18px',fontWeight:700,color:'#e7e2f0',marginBottom:'12px'}}>Топ водителей</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
        <div style={{border:'1px solid #464652',borderRadius:'8px',padding:'16px'}}>
          <h3 style={{fontSize:'14px',fontWeight:600,color:'#e7e2f0'}}>Топ-10 проблемных водителей</h3>
          <p style={{fontSize:'12px',color:'#9d9dab',marginBottom:'12px'}}>Водители с наибольшим количеством браков за неделю</p>
          <table style={{width:'100%',fontSize:'13px'}}><thead><tr style={{borderBottom:'1px solid #464652'}}><th style={{padding:'8px',textAlign:'left',color:'#9d9dab'}}>No</th><th style={{padding:'8px',textAlign:'left',color:'#9d9dab'}}>Водитель</th><th style={{padding:'8px',color:'#9d9dab'}}>Браков</th><th style={{padding:'8px',color:'#9d9dab'}}>Путевых</th><th style={{padding:'8px',color:'#9d9dab'}}>% браков</th></tr></thead>
          <tbody>{topProblematic.map((d,i) => (<tr key={i} style={{borderBottom:'1px solid #3a3a42'}}><td style={{padding:'8px',color:'#e7e2f0'}}>{i+1}</td><td style={{padding:'8px',color:'#e7e2f0'}}>{d.n}</td><td style={{padding:'8px',textAlign:'center'}}><span className="badge-red">{d.b}</span></td><td style={{padding:'8px',textAlign:'center',color:'#e7e2f0'}}>{d.w}</td><td style={{padding:'8px',textAlign:'center'}}><span className="badge-yellow">{d.p}</span></td></tr>))}</tbody></table>
        </div>
        <div style={{border:'1px solid #464652',borderRadius:'8px',padding:'16px'}}>
          <h3 style={{fontSize:'14px',fontWeight:600,color:'#e7e2f0'}}>Топ-10 водителей по доходу</h3>
          <p style={{fontSize:'12px',color:'#9d9dab',marginBottom:'12px'}}>Водители с наибольшим чистым доходом за неделю</p>
          <table style={{width:'100%',fontSize:'13px'}}><thead><tr style={{borderBottom:'1px solid #464652'}}><th style={{padding:'8px',textAlign:'left',color:'#9d9dab'}}>No</th><th style={{padding:'8px',textAlign:'left',color:'#9d9dab'}}>Водитель</th><th style={{padding:'8px',color:'#9d9dab'}}>Путевых</th><th style={{padding:'8px',textAlign:'right',color:'#9d9dab'}}>Доход</th></tr></thead>
          <tbody>{topIncome.map((d,i) => (<tr key={i} style={{borderBottom:'1px solid #3a3a42'}}><td style={{padding:'8px',color:'#e7e2f0',fontWeight:600}}>{i+1}</td><td style={{padding:'8px',color:'#e7e2f0'}}>{d.n}</td><td style={{padding:'8px',textAlign:'center',color:'#e7e2f0'}}>{d.w}</td><td style={{padding:'8px',textAlign:'right'}}><span style={{color:'#22c55e',fontWeight:600}}>{d.inc.toLocaleString()} P</span><br/><span style={{fontSize:'11px',color:'#9d9dab'}}>штрафы: {d.f.toLocaleString()} P</span></td></tr>))}</tbody></table>
        </div>
      </div>
    </div>
  );
}
