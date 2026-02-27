"use client";
import { useState } from "react";
import Header from "@/components/Header";
import { RefreshCw, Download } from "lucide-react";
export default function RoutesAnalyticsPage() {
  const [dateFrom, setDateFrom] = useState("20.02.2026");
  const [dateTo, setDateTo] = useState("27.02.2026");
  return (
    <div>
      <Header title="Аналитика маршрутов" />
      <p className="text-gray-400 mb-6">Детальная аналитика по маршрутам Wildberries (данные из WB API)</p>
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Фильтры</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div><label className="block text-sm text-gray-400 mb-1">Дата начала</label>
            <input type="text" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-purple-primary" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Дата окончания</label>
            <input type="text" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-purple-primary" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Маршрут</label>
            <select className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-gray-500 focus:outline-none focus:border-purple-primary">
              <option>Сначала загрузите данные</option>
            </select></div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-primary hover:bg-purple-hover text-white rounded-lg transition-colors"><RefreshCw size={16} /> Обновить</button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-dark-bg border border-dark-border text-gray-300 hover:text-white rounded-lg transition-colors"><Download size={16} /> Экспорт в Excel</button>
        </div>
      </div>
    </div>
  );
}
