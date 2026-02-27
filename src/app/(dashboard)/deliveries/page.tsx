'use client';
import { useState } from 'react';
import { Truck } from 'lucide-react';
interface Delivery {
  id: string;
  driver: string;
  start: string;
  end: string;
  duration: string;
  boxes: number;
  sum: string;
  status: string;
}
const mockDeliveries: Delivery[] = [
  { id: '#26219243', driver: 'Расулов Никад Расул оглы', start: '27.02.2026, 10:55', end: '-', duration: '0ч 14мин', boxes: 52, sum: '—', status: 'В процессе' },
  { id: '#26217687', driver: 'Махоткин Иван Васильевич', start: '27.02.2026, 09:34', end: '-', duration: '1ч 35мин', boxes: 140, sum: '—', status: 'В процессе' },
  { id: '#26217575', driver: 'Павлюченков Олег Евгеньевич', start: '27.02.2026, 09:26', end: '-', duration: '1ч 42мин', boxes: 114, sum: '—', status: 'В процессе' },
  { id: '#26217550', driver: 'Жеребцов Михаил Валерьевич', start: '27.02.2026, 09:25', end: '-', duration: '1ч 44мин', boxes: 100, sum: '—', status: 'В процессе' },
  { id: '#26217438', driver: 'Фалък Дмитрий Владимирович', start: '27.02.2026, 09:19', end: '-', duration: '1ч 50мин', boxes: 139, sum: '—', status: 'В процессе' },
  { id: '#26215936', driver: 'Коуров Владислав Валерьевич', start: '27.02.2026, 07:55', end: '-', duration: '3ч 13мин', boxes: 253, sum: '—', status: 'В процессе' },
  { id: '#26215912', driver: 'Иванов Станислав Александрович', start: '27.02.2026, 07:53', end: '-', duration: '3ч 15мин', boxes: 179, sum: '—', status: 'В процессе' },
  { id: '#26215495', driver: 'Гребнев Дмитрий Денисович', start: '27.02.2026, 07:28', end: '-', duration: '3ч 40мин', boxes: 86, sum: '—', status: 'В процессе' },
];
export default function DeliveriesPage() {
  const [tab, setTab] = useState('all');
  const tabs = [
    { key: 'all', label: 'Все (316)' },
    { key: 'open', label: 'Открытые (37)' },
    { key: 'closed', label: 'Закрытые (279)' },
    { key: 'violation', label: 'С нарушением (30)' },
  ];
  const topViolators = [
    { name: 'Павлюченков Олег Евгеньевич', count: 4 },
    { name: 'Иванов Станислав Александро...', count: 2 },
    { name: 'Данилов Александр Алексеевич', count: 2 },
  ];
  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Truck size={28} style={{ color: '#ba85ff' }} />
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e7e2f0', margin: 0 }}>Доставки</h1>
          <p style={{ color: '#9d9dab', fontSize: 14, marginTop: 2 }}>Путевые листы за последние 7 дней</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ border: '1px solid #464652', borderRadius: 8, padding: '20px 24px' }}>
          <p style={{ color: '#9d9dab', fontSize: 13, margin: '0 0 8px 0' }}>Всего путевых</p>
          <p style={{ color: '#e7e2f0', fontSize: 32, fontWeight: 700, margin: 0 }}>316</p>
        </div>
        <div style={{ border: '1px solid #464652', borderRadius: 8, padding: '20px 24px' }}>
          <p style={{ color: '#9d9dab', fontSize: 13, margin: '0 0 8px 0' }}>Завершенных</p>
          <p style={{ color: '#ba85ff', fontSize: 32, fontWeight: 700, margin: 0 }}>279</p>
        </div>
        <div style={{ border: '1px solid #464652', borderRadius: 8, padding: '20px 24px' }}>
          <p style={{ color: '#9d9dab', fontSize: 13, margin: '0 0 8px 0' }}>С нарушениями</p>
          <p style={{ color: '#ef4444', fontSize: 32, fontWeight: 700, margin: 0 }}>30</p>
        </div>
        <div style={{ border: '1px solid #464652', borderRadius: 8, padding: '20px 24px' }}>
          <p style={{ color: '#9d9dab', fontSize: 13, margin: '0 0 8px 0' }}>Топ водителей с нарушениями</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {topViolators.map((v, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#e7e2f0', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{v.name}</span>
                <span style={{ background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{v.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '8px 16px', borderRadius: 8, border: tab === t.key ? 'none' : '1px solid #464652', background: tab === t.key ? '#ba85ff' : 'transparent', color: tab === t.key ? '#0f051c' : '#e7e2f0', fontSize: 13, fontWeight: tab === t.key ? 600 : 400, cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ border: '1px solid #464652', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #464652' }}>
              {['ID','Водитель','Начало','Завершение','Длительность','Коробок','Сумма','Статус'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#9d9dab' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockDeliveries.map((d, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #464652' }}>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#ba85ff', fontWeight: 600 }}>{d.id}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#e7e2f0' }}>{d.driver}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#9d9dab' }}>{d.start}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#9d9dab' }}>{d.end}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#e7e2f0', fontWeight: 600 }}>{d.duration}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#e7e2f0' }}>{d.boxes}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#ba85ff' }}>{d.sum}</td>
                <td style={{ padding: '14px 16px', fontSize: 14 }}>
                  <span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: '#392b4c', color: '#ba85ff', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}></span> {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
