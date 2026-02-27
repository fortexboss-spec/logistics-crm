"use client";

import { useState, useEffect, useMemo } from "react";
import { RefreshCw, Download, ChevronDown, ArrowUpDown } from "lucide-react";

interface Waysheet { id: number; driverName: string; routeName: string; logRouteId: number; totalPrice: number; shksCount: number; openDt: string; closeDt: string | null; fineSum: number; planMileage: number; vehicleNumberPlate: string; isClosed: boolean; boxCountTotal: number; boxCountDelivered: number; srcOfficeName: string; }

function fmt(n: number) { return n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtDate(d: string) { return new Date(d).toLocaleDateString("ru-RU"); }

export default function RoutesAnalyticsPage() {
  const [data, setData] = useState<Waysheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("2026-02-20");
  const [toDate, setToDate] = useState("2026-02-27");
  const [selRoute, setSelRoute] = useState("all");
  const [sortF, setSortF] = useState<string | null>(null);
  const [sortD, setSortD] = useState<"asc" | "desc">("asc");

  const load = async () => {
    setLoading(true);
    try { const r = await fetch(`/api/crm/wb-monitoring/waysheets/?from_date=${fromDate}&to_date=${toDate}`); const j = await r.json(); if (j.data) setData(j.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const routes = useMemo(() => Array.from(new Set(data.map(w => w.logRouteId))).sort((a,b)=>a-b), [data]);
  const filtered = useMemo(() => {
    let d = data;
    if (selRoute !== "all") d = d.filter(w => w.logRouteId === Number(selRoute));
    if (sortF) d = [...d].sort((a,b) => { const av = (a as any)[sortF], bv = (b as any)[sortF]; if (typeof av === "number") return sortD === "asc" ? av-bv : bv-av; return sortD === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av)); });
    return d;
  }, [data, selRoute, sortF, sortD]);

  const rev = useMemo(() => filtered.reduce((s,w) => s+w.totalPrice, 0), [filtered]);
  const fin = useMemo(() => filtered.reduce((s,w) => s+w.fineSum, 0), [filtered]);
  const drv = useMemo(() => new Set(filtered.map(w=>w.driverName)).size, [filtered]);
  const rts = useMemo(() => new Set(filtered.map(w=>w.logRouteId)).size, [filtered]);
  const avg = filtered.length > 0 ? rev/filtered.length : 0;
  const pct = rev > 0 ? ((fin/rev)*100).toFixed(1) : "0";

  const dur = useMemo(() => { const ds = filtered.filter(w=>w.openDt&&w.closeDt).map(w=>(new Date(w.closeDt!).getTime()-new Date(w.openDt).getTime())/3600000); return ds.length > 0 ? (ds.reduce((a,b)=>a+b,0)/ds.length).toFixed(1) : "0"; }, [filtered]);

  const daily = useMemo(() => {
    const m = new Map<string, {revenue:number;fines:number;label:string}>();
    filtered.forEach(w => { const label = new Date(w.openDt).toLocaleDateString("ru-RU",{day:"numeric",month:"short"}); const key = new Date(w.openDt).toISOString().split("T")[0]; const e = m.get(key) || {revenue:0,fines:0,label}; e.revenue += w.totalPrice; e.fines += w.fineSum; e.label = label; m.set(key, e); });
    return Array.from(m.entries()).sort(([a],[b])=>a.localeCompare(b)).map(([,v])=>v);
  }, [filtered]);
  const maxV = Math.max(...daily.map(d=>d.revenue), 1);

  const timeDist = useMemo(() => { const d = {m:0,d:0,e:0,n:0}; filtered.forEach(w => { if (w.closeDt) { const h = new Date(w.closeDt).getHours(); if(h<6)d.m++;else if(h<12)d.d++;else if(h<18)d.e++;else d.n++; } }); const t = d.m+d.d+d.e+d.n||1; return {m:Math.round(d.m/t*100),d:Math.round(d.d/t*100),e:Math.round(d.e/t*100),n:Math.round(d.n/t*100)}; }, [filtered]);

  const topDrv = useMemo(() => { const m = new Map<string,number>(); filtered.forEach(w=>m.set(w.driverName,(m.get(w.driverName)||0)+1)); return Array.from(m.entries()).sort((a,b)=>b[1]-a[1]).slice(0,10); }, [filtered]);
  const topFin = useMemo(() => { const m = new Map<string,number>(); filtered.forEach(w=>{if(w.fineSum>0)m.set(w.driverName,(m.get(w.driverName)||0)+w.fineSum);}); return Array.from(m.entries()).sort((a,b)=>b[1]-a[1]).slice(0,10); }, [filtered]);
  const topRtFin = useMemo(() => { const m = new Map<number,{f:number;c:number}>(); filtered.forEach(w=>{const e=m.get(w.logRouteId)||{f:0,c:0};e.f+=w.fineSum;e.c++;m.set(w.logRouteId,e);}); return Array.from(m.entries()).sort((a,b)=>b[1].f-a[1].f).slice(0,10); }, [filtered]);

  const toggle = (f:string) => { if(sortF===f)setSortD(sortD==="asc"?"desc":"asc");else{setSortF(f);setSortD("asc");} };
  const C = "rounded-[14px] border border-[#35304a] bg-[#26262a] shadow-sm";
  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold text-[#e7e2f0]">Аналитика маршрутов</h1><p className="text-sm text-[#9d9dab]">Детальная аналитика по маршрутам Wildberries (данные из WB API)</p></div>

      <div className={C + " py-6 px-6"}>
        <h2 className="text-base font-semibold text-[#e7e2f0] mb-4">Фильтры</h2>
        <div className="flex items-end gap-6 mb-4">
          <div className="flex-1 max-w-[300px]"><label className="block text-xs text-[#9d9dab] mb-1">Дата начала</label><input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} className="w-full bg-[#18181b] border border-[#35304a] rounded-lg px-3 py-2 text-sm text-[#e7e2f0] focus:outline-none focus:border-[#ba85ff]" /></div>
          <div className="flex-1 max-w-[300px]"><label className="block text-xs text-[#9d9dab] mb-1">Дата окончания</label><input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} className="w-full bg-[#18181b] border border-[#35304a] rounded-lg px-3 py-2 text-sm text-[#e7e2f0] focus:outline-none focus:border-[#ba85ff]" /></div>
          <div className="flex-1 max-w-[200px]"><label className="block text-xs text-[#9d9dab] mb-1">Маршрут</label><div className="relative"><select value={selRoute} onChange={e=>setSelRoute(e.target.value)} className="w-full bg-[#18181b] border border-[#35304a] rounded-lg px-3 py-2 text-sm text-[#e7e2f0] appearance-none focus:outline-none focus:border-[#ba85ff]"><option value="all">Все маршруты</option>{routes.map(r=>(<option key={r} value={r}>#{r}</option>))}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9d9dab] pointer-events-none" /></div></div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} disabled={loading} className="flex items-center gap-2 bg-[#ba85ff] text-[#0f051c] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#a870e8] transition-colors"><RefreshCw className={"w-4 h-4 "+(loading?"animate-spin":"")} /> Обновить</button>
          <button className="flex items-center gap-2 bg-transparent border border-[#35304a] text-[#e7e2f0] rounded-lg px-4 py-2 text-sm hover:bg-[#35304a]/30 transition-colors"><Download className="w-4 h-4" /> Экспорт в Excel</button>
          <span className="text-sm text-[#9d9dab] ml-2">Загружено: {filtered.length} путевых | Маршрутов: {rts}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className={C+" py-6 px-6"}><p className="text-sm text-[#9d9dab]">Всего путевых</p><div className="text-2xl font-bold text-[#e7e2f0] mt-3">{filtered.length}</div><p className="text-xs text-[#9d9dab] mt-1">{drv} водителей</p></div>
        <div className={C+" py-6 px-6"}><p className="text-sm text-[#9d9dab]">Выручка</p><div className="text-2xl font-bold text-green-600 mt-3">{fmt(rev)} ₽</div><p className="text-xs text-[#9d9dab] mt-1">Средняя: {fmt(avg)} ₽</p></div>
        <div className={C+" py-6 px-6"}><p className="text-sm text-[#9d9dab]">Штрафы</p><div className="text-2xl font-bold text-red-600 mt-3">{fmt(fin)} ₽</div><p className="text-xs text-[#9d9dab] mt-1">{pct}% от выручки</p></div>
      </div>

      <div className={C+" py-6 px-6"}>
        <h2 className="text-base font-semibold text-[#e7e2f0] mb-4">Показатели эффективности</h2>
        <div className="grid grid-cols-3 gap-6">
          <div><p className="text-sm text-[#9d9dab]">Средняя длительность</p><div className="text-xl font-bold text-[#e7e2f0] mt-1">{dur} ч</div></div>
          <div><p className="text-sm text-[#9d9dab]">Скорость факт.</p><div className="text-xl font-bold text-[#e7e2f0] mt-1">Н/Д</div></div>
          <div><p className="text-sm text-[#9d9dab]">Скорость норм.</p><div className="text-xl font-bold text-[#e7e2f0] mt-1">Н/Д</div></div>
        </div>
      </div>
      <div className={C+" py-6 px-6"}>
        <h2 className="text-base font-semibold text-[#e7e2f0]">Статистика по дням</h2>
        <p className="text-xs text-[#9d9dab] mb-4">Выручка и штрафы за период</p>
        <div className="h-[300px] relative">
          {daily.length > 0 && (<svg viewBox="0 0 800 260" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {[0,0.25,0.5,0.75,1].map((v,i)=>(<g key={i}><line x1="60" y1={20+(1-v)*200} x2="780" y2={20+(1-v)*200} stroke="#35304a" strokeWidth="0.5"/><text x="55" y={24+(1-v)*200} fill="#9d9dab" fontSize="10" textAnchor="end">{Math.round(maxV*v).toLocaleString("ru-RU")}</text></g>))}
            <polyline fill="none" stroke="#4ade80" strokeWidth="2" points={daily.map((d,i)=>{const x=60+(i*720)/Math.max(daily.length-1,1);return x+","+(220-d.revenue/maxV*200)}).join(" ")}/>
            {daily.map((d,i)=>{const x=60+(i*720)/Math.max(daily.length-1,1);const y=220-d.revenue/maxV*200;return <circle key={"r"+i} cx={x} cy={y} r="4" fill="#4ade80" stroke="#26262a" strokeWidth="2"/>})}
            <polyline fill="none" stroke="#ef4444" strokeWidth="2" points={daily.map((d,i)=>{const x=60+(i*720)/Math.max(daily.length-1,1);return x+","+(220-d.fines/maxV*200)}).join(" ")}/>
            {daily.map((d,i)=>{const x=60+(i*720)/Math.max(daily.length-1,1);const y=220-d.fines/maxV*200;return <circle key={"f"+i} cx={x} cy={y} r="4" fill="#ef4444" stroke="#26262a" strokeWidth="2"/>})}
            {daily.map((d,i)=>{const x=60+(i*720)/Math.max(daily.length-1,1);return <text key={"l"+i} x={x} y={245} fill="#9d9dab" fontSize="10" textAnchor="middle">{d.label}</text>})}
          </svg>)}
          <div className="flex items-center justify-center gap-6 mt-1"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#4ade80]"/><span className="text-xs text-[#9d9dab]">Выручка</span></div><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ef4444]"/><span className="text-xs text-[#9d9dab]">Штрафы</span></div></div>
        </div>
      </div>

      <div className={C+" py-6 px-6"}>
        <h2 className="text-base font-semibold text-[#e7e2f0]">Распределение по времени суток</h2>
        <p className="text-xs text-[#9d9dab] mb-4">Количество закрытых путевых по времени</p>
        <PieChart td={timeDist}/>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className={C+" py-6 px-6"}><h2 className="text-base font-semibold text-[#e7e2f0] mb-4">Топ по путевым</h2>{topDrv.map(([n,c],i)=>(<div key={i} className="flex items-center justify-between py-2 border-b border-[#35304a] last:border-0"><span className="text-sm text-[#e7e2f0] truncate mr-2">{n}</span><span className="text-sm font-semibold text-[#e7e2f0] shrink-0">{c}</span></div>))}</div>
        <div className={C+" py-6 px-6"}><h2 className="text-base font-semibold text-[#e7e2f0] mb-4">Топ по штрафам</h2>{topFin.map(([n,s],i)=>(<div key={i} className="flex items-center justify-between py-2 border-b border-[#35304a] last:border-0"><span className="text-sm text-[#e7e2f0] truncate mr-2">{n}</span><span className="text-sm font-semibold text-red-500 shrink-0">{fmt(s)} ₽</span></div>))}</div>
        <div className={C+" py-6 px-6"}><h2 className="text-base font-semibold text-[#e7e2f0] mb-4">Топ маршрутов по штрафам</h2>{topRtFin.map(([id,{f,c}],i)=>(<div key={i} className="flex items-center justify-between py-2 border-b border-[#35304a] last:border-0"><span className="text-sm text-[#e7e2f0]">#{id} ({c} путевых)</span><span className="text-sm font-semibold text-red-500 shrink-0">{fmt(f)} ₽</span></div>))}</div>
      </div>

      <div className={C+" py-6"}>
        <div className="px-6 mb-4"><h2 className="text-base font-semibold text-[#e7e2f0]">Путевые листы</h2><p className="text-xs text-[#9d9dab]">Все путевые листы за период</p></div>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-[#35304a]">
          <th className="text-left px-6 py-3 text-[#9d9dab] font-medium text-xs">№ Путевого</th>
          <th className="text-left px-4 py-3 text-[#9d9dab] font-medium text-xs cursor-pointer" onClick={()=>toggle("driverName")}><span className="inline-flex items-center gap-1">Водитель <ArrowUpDown className="w-3 h-3"/></span></th>
          <th className="text-left px-4 py-3 text-[#9d9dab] font-medium text-xs cursor-pointer" onClick={()=>toggle("logRouteId")}><span className="inline-flex items-center gap-1">ID Маршрута <ArrowUpDown className="w-3 h-3"/></span></th>
          <th className="text-left px-4 py-3 text-[#9d9dab] font-medium text-xs">Дата</th>
          <th className="text-right px-4 py-3 text-[#9d9dab] font-medium text-xs">Выручка</th>
          <th className="text-right px-6 py-3 text-[#9d9dab] font-medium text-xs">Штрафы</th>
        </tr></thead><tbody>{filtered.map(w=>(
          <tr key={w.id} className="border-b border-[#35304a]/50 hover:bg-[#35304a]/20 transition-colors">
            <td className="px-6 py-3 text-[#e7e2f0] font-medium">{w.id}</td>
            <td className="px-4 py-3 text-[#e7e2f0]">{w.driverName}</td>
            <td className="px-4 py-3 text-[#e7e2f0]">#{w.logRouteId}</td>
            <td className="px-4 py-3 text-[#e7e2f0]">{fmtDate(w.openDt)}</td>
            <td className="px-4 py-3 text-right text-green-500">{fmt(w.totalPrice)} ₽</td>
            <td className="px-6 py-3 text-right text-red-500">{w.fineSum>0?fmt(w.fineSum)+" ₽":"0 ₽"}</td>
          </tr>))}</tbody></table></div>
      </div>
    </div>
  );
}

function PieChart({td}:{td:{m:number;d:number;e:number;n:number}}) {
  const segs = [{label:"Утро (00-06)",pct:td.m,color:"#4ade80"},{label:"День (06-12)",pct:td.d,color:"#ba85ff"},{label:"Вечер (12-18)",pct:td.e,color:"#f59e0b"},{label:"Ночь (18-24)",pct:td.n,color:"#ef4444"}];
  let cum = 0;
  const paths = segs.map(s => { const sa = (cum/100)*360-90; cum += s.pct; const ea = (cum/100)*360-90; return {...s, sa, ea}; });
  return (<div className="flex items-center justify-center py-4"><svg viewBox="0 0 300 200" width="400" height="280">
    {paths.map((s,i)=>{ if(s.pct===0)return null; const r=70,cx=150,cy=100; const x1=cx+r*Math.cos(s.sa*Math.PI/180),y1=cy+r*Math.sin(s.sa*Math.PI/180); const x2=cx+r*Math.cos(s.ea*Math.PI/180),y2=cy+r*Math.sin(s.ea*Math.PI/180); const lg=s.pct>50?1:0; const ma=(s.sa+s.ea)/2*Math.PI/180; const lx=cx+(r+30)*Math.cos(ma),ly=cy+(r+30)*Math.sin(ma);
      return (<g key={i}><path d={"M"+cx+","+cy+" L"+x1+","+y1+" A"+r+","+r+" 0 "+lg+",1 "+x2+","+y2+" Z"} fill={s.color} opacity="0.85"/><text x={lx} y={ly} fill={s.color} fontSize="9" textAnchor="middle" dominantBaseline="middle" fontWeight="600">{s.label}: {s.pct}%</text></g>); })}
  </svg></div>);
}