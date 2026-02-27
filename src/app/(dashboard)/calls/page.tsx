"use client";
import Header from "@/components/Header";
import { Phone, Clock, CheckCircle, Loader, TrendingUp, Calendar } from "lucide-react";
const stats = [
  { label: "Запланировано", value: "0", sub: "Активных звонков", icon: Calendar },
  { label: "Всего звонков", value: "0", sub: "За все время", icon: Phone },
  { label: "Завершено", value: "0", sub: "Успешных звонков", icon: CheckCircle },
  { label: "В процессе", value: "0", sub: "Обрабатываются", icon: Loader },
  { label: "Успешность", value: "0%", sub: "Завершенных", icon: TrendingUp },
];
export default function CallsPage() {
  return (
    <div>
      <Header title="Звонки" />
      <p className="text-gray-400 mb-4">Автоматические звонки при превышении нормы ШК</p>
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
        <p className="text-yellow-400 font-medium">Звонки не подключены</p>
        <p className="text-yellow-400/70 text-sm">Для подключения необходимо настроить интеграцию с МТС Exolve.</p>
      </div>
      <div className="grid grid-cols-5 gap-4 mb-6">{stats.map(s => (
        <div key={s.label} className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">{s.label}</span><s.icon size={18} className="text-purple-light" /></div>
          <p className="text-2xl font-bold text-white">{s.value}</p><p className="text-gray-500 text-xs">{s.sub}</p>
        </div>))}</div>
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Быстрые действия</h3>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-purple-primary text-white rounded-lg flex items-center gap-2"><Phone size={16} /> Тестовый звонок</button>
          <button className="px-4 py-2.5 bg-dark-bg border border-dark-border text-gray-300 rounded-lg flex items-center gap-2"><Clock size={16} /> История звонков</button>
        </div>
      </div>
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Календарь запланированных звонков</h3>
        <div className="grid grid-cols-7 gap-1">
          {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map(d => <div key={d} className="text-center text-gray-400 text-sm py-2 font-medium">{d}</div>)}
          {Array.from({ length: 28 }, (_, i) => (
            <div key={i} className="text-center py-3 text-gray-300 hover:bg-dark-hover rounded-lg cursor-pointer">{i + 1}</div>))}
        </div>
      </div>
    </div>
  );
}
