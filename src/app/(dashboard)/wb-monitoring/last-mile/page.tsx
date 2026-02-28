'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import { RefreshCw, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Route {
  route_car_id: number;
  distance: number;
  normative_liters: number;
  plan_count_departure: number;
  count_shk: number;
  shk_last_hours: number;
  count_tares: number;
  volume_ml_by_content: number;
  parking: number[];
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
  const [search, setSearch] = useState('');
  const [countdown, setCountdown] = useState(600);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/wb-lastmile');
      const json = await res.json();
      if (json.data) {
        setOffices(json.data);
        setLastUpdate(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setCountdown(600);
      } else setError(JSON.stringify(json));
    } catch (e) { setError(String(e)); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => { if (prev <= 1) { fetchData(); return 600; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchData]);

  const allRoutes = offices.flatMap(o => (o.routes || []).map(r => ({ ...r, office_name: o.office_name })));
  const totalShk = offices.reduce((s, o) => s + o.count_shk, 0);
  const totalTares = offices.reduce((s, o) => s + o.count_tares, 0);
  const totalVol = offices.reduce((s, o) => s + (o.total_volume_ml || 0), 0);
  const maxShkRoute = allRoutes.reduce((max, r) => r.count_shk > max.count_shk ? r : max, { count_shk: 0, route_car_id: 0 } as any);
  const chartData = [...allRoutes].sort((a, b) => b.count_shk - a.count_shk).slice(0, 17).map(r => ({ name: '#' + r.route_car_id, shk: r.count_shk, vol: Math.round((r.volume_ml_by_content || 0) / 1000), norm: Math.round(r.normative_liters || 0) }));
  const filteredRoutes = allRoutes.filter(r => search === '' || String(r.route_car_id).includes(search) || (r.parking || []).join(', ').includes(search));
  const fmtMin = (s: number) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  const kpi = [
    { title: 'ЧИСЛО ТАР', value: totalTares.toLocaleString(), sub: 'единиц', color: '#16a34a' },
    { title: 'ЧИСЛО ШК', value: totalShk.toLocaleString(), sub: 'штрих-кодов', color: '#ea580c' },
    { title: 'ОБЪЁМ', value: Math.round(totalVol / 1000).toLocaleString(), sub: 'литров', color: '#2563eb' },
    { title: 'МАРШРУТОВ', value: allRoutes.length.toString(), sub: 'активных', color: '#7c3aed' },
    { title: 'МАКС. ШК', value: (maxShkRoute.count_shk || 0).toLocaleString(), sub: 'Маршрут ' + maxShkRoute.route_car_id, color: '#dc2626' },
  ];

  const pctInfo = (vol: number, norm: number) => {
    const pct = norm > 0 ? Math.round(vol / norm * 100) : 0;
    const c = pct >= 100 ? '#dc2626' : pct >= 70 ? '#f59e0b' : pct >= 50 ? '#8b5cf6' : '#6b7280';
    const bg = pct >= 100 ? '#fef2f2' : pct >= 70 ? '#fffbeb' : pct >= 50 ? '#f5f3ff' : '#f9fafb';
    return { pct, c, bg };
  };

  const cs = { card: { background: '#fff', borderRadius: '12px', padding: '20px 24px', border: '1px solid #e5e7eb' } as React.CSSProperties, chart: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' } as React.CSSProperties, ind: { width: '3px', height: '20px', background: '#7c3aed', borderRadius: '2px' } as React.CSSProperties };

  return (<div>
    <Header title="Остатки ПМ" actions={<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>{lastUpdate && (<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '13px', color: '#6b7280' }}>{'Обновление: '}<b style={{ color: '#374151' }}>{fmtMin(countdown)}</b></span><div style={{ width: '80px', height: '4px', background: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: (countdown / 600) * 100 + '%', height: '100%', background: '#7c3aed', borderRadius: '2px', transition: 'width 1s linear' }} /></div></div>)}<button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', background: '#7c3aed', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}><RefreshCw size={14} /> {loading ? 'Загрузка...' : 'Обновить'}</button></div>} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} /><span style={{ fontSize: '13px', color: '#6b7280' }}>{'Данные актуальны \u00B7 '}{offices[0]?.office_name || 'Загрузка...'}</span></div>
    {error && <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>{kpi.map(card => (<div key={card.title} style={cs.card}><div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '8px' }}>{card.title}</div><div style={{ fontSize: '28px', fontWeight: 800, color: card.color, lineHeight: 1.1, marginBottom: '4px' }}>{loading ? '...' : card.value}</div><div style={{ fontSize: '12px', color: '#9ca3af' }}>{card.sub}</div></div>))}</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
      <div style={cs.chart}><div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}><div style={cs.ind} /><h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1f2937', margin: 0 }}>{'Число ШК по маршрутам'}</h3></div><ResponsiveContainer width="100%" height={260}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} angle={-45} textAnchor="end" height={50} /><YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} /><Bar dataKey="shk" name="Число ШК" fill="#8b5cf6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
      <div style={cs.chart}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={cs.ind} /><h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1f2937', margin: 0 }}>{'Объём (л) vs Норматив (л)'}</h3></div><div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#8b5cf6' }} /><span style={{ color: '#6b7280' }}>{'Факт, л'}</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#d8b4fe' }} /><span style={{ color: '#6b7280' }}>{'Норматив, л'}</span></div></div></div><ResponsiveContainer width="100%" height={260}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} angle={-45} textAnchor="end" height={50} /><YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} /><Bar dataKey="vol" name="Факт, л" fill="#8b5cf6" radius={[4, 4, 0, 0]} /><Bar dataKey="norm" name="Норматив, л" fill="#d8b4fe" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
    </div>
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={cs.ind} /><h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1f2937', margin: 0 }}>{'Детали по маршрутам'}</h3></div><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ position: 'relative' }}><Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} /><input placeholder="Поиск: маршрут, парковка..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '8px 12px 8px 32px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', color: '#374151', background: '#fff', outline: 'none', width: '220px' }} /></div><span style={{ fontSize: '12px', color: '#7c3aed', fontWeight: 600, padding: '4px 12px', background: 'rgba(124,58,237,0.08)', borderRadius: '20px', border: '1px solid rgba(124,58,237,0.2)' }}>{filteredRoutes.length}{' маршрутов'}</span></div></div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead><tr style={{ borderBottom: '1px solid #e5e7eb' }}>{['МАРШРУТ','ПАРКОВКА','ТАРЫ','ШК','ШК ПОСЛ.Ч.','ОБЪЁМ, Л','НОРМ. ОБЪЁМ, Л','% ЗАПОЛН.','ВЫЕЗДЫ','ДИСТАНЦИЯ, КМ','ТИП'].map(h => (<th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#9ca3af', fontWeight: 600, fontSize: '11px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>))}</tr></thead>
        <tbody>{loading ? (<tr><td colSpan={11} style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>{'Загрузка...'}</td></tr>) : filteredRoutes.length === 0 ? (<tr><td colSpan={11} style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>{'Нет данных'}</td></tr>) : filteredRoutes.map((r, i) => { const vol = Math.round((r.volume_ml_by_content || 0) / 1000); const norm = Math.round(r.normative_liters || 0); const p = pctInfo(vol, norm); return (<tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }} onMouseEnter={(e: any) => e.currentTarget.style.background = '#faf5ff'} onMouseLeave={(e: any) => e.currentTarget.style.background = 'transparent'}><td style={{ padding: '12px 14px', color: '#7c3aed', fontWeight: 700 }}>{r.route_car_id}</td><td style={{ padding: '12px 14px', color: '#6b7280', fontSize: '12px' }}>{r.parking?.join(', ') || '\u2014'}</td><td style={{ padding: '12px 14px', color: '#374151' }}>{r.count_tares}</td><td style={{ padding: '12px 14px', color: '#374151', fontWeight: 600 }}>{r.count_shk.toLocaleString()}</td><td style={{ padding: '12px 14px', color: '#374151' }}>{r.shk_last_hours || 0}</td><td style={{ padding: '12px 14px', color: '#374151' }}>{vol.toLocaleString()}</td><td style={{ padding: '12px 14px', color: '#374151' }}>{norm.toLocaleString()}</td><td style={{ padding: '12px 14px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '80px', height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}><div style={{ width: Math.min(p.pct, 100) + '%', height: '100%', background: p.pct >= 100 ? '#dc2626' : '#8b5cf6', borderRadius: '3px' }} /></div><span style={{ color: p.c, fontSize: '12px', fontWeight: 700, minWidth: '40px', padding: '2px 8px', background: p.bg, borderRadius: '4px', textAlign: 'center' }}>{p.pct}{'%'}</span></div></td><td style={{ padding: '12px 14px', color: '#374151', textAlign: 'center' }}>{r.plan_count_departure || 0}</td><td style={{ padding: '12px 14px', color: '#374151' }}>{(r.distance || 0).toFixed(3)}</td><td style={{ padding: '12px 14px' }}><span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 500, padding: '3px 10px', background: '#f5f3ff', borderRadius: '4px' }}>{'Автомобильный'}</span></td></tr>); })}</tbody>
      </table>
    </div>
    <div style={{ textAlign: 'center', padding: '16px', fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>{'WB Logistics \u00B7 Остатки ПМ \u00B7 API: logistics.wb.ru'}</div>
  </div>);
}
