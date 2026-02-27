"use client";
import { useState } from "react";
import Header from "@/components/Header";
import { Download } from "lucide-react";
const types = ["Все листы", "Последняя миля", "Магистраль"];
export default function WaysheetsPage() {
  const [activeType, setActiveType] = useState("Все листы");
  const [dateFrom, setDateFrom] = useState("20.02.2026");
  const [dateTo, setDateTo] = useState("27.02.2026");
  return (
    <div>
      <Header title="Расчет зарплаты" />
      <p className="text-gray-400 mb-6">Скачивание и расчет зарплаты по путевым листам из Wildberries</p>
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Выберите период и тип путевых листов</h3>
        <p className="text-gray-400 text-sm mb-2">Тип путевых листов</p>
        <div className="flex gap-2 mb-4">{types.map(t => (
          <button key={t} onClick={() => setActiveType(t)}
            className={"px-4 py-2 rounded-lg text-sm transition-colors " + (activeType === t ? "bg-purple-primary text-white" : "bg-dark-bg border border-dark-border text-gray-400 hover:text-white")}>{t}</button>
        ))}</div>
        <p className="text-gray-500 text-xs mb-4">Все типы оплаты</p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div><label className="block text-sm text-gray-400 mb-1">Дата начала</label>
            <input type="text" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-purple-primary" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Дата окончания</label>
            <input type="text" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-purple-primary" /></div>
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-primary hover:bg-purple-hover text-white rounded-lg transition-colors"><Download size={16} /> Скачать</button>
          </div>
        </div>
        <p className="text-yellow-400 text-sm">Важно: Максимальный период: 7 дней. Для каждого кабинета будет создан отдельный Excel файл.</p>
      </div>
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Как использовать:</h3>
        <div className="space-y-2 text-gray-400 text-sm">
          <p>1. Выберите тип путевых листов: Все листы / Последняя миля / Магистраль</p>
          <p>2. Выберите дату начала и окончания периода (максимум 7 дней)</p>
          <p>3. Нажмите кнопку Скачать</p>
          <p>4. Система получит путевые листы из WB API для выбранного типа</p>
          <p>5. Для каждого кабинета будет создан отдельный Excel файл</p>
          <p>6. Нажмите Скачать Excel на карточке нужного кабинета</p>
        </div>
      </div>
    </div>
  );
}
