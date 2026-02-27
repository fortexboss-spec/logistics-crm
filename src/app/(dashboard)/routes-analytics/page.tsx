'use client';
import { useState } from 'react';
import { RefreshCw, Download } from 'lucide-react';
export default function RoutesAnalyticsPage() {
  const [dateFrom, setDateFrom] = useState('2026-02-20');
  const [dateTo, setDateTo] = useState('2026-02-27');
  const [route, setRoute] = useState('');
  const [loaded, setLoaded] = useState(false);
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e7e2f0', margin: 0 }}>Аналитика маршрутов</h1>
        <p style={{ color: '#9d9dab', fontSize: 14, marginTop: 4 }}>Детальная аналитика по маршрутам Wildberries (данные из WB API)</p>
      </div>
      <div style={{ border: '1px solid #464652', borderRadius: 8, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#e7e2f0', margin: '0 0 20px 0' }}>Фильтры</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Дата начала</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Дата окончания</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Маршрут</label>
            <select value={route} onChange={e => setRoute(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#9d9dab', fontSize: 14 }}>
              <option value="">Сначала загрузите данные</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setLoaded(true)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#ba85ff', color: '#0f051c', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} /> Обновить
          </button>
          <button style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #464652', background: 'transparent', color: '#9d9dab', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={14} /> Экспорт в Excel
          </button>
        </div>
      </div>
      {!loaded && (
        <div style={{ border: '1px solid #464652', borderRadius: 8, padding: 64, textAlign: 'center' }}>
          <RefreshCw size={48} style={{ color: '#464652', marginBottom: 16 }} />
          <p style={{ color: '#e7e2f0', fontWeight: 600, fontSize: 16 }}>Нет данных</p>
          <p style={{ color: '#9d9dab', fontSize: 13 }}>Нажмите "Обновить" для загрузки аналитики маршрутов</p>
        </div>
      )}
      {loaded && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ border: '1px solid #464652', borderRadius: 8, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#e7e2f0', margin: '0 0 16px 0' }}>Статистика по маршрутам</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'rgba(58,58,66,0.3)', borderRadius: 8, padding: 16 }}>
                <p style={{ color: '#9d9dab', fontSize: 12, margin: '0 0 4px 0' }}>Всего маршрутов</p>
                <p style={{ color: '#e7e2f0', fontSize: 24, fontWeight: 700, margin: 0 }}>0</p>
              </div>
              <div style={{ background: 'rgba(58,58,66,0.3)', borderRadius: 8, padding: 16 }}>
                <p style={{ color: '#9d9dab', fontSize: 12, margin: '0 0 4px 0' }}>Среднее время</p>
                <p style={{ color: '#e7e2f0', fontSize: 24, fontWeight: 700, margin: 0 }}>—</p>
              </div>
              <div style={{ background: 'rgba(58,58,66,0.3)', borderRadius: 8, padding: 16 }}>
                <p style={{ color: '#9d9dab', fontSize: 12, margin: '0 0 4px 0' }}>Всего коробок</p>
                <p style={{ color: '#e7e2f0', fontSize: 24, fontWeight: 700, margin: 0 }}>0</p>
              </div>
              <div style={{ background: 'rgba(58,58,66,0.3)', borderRadius: 8, padding: 16 }}>
                <p style={{ color: '#9d9dab', fontSize: 12, margin: '0 0 4px 0' }}>Эффективность</p>
                <p style={{ color: '#e7e2f0', fontSize: 24, fontWeight: 700, margin: 0 }}>—</p>
              </div>
            </div>
          </div>
          <div style={{ border: '1px solid #464652', borderRadius: 8, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#e7e2f0', margin: '0 0 16px 0' }}>Топ маршрутов</h3>
            <p style={{ color: '#9d9dab', fontSize: 13 }}>Данные загружаются из WB API...</p>
          </div>
        </div>
      )}
    </div>
  );
}
