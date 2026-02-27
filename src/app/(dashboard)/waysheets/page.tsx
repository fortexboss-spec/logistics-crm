'use client';
import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
export default function WaysheetsPage() {
  const [sheetType, setSheetType] = useState('all');
  const [dateFrom, setDateFrom] = useState('2026-02-20');
  const [dateTo, setDateTo] = useState('2026-02-27');
  const types = [
    { key: 'all', label: 'Все листы' },
    { key: 'lastmile', label: 'Последняя миля' },
    { key: 'trunk', label: 'Магистраль' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FileText size={24} style={{ color: '#ba85ff' }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e7e2f0', margin: 0 }}>Расчет зарплаты</h1>
        </div>
      </div>
      <p style={{ color: '#9d9dab', fontSize: 14, marginTop: -16, marginBottom: 24 }}>Скачивание и расчет зарплаты по путевым листам из Wildberries</p>
      <div style={{ border: '1px solid #464652', borderRadius: 8, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <FileText size={18} style={{ color: '#ba85ff' }} />
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#e7e2f0', margin: 0 }}>Выберите период и тип путевых листов</h3>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 8, display: 'block' }}>Тип путевых листов</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {types.map(t => (
              <button key={t.key} onClick={() => setSheetType(t.key)} style={{ padding: '8px 20px', borderRadius: 8, border: sheetType === t.key ? 'none' : '1px solid #464652', background: sheetType === t.key ? '#ba85ff' : 'transparent', color: sheetType === t.key ? '#0f051c' : '#e7e2f0', fontSize: 13, fontWeight: sheetType === t.key ? 600 : 400, cursor: 'pointer' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <p style={{ color: '#9d9dab', fontSize: 12, marginBottom: 16 }}>Все типы оплаты</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Дата начала</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Дата окончания</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }} />
          </div>
          <button style={{ padding: '10px 32px', borderRadius: 8, border: 'none', background: '#ba85ff', color: '#0f051c', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, height: 42 }}>
            <Download size={16} /> Скачать
          </button>
        </div>
        <p style={{ color: '#fbbf24', fontSize: 12, marginTop: 12 }}>
          <strong>Важно:</strong> Максимальный период: 7 дней. Для каждого кабинета будет создан отдельный Excel файл.
        </p>
      </div>
      <div style={{ border: '1px solid #464652', borderRadius: 8, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#e7e2f0', margin: '0 0 16px 0' }}>Как использовать:</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'Выберите тип путевых листов: Все листы / Последняя миля / Магистраль',
            'Выберите дату начала и окончания периода (максимум 7 дней)',
            'Нажмите кнопку "Скачать"',
            'Система получит путевые листы из WB API для выбранного типа',
            'Для каждого кабинета будет создан отдельный Excel файл',
            'Нажмите "Скачать Excel" на карточке нужного кабинета',
          ].map((text, i) => (
            <p key={i} style={{ color: '#9d9dab', fontSize: 13, margin: 0 }}>{i + 1}. {text}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
