'use client';
import { useState } from 'react';
import { Package, Search, Download } from 'lucide-react';
export default function BoxesPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [type, setType] = useState('all');
  const [searched, setSearched] = useState(false);
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e7e2f0', margin: 0 }}>Коробки</h1>
        <p style={{ color: '#9d9dab', fontSize: 14, marginTop: 4 }}>Просмотр и анализ претензий, браков и утерь по коробкам WB</p>
      </div>
      <div style={{ border: '1px solid #464652', borderRadius: 8, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#e7e2f0', margin: '0 0 4px 0' }}>Фильтры поиска</h3>
        <p style={{ color: '#9d9dab', fontSize: 13, margin: '0 0 20px 0' }}>Выберите период и тип претензий для поиска</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Дата начала</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} placeholder="Выберите дату" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Дата окончания</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} placeholder="Выберите дату" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Тип</label>
            <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }}>
              <option value="all">Все типы</option>
              <option value="claim">Претензии</option>
              <option value="defect">Браки</option>
              <option value="loss">Утери</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setSearched(true)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#ba85ff', color: '#0f051c', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Search size={14} /> Поиск
          </button>
          <button style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #464652', background: 'transparent', color: '#9d9dab', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={14} /> Скачать Excel
          </button>
        </div>
      </div>
      <div style={{ border: '1px solid #464652', borderRadius: 8, padding: 48, textAlign: 'center' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#e7e2f0', margin: '0 0 4px 0' }}>Список коробок</h3>
        <p style={{ color: '#9d9dab', fontSize: 13, marginBottom: 32 }}>Выполните поиск для отображения данных</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Package size={48} style={{ color: '#464652' }} />
          <p style={{ color: '#e7e2f0', fontWeight: 600 }}>Нет данных</p>
          <p style={{ color: '#9d9dab', fontSize: 13 }}>Выберите период и нажмите "Поиск" для отображения списка коробок.</p>
        </div>
      </div>
    </div>
  );
}
