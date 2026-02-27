"use client";
import { useState } from "react";
import Header from "@/components/Header";
const deliveriesData = [
  { id: "#26213027", driver: "Павлюченков Олег Евгеньевич", start: "27.02.2026, 05:05", end: "-", duration: "0ч 54мин", boxes: 84, status: "В процессе" },
  { id: "#26212863", driver: "Бычков Сергей Николаевич", start: "27.02.2026, 04:54", end: "-", duration: "1ч 4мин", boxes: 229, status: "В процессе" },
  { id: "#26212056", driver: "Нагорнов Андрей Александрович", start: "27.02.2026, 04:00", end: "-", duration: "1ч 58мин", boxes: 84, status: "В процессе" },
  { id: "#26212040", driver: "Данилов Александр Алексеевич", start: "27.02.2026, 03:59", end: "-", duration: "1ч 59мин", boxes: 139, status: "В процессе" },
  { id: "#26211816", driver: "Перепелкин Владимир Алексеевич", start: "27.02.2026, 03:58", end: "-", duration: "2ч 1мин", boxes: 140, status: "В процессе" },
];
const tabs = [{ label: "Все", count: 305 }, { label: "Открытые", count: 38 }, { label: "Закрытые", count: 267 }, { label: "С нарушением", count: 25 }];
export default function DeliveriesPage() {
  const [activeTab, setActiveTab] = useState("Все");
  return (
    <div>
      <Header title="Доставки" />
      <p className="text-gray-400 mb-6">Путевые листы за последние 7 дней</p>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4"><p className="text-gray-400 text-sm">Всего путевых</p><p className="text-2xl font-bold text-white">305</p></div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4"><p className="text-gray-400 text-sm">Завершенных</p><p className="text-2xl font-bold text-green-400">267</p></div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4"><p className="text-gray-400 text-sm">С нарушениями</p><p className="text-2xl font-bold text-red-400">25</p></div>
      </div>
      <div className="flex gap-2 mb-4">{tabs.map(t => (
        <button key={t.label} onClick={() => setActiveTab(t.label)}
          className={"px-4 py-2 rounded-lg text-sm " + (activeTab === t.label ? "bg-purple-primary text-white" : "bg-dark-card border border-dark-border text-gray-400")}>{t.label} ({t.count})</button>
      ))}</div>
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-dark-border text-gray-400">
            <th className="text-left py-3 px-4">ID</th><th className="text-left py-3 px-4">Водитель</th><th className="text-left py-3 px-4">Начало</th>
            <th className="text-left py-3 px-4">Завершение</th><th className="text-left py-3 px-4">Длительность</th><th className="text-center py-3 px-4">Коробок</th><th className="text-center py-3 px-4">Статус</th>
          </tr></thead>
          <tbody>{deliveriesData.map(d => (
            <tr key={d.id} className="border-b border-dark-border/50 table-row-hover">
              <td className="py-3 px-4 text-purple-light font-medium">{d.id}</td><td className="py-3 px-4 text-gray-200">{d.driver}</td>
              <td className="py-3 px-4 text-gray-300">{d.start}</td><td className="py-3 px-4 text-gray-300">{d.end}</td>
              <td className="py-3 px-4 text-gray-300">{d.duration}</td><td className="py-3 px-4 text-center text-gray-300">{d.boxes}</td>
              <td className="py-3 px-4 text-center"><span className="badge badge-purple">{d.status}</span></td>
            </tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}
