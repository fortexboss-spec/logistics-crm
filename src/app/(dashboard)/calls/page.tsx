'use client';
import { useState } from 'react';
import { Phone, Calendar, Clock, CheckCircle, AlertTriangle, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
export default function CallsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));
  const stats = [
    { label: 'Запланировано', value: '0', sub: 'Активных звонков', icon: Calendar, color: '#ba85ff' },
    { label: 'Всего звонков', value: '0', sub: 'За все время', icon: Phone, color: '#ba85ff' },
    { label: 'Завершено', value: '0', sub: 'Успешных звонков', icon: CheckCircle, color: '#22c55e' },
    { label: 'В процессе', value: '0', sub: 'Обрабатываются', icon: Clock, color: '#3b82f6' },
    { label: 'Успешность', value: '0%', sub: 'Завершенных', icon: TrendingUp, color: '#22c55e' },
  ];
  const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  const dayNames = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = (firstDay.getDay() + 6) % 7;
    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(i);
    return days;
  };
  const days = getDaysInMonth(currentMonth);
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const today = () => setCurrentMonth(new Date(2026, 1, 1));
  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Phone size={28} style={{ color: '#ba85ff' }} />
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e7e2f0', margin: 0 }}>Звонки</h1>
          <p style={{ color: '#9d9dab', fontSize: 14, marginTop: 2 }}>Автоматические звонки при превышении нормы ШК</p>
        </div>
      </div>
      <div style={{ border: '1px solid #ef4444', borderRadius: 8, padding: '12px 20px', marginBottom: 24, background: 'rgba(239,68,68,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={16} style={{ color: '#fbbf24' }} />
          <div>
            <p style={{ color: '#e7e2f0', fontSize: 14, fontWeight: 600, margin: 0 }}>Звонки не подключены</p>
            <p style={{ color: '#9d9dab', fontSize: 13, margin: 0 }}>Модуль автоматических звонков отключен для данной инсталляции. Для подключения необходимо настроить интеграцию с МТС Exolve.</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ border: '1px solid #464652', borderRadius: 8, padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ color: '#9d9dab', fontSize: 13 }}>{s.label}</span>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <p style={{ color: '#e7e2f0', fontSize: 28, fontWeight: 700, margin: '0 0 4px 0' }}>{s.value}</p>
            <p style={{ color: '#9d9dab', fontSize: 12, margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>
      <div style={{ border: '1px solid #464652', borderRadius: 8, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#e7e2f0', margin: '0 0 4px 0' }}>Быстрые действия</h3>
        <p style={{ color: '#9d9dab', fontSize: 13, margin: '0 0 16px 0' }}>Создание звонков и просмотр истории</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#ba85ff', color: '#0f051c', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Phone size={14} /> Тестовый звонок
          </button>
          <button style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #464652', background: 'transparent', color: '#e7e2f0', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={14} /> История звонков
          </button>
        </div>
      </div>
      <div style={{ border: '1px solid #464652', borderRadius: 8, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#e7e2f0', margin: '0 0 4px 0' }}>Календарь запланированных звонков</h3>
        <p style={{ color: '#9d9dab', fontSize: 13, margin: '0 0 20px 0' }}>Нажмите на день чтобы запланировать звонок. Звонок сработает автоматически когда ШК на маршруте превысит норму.</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={prevMonth} style={{ background: 'none', border: '1px solid #464652', borderRadius: 6, padding: '4px 8px', color: '#e7e2f0', cursor: 'pointer' }}><ChevronLeft size={16}/></button>
            <button onClick={nextMonth} style={{ background: 'none', border: '1px solid #464652', borderRadius: 6, padding: '4px 8px', color: '#e7e2f0', cursor: 'pointer' }}><ChevronRight size={16}/></button>
            <span style={{ color: '#e7e2f0', fontSize: 16, fontWeight: 600, marginLeft: 8 }}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
          </div>
          <button onClick={today} style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #464652', background: 'transparent', color: '#e7e2f0', fontSize: 13, cursor: 'pointer' }}>Сегодня</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, border: '1px solid #464652', borderRadius: 8, overflow: 'hidden' }}>
          {dayNames.map(d => (
            <div key={d} style={{ padding: '10px 12px', textAlign: 'center', fontSize: 13, fontWeight: 500, color: '#9d9dab', background: '#26262a', borderBottom: '1px solid #464652' }}>{d}</div>
          ))}
          {days.map((d, i) => (
            <div key={i} style={{ padding: '12px', minHeight: 70, background: d === 27 ? 'rgba(186,133,255,0.1)' : 'transparent', borderBottom: '1px solid #464652', borderRight: (i + 1) % 7 !== 0 ? '1px solid #464652' : 'none' }}>
              {d && <span style={{ color: d === 27 ? '#ba85ff' : '#e7e2f0', fontSize: 13 }}>{d}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
