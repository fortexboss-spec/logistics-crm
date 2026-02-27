"use client";
import { useState } from "react";
import Header from "@/components/Header";
import { Search, Download, Package } from "lucide-react";
export default function BoxesPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  return (
    <div>
      <Header title="Коробки" />
      <p className="text-gray-400 mb-6">Просмотр и анализ претензий, браков и утерь по коробкам WB</p>
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Фильтры поиска</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div><label className="block text-sm text-gray-400 mb-1">Дата начала</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Дата окончания</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Тип</label>
            <select className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white">
              <option>Все типы</option><option>Брак</option><option>Утеря</option><option>Претензия</option></select></div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-primary text-white rounded-lg"><Search size={16} /> Поиск</button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-dark-bg border border-dark-border text-gray-300 rounded-lg"><Download size={16} /> Скачать Excel</button>
        </div>
      </div>
      <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
        <Package size={48} className="mx-auto text-gray-600 mb-4" />
        <h3 className="text-white text-lg mb-2">Нет данных</h3>
        <p className="text-gray-400">Выберите период и нажмите Поиск</p>
      </div>
    </div>
  );
}
