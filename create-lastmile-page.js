const fs = require('fs');
const code = `'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { RefreshCw, Package, BarChart3, TrendingUp, Truck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
interface Route {
  route_car_id: number;
  route_name: string;
  distance: number;
  normative_liters: number;
  plan_count_departure: number;
  count_shk: number;
  shk_last_hours: number;
  count_tares: number;
  volume_ml_by_content: number;
  parking: number[];
  route_type: string;
}
interface Office {
  office_id: number;
  office_name: string;
  count_shk: number;
  count_tares: number;
  total_volume_ml: number;
  routes: Route[];
}
export default function LastMilePage() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const fetchData = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/wb-lastmile');
      const json = await res.json();
      if (json.data) { setOffices(json.data); setLastUpdate(new Date().toLocaleString('ru-RU')); }
      else setError(JSON.stringify(json));
    } catch(e) { setError(String(e)); }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);
  const allRoutes = offices.flatMap(o => (o.routes||[]).map(r => ({...r, office_name: o.office_name})));
  const totalShk = offices.reduce((s,o)=>s+o.count_shk,0);
  const totalTares = offices.reduce((s,o)=>s+o.count_tares,0);
  const totalVol = offices.reduce((s,o)=>s+(o.total_volume_ml||0),0);
  const maxShkRoute = allRoutes.reduce((max,r)=>r.count_shk>max.count_shk?r:max, {count_shk:0,route_car_id:0} as any);
  const chartData = [...allRoutes].sort((a,b)=>b.count_shk-a.count_shk).slice(0,15).map(r=>({
    name: String(r.route_car_id),
    shk: r.count_shk,
    shk_last: r.shk_last_hours,
    tares: r.count_tares,
    vol: Math.round((r.volume_ml_by_content||0)/1000),
    norm: Math.round(r.normative_liters||0),
  }));
  const kpiCards = [
    {title:'Число тар', value:totalTares.toLocaleString(), sub:'единиц', icon:Package, color:'#ef4444', bg:'rgba(239,68,68,0.1)'},
    {title:'Число ШК', value:totalShk.toLocaleString(), sub:'штрих-кодов', icon:BarChart3, color:'#ef4444', bg:'rgba(239,68,68,0.1)'},
    {title:'Объём', value:Math.round(totalVol/1000).toLocaleString(), sub:'л/груз', icon:TrendingUp, color:'#3b82f6', bg:'rgba(59,130,246,0.1)'},
    {title:'Маршрутов', value:allRoutes.length.toString(), sub:'активных', icon:Truck, color:'#22c55e', bg:'rgba(34,197,94,0.1)'},
    {title:'Макс. ШК', value:maxShkRoute.count_shk?.toLocaleString()||'—', sub:'Маршрут '+maxShkRoute.route_car_id, icon:BarChart3, color:'#f97316', bg:'rgba(249,115,22,0.1)'},
  ];
  return (
    <div>
      <Header title="Остатки ПМ" actions={
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          {lastUpdate && <span style={{fontSize:'12px',color:'#6b5f7a'}}>Обновлено: {lastUpdate}</span>}
          <button onClick={fetchData} style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 14px',background:'#3b1f5e',border:'1px solid #8b5cf6',borderRadius:'8px',color:'#e7e2f0',fontSize:'13px',cursor:'pointer'}}>
            <RefreshCw size={14}/> {loading?'Загрузка...':'Обновить'}
          </button>
        </div>
      }/>
      {error && <div style={{padding:'12px',background:'rgba(239,68,68,0.1)',border:'1px solid #ef4444',borderRadius:'8px',color:'#ef4444',marginBottom:'16px',fontSize:'13px'}}>{error}</div>}
      {/* KPI Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'12px',marginBottom:'24px'}}>
        {kpiCards.map(card=>(
          <div key={card.title} style={{borderRadius:'12px',padding:'16px',background:'#1e1530',border:'1px solid #2d1f3d',transition:'all 0.2s'}}
            onMouseEnter={(e:any)=>{e.currentTarget.style.borderColor=card.color;e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={(e:any)=>{e.currentTarget.style.borderColor='#2d1f3d';e.currentTarget.style.transform='translateY(0)';}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
              <div style={{fontSize:'12px',color:'#6b5f7a',fontWeight:500}}>{card.title}</div>
              <div style={{width:'32px',height:'32px',borderRadius:'8px',background:card.bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <card.icon size={16} color={card.color}/>
              </div>
            </div>
            <div style={{fontSize:'22px',fontWeight:700,color:'#e7e2f0',marginBottom:'4px'}}>{loading?'..':card.value}</div>
            <div style={{fontSize:'11px',color:'#6b5f7a'}}>{card.sub}</div>
          </div>
        ))}
      </div>
      {/* Charts */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
        <div style={{background:'#1e1530',border:'1px solid #2d1f3d',borderRadius:'12px',padding:'20px'}}>
          <h3 style={{fontSize:'14px',fontWeight:600,color:'#e7e2f0',marginBottom:'4px'}}>Число ШК по маршрутам</h3>
          <p style={{fontSize:'12px',color:'#6b5f7a',marginBottom:'16px'}}>Текущие остатки и поступления за последний час</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d1f3d"/>
              <XAxis dataKey="name" tick={{fontSize:10,fill:'#6b5f7a'}}/>
              <YAxis tick={{fontSize:10,fill:'#6b5f7a'}}/>
              <Tooltip contentStyle={{backgroundColor:'#1a1125',border:'1px solid #2d1f3d',borderRadius:'8px',color:'#e7e2f0'}}/>
              <Legend wrapperStyle={{fontSize:'12px',color:'#6b5f7a'}}/>
              <Bar dataKey="shk" name="Число ШК" fill="#3b82f6" radius={[4,4,0,0]}/>
              <Bar dataKey="shk_last" name="ШК посл.ч." fill="#8b5cf6" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:'#1e1530',border:'1px solid #2d1f3d',borderRadius:'12px',padding:'20px'}}>
          <h3 style={{fontSize:'14px',fontWeight:600,color:'#e7e2f0',marginBottom:'4px'}}>Объём (л) vs Норматив (л)</h3>
          <p style={{fontSize:'12px',color:'#6b5f7a',marginBottom:'16px'}}>Сравнение фактического объёма с нормативным</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d1f3d"/>
              <XAxis dataKey="name" tick={{fontSize:10,fill:'#6b5f7a'}}/>
              <YAxis tick={{fontSize:10,fill:'#6b5f7a'}}/>
              <Tooltip contentStyle={{backgroundColor:'#1a1125',border:'1px solid #2d1f3d',borderRadius:'8px',color:'#e7e2f0'}}/>
              <Legend wrapperStyle={{fontSize:'12px',color:'#6b5f7a'}}/>
              <Bar dataKey="vol" name="Объём л" fill="#22c55e" radius={[4,4,0,0]}/>
              <Bar dataKey="norm" name="Норм. л" fill="#f97316" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Table */}
      <div style={{background:'#1e1530',border:'1px solid #2d1f3d',borderRadius:'12px',overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid #2d1f3d',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3 style={{fontSize:'14px',fontWeight:600,color:'#e7e2f0',margin:0}}>Детализация по маршрутам</h3>
          <span style={{fontSize:'12px',color:'#6b5f7a'}}>Всего: {allRoutes.length} маршрутов</span>
        </div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
          <thead>
            <tr style={{borderBottom:'1px solid #2d1f3d',background:'#1a1125'}}>
              {['Маршрут','Парковка','Тары','ШК','ШК посл.ч.','Объём л','Норм. объём л','% заполн.','Выезды','Дистанция км','Тип'].map(h=>(
                <th key={h} style={{padding:'10px 14px',textAlign:'left',color:'#6b5f7a',fontWeight:500,fontSize:'12px',whiteSpace:'nowrap'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={11} style={{padding:'60px',textAlign:'center',color:'#6b5f7a'}}>Загрузка данных из WB API...</td></tr>
            ) : allRoutes.length===0 ? (
              <tr><td colSpan={11} style={{padding:'60px',textAlign:'center',color:'#6b5f7a'}}>Нет данных</td></tr>
            ) : allRoutes.map((r,i)=>{
              const vol = Math.round((r.volume_ml_by_content||0)/1000);
              const norm = Math.round(r.normative_liters||0);
              const pct = norm>0?Math.round(vol/norm*100):0;
              const pctColor = pct>=90?'#22c55e':pct>=70?'#f97316':'#ef4444';
              return (
                <tr key={i} style={{borderBottom:'1px solid #1a1125',transition:'background 0.15s'}}
                  onMouseEnter={(e:any)=>e.currentTarget.style.background='rgba(139,92,246,0.05)'}
                  onMouseLeave={(e:any)=>e.currentTarget.style.background='transparent'}>
                  <td style={{padding:'10px 14px',color:'#8b5cf6',fontWeight:600}}>{r.route_car_id}</td>
                  <td style={{padding:'10px 14px',color:'#9d9dab',fontSize:'12px'}}>{r.parking?.join(', ')||'—'}</td>
                  <td style={{padding:'10px 14px',color:'#e7e2f0'}}>{r.count_tares}</td>
                  <td style={{padding:'10px 14px'}}><span style={{color:'#3b82f6',fontWeight:600}}>{r.count_shk.toLocaleString()}</span></td>
                  <td style={{padding:'10px 14px',color:'#8b5cf6'}}>{r.shk_last_hours||0}</td>
                  <td style={{padding:'10px 14px',color:'#22c55e'}}>{vol.toLocaleString()}</td>
                  <td style={{padding:'10px 14px',color:'#f97316'}}>{norm.toLocaleString()}</td>
                  <td style={{padding:'10px 14px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <div style={{flex:1,height:'4px',background:'#2d1f3d',borderRadius:'2px'}}>
                        <div style={{width:Math.min(pct,100)+'%',height:'100%',background:pctColor,borderRadius:'2px'}}/>
                      </div>
                      <span style={{color:pctColor,fontSize:'11px',fontWeight:600,minWidth:'32px'}}>{pct}%</span>
                    </div>
                  </td>
                  <td style={{padding:'10px 14px',color:'#e7e2f0'}}>{r.plan_count_departure||0}</td>
                  <td style={{padding:'10px 14px',color:'#9d9dab'}}>{r.distance?.toFixed(1)||'—'}</td>
                  <td style={{padding:'10px 14px',color:'#6b5f7a',fontSize:'11px'}}>{r.route_type||'—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/app/(dashboard)/wb-monitoring/last-mile/page.tsx', code, 'utf8');
fs.mkdirSync('src/app/(dashboard)/wb-monitoring/last-mile', {recursive:true});
fs.writeFileSync('src/app/(dashboard)/wb-monitoring/last-mile/page.tsx', code, 'utf8');
console.log('done');
