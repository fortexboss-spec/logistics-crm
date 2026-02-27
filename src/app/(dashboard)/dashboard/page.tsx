"use client";
import { useState } from "react";
import Header from "@/components/Header";
import { RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
const chartData = [
  { date: "14 фев.", waysheets: 650000, fines: 75000, defects: 80, income: 575000 },
  { date: "15 фев.", waysheets: 720000, fines: 82000, defects: 210, income: 638000 },
  { date: "16 фев.", waysheets: 580000, fines: 60000, defects: 195, income: 520000 },
  { date: "17 фев.", waysheets: 310000, fines: 45000, defects: 65, income: 265000 },
  { date: "18 фев.", waysheets: 490000, fines: 55000, defects: 230, income: 435000 },
  { date: "19 фев.", waysheets: 550000, fines: 70000, defects: 220, income: 480000 },
  { date: "20 фев.", waysheets: 620000, fines: 78000, defects: 50, income: 542000 },
  { date: "21 фев.", waysheets: 680000, fines: 85000, defects: 210, income: 595000 },
  { date: "22 фев.", waysheets: 700000, fines: 90000, defects: 240, income: 610000 },
  { date: "23 фев.", waysheets: 530000, fines: 65000, defects: 195, income: 465000 },
  { date: "24 фев.", waysheets: 600000, fines: 72000, defects: 75, income: 528000 },
  { date: "25 фев.", waysheets: 750000, fines: 88000, defects: 220, income: 662000 },
  { date: "26 фев.", waysheets: 480000, fines: 50000, defects: 110, income: 430000 },
  { date: "27 фев.", waysheets: 350000, fines: 15000, defects: 85, income: 185000 },
];
const topProblematic = [
  { name: "Тимофеичев Иван Александрович", defects: 43, waysheets: 16, pct: "268.8%" },
  { name: "Кравченко Александр Николаевич", defects: 43, waysheets: 20, pct: "215%" },
  { name: "Шемякин Виталий Александрович", defects: 39, waysheets: 13, pct: "300%" },
  { name: "Павлюченков Олег Евгеньевич", defects: 36, waysheets: 19, pct: "189.5%" },
  { name: "Иванов Станислав Александрович", defects: 35, waysheets: 12, pct: "291.7%" },
];
const topIncome = [
  { name: "Олейник Илья Андреевич", waysheets: 9, income: "353 498", fines: "14 351" },
  { name: "Аланго Дмитрий Евгеньевич", waysheets: 8, income: "317 993", fines: "10 324" },
  { name: "Крылов Роман Дмитриевич", waysheets: 8, income: "311 792", fines: "15 416" },
  { name: "Левин Артём Андреевич", waysheets: 8, income: "309 531", fines: "20 210" },
  { name: "Малышев Данил Владимирович", waysheets: 6, income: "246 686", fines: "37 009" },
];
function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5">
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{subtitle}</p>
      {children}
    </div>
  );
}
export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false);
  const fmt = (v: number) => {
    if (v >= 1000000) return (v / 1000000).toFixed(1) + "M";
    if (v >= 1000) return (v / 1000).toFixed(0) + "k";
    return String(v);
  };
  return (
    <div>
      <Header title="Dashboard" />
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400">Статистика по путевым листам и бракам за последние 14 дней</p>
        <button onClick={() => setRefreshing(!refreshing)}
          className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-gray-300 hover:text-white transition-colors">
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Обновить
        </button>
      </div>
      <h2 className="text-xl font-bold text-white mb-4">Графики за неделю</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <ChartCard title="Сумма путевых листов" subtitle="Общая стоимость закрытых путевых за неделю">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} /><YAxis stroke="#64748b" fontSize={12} tickFormatter={fmt} />
              <Tooltip contentStyle={{ background: "#1a2235", border: "1px solid #2a3548", borderRadius: "8px", color: "#e2e8f0" }} />
              <Line type="monotone" dataKey="waysheets" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6", r: 4 }} /></LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Штрафы" subtitle="Сумма штрафов по путевым листам за неделю">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} /><YAxis stroke="#64748b" fontSize={12} tickFormatter={fmt} />
              <Tooltip contentStyle={{ background: "#1a2235", border: "1px solid #2a3548", borderRadius: "8px", color: "#e2e8f0" }} />
              <Line type="monotone" dataKey="fines" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 4 }} /></LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Браки" subtitle="Количество браков по дням за неделю">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} /><YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: "#1a2235", border: "1px solid #2a3548", borderRadius: "8px", color: "#e2e8f0" }} />
              <Line type="monotone" dataKey="defects" stroke="#f97316" strokeWidth={2} dot={{ fill: "#f97316", r: 4 }} /></LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Доходы (путевые - штрафы)" subtitle="Чистый доход по дням за неделю">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} /><YAxis stroke="#64748b" fontSize={12} tickFormatter={fmt} />
              <Tooltip contentStyle={{ background: "#1a2235", border: "1px solid #2a3548", borderRadius: "8px", color: "#e2e8f0" }} />
              <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 4 }} /></LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <h2 className="text-xl font-bold text-white mb-4">Топ водителей</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <h3 className="text-white font-semibold mb-1">Топ-10 проблемных водителей</h3>
          <p className="text-gray-400 text-sm mb-4">Водители с наибольшим количеством браков за неделю</p>
          <table className="w-full text-sm">
            <thead><tr className="text-gray-400 border-b border-dark-border">
              <th className="text-left py-2 px-2">No</th><th className="text-left py-2">Водитель</th><th className="text-center py-2">Браков</th><th className="text-center py-2">Путевых</th><th className="text-center py-2">% браков</th>
            </tr></thead>
            <tbody>{topProblematic.map((d, i) => (
              <tr key={i} className="border-b border-dark-border/50 table-row-hover">
                <td className="py-2.5 px-2 text-white font-bold">{i + 1}</td>
                <td className="py-2.5 text-gray-200">{d.name}</td>
                <td className="py-2.5 text-center"><span className="badge badge-red">{d.defects}</span></td>
                <td className="py-2.5 text-center text-gray-300">{d.waysheets}</td>
                <td className="py-2.5 text-center"><span className="badge badge-yellow">{d.pct}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <h3 className="text-white font-semibold mb-1">Топ-10 водителей по доходу</h3>
          <p className="text-gray-400 text-sm mb-4">Водители с наибольшим чистым доходом за неделю</p>
          <table className="w-full text-sm">
            <thead><tr className="text-gray-400 border-b border-dark-border">
              <th className="text-left py-2 px-2">No</th><th className="text-left py-2">Водитель</th><th className="text-center py-2">Путевых</th><th className="text-right py-2 pr-2">Доход</th>
            </tr></thead>
            <tbody>{topIncome.map((d, i) => (
              <tr key={i} className="border-b border-dark-border/50 table-row-hover">
                <td className="py-2.5 px-2 text-white font-bold">{i + 1}</td>
                <td className="py-2.5 text-gray-200">{d.name}</td>
                <td className="py-2.5 text-center text-gray-300">{d.waysheets}</td>
                <td className="py-2.5 text-right pr-2"><span className="text-green-400 font-semibold">{d.income} R</span><br/><span className="text-xs text-gray-500">штрафы: {d.fines} R</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
