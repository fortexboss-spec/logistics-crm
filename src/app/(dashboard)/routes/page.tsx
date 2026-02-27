'use client';
import { useState, useEffect } from 'react';
import { Search, RefreshCw, Loader2 } from 'lucide-react';
interface WBRoute {
  route_car_id: number;
  distance: number;
  normative_liters: number;
  plan_count_departure: number;
  count_shk: number;
  count_tares: number;
  volume_ml_by_content: number;
  parking: number[];
}
interface OfficeData {
  office_id: number;
  office_name: string;
  count_shk: number;
  count_tares: number;
  total_volume_ml: number;
  routes: WBRoute[];
}
export default function RoutesPage() {
  const [offices, setOffices] = useState<OfficeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { fetchRoutes(); }, []);
  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/wb/reports/v1/last-mile');
      const json = await res.json();
      if (json.data) setOffices(json.data);
      else setError(json.error || 'Ошибка загрузки');
    } catch (e: any) { setError('Ошибка: ' + e.message); }
    finally { setLoading(false); }
  };
  const allRoutes = offices.flatMap(o => o.routes.map(r => ({ ...r, office_name: o.office_name })));
  const filtered = allRoutes.filter(r =>
    String(r.route_car_id).includes(search) || r.office_name?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e7e2f0', margin: 0 }}>Маршруты WB</h1>
          <p style={{ color: '#9d9dab', fontSize: 14, marginTop: 4 }}>Данные из WB API (Остатки последней мили)</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9d9dab' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск маршрутов..." style={{ padding: '8px 12px 8px 32px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 13, width: 220 }} />
          </div>
          <button onClick={fetchRoutes} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#ba85ff', color: '#0f051c', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, height: 36 }}>
            <RefreshCw size={16} /> Обновить
          </button>
        </div>
      </div>
      {offices.length > 0 && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {offices.map(o => (
            <div key={o.office_id} style={{ border: '1px solid #464652', borderRadius: 8, padding: '16px 20px' }}>
              <p style={{ color: '#9d9dab', fontSize: 12, margin: '0 0 4px 0' }}>{o.office_name}</p>
              <p style={{ color: '#e7e2f0', fontSize: 24, fontWeight: 700, margin: '0 0 8px 0' }}>{o.routes.length} <span style={{ fontSize: 14, fontWeight: 400, color: '#9d9dab' }}>маршрутов</span></p>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ color: '#ba85ff', fontSize: 13 }}>ШК: {o.count_shk.toLocaleString()}</span>
                <span style={{ color: '#9d9dab', fontSize: 13 }}>Тар: {o.count_tares.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 64 }}>
          <Loader2 size={32} style={{ color: '#ba85ff', margin: '0 auto 16px' }} className="animate-spin" />
          <p style={{ color: '#9d9dab' }}>Загрузка маршрутов из WB API...</p>
        </div>
      ) : error ? (
        <div style={{ border: '1px solid #ef4444', borderRadius: 8, padding: 24, textAlign: 'center' }}>
          <p style={{ color: '#ef4444' }}>{error}</p>
        </div>
      ) : (
        <div style={{ border: '1px solid #464652', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #464652' }}>
                {['Маршрут','Офис','Парковка','Число тар','Число ШК','Объем, л','Норм. выездов','Норм. объем, л','Дистанция, км'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#9d9dab' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #464652' }}>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#ba85ff', fontWeight: 600 }}>{r.route_car_id}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#e7e2f0' }}>{r.office_name}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#9d9dab' }}>{r.parking?.join(', ') || String.fromCharCode(8212)}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#e7e2f0' }}>{r.count_tares}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#e7e2f0' }}>{r.count_shk}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#e7e2f0' }}>{(r.volume_ml_by_content / 1000).toFixed(2)}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#e7e2f0' }}>{r.plan_count_departure}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#e7e2f0' }}>{r.normative_liters.toFixed(2)}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#9d9dab' }}>{r.distance.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '12px 16px', borderTop: '1px solid #464652', color: '#9d9dab', fontSize: 13 }}>
            Всего: {filtered.length} маршрутов
          </div>
        </div>
      )}
    </div>
  );
}
