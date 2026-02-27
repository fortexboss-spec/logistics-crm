"use client";
import { useState, useEffect } from "react";
import { Loader2, Plus, Pencil, Trash2, Eye } from "lucide-react";
interface Vehicle {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  fuelType: string;
  tankCapacity: number;
  year: number;
  averageConsumption: number;
  initialMileage: number;
  status: string;
  driverId: number | null;
  driver?: { id: number; fullName: string; vehicleNumber: string | null } | null;
}
interface DriverOption { id: number; fullName: string; }
const emptyVehicle = {
  licensePlate: "", brand: "Неизвестно", model: "Неизвестно",
  fuelType: "diesel", tankCapacity: 60, year: 2020,
  averageConsumption: 10, initialMileage: 0, status: "active",
  driverId: null as number | null,
};
export default function VehiclesPage() {
  const [items, setItems] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(emptyVehicle);
  const [driversList, setDriversList] = useState<DriverOption[]>([]);
  const [search, setSearch] = useState("");
  const load = () =>
    fetch("/api/vehicles").then((r) => r.json()).then((d) => { setItems(d); setLoading(false); });
  useEffect(() => {
    load();
    fetch("/api/drivers").then((r) => r.json()).then(setDriversList);
  }, []);
  const filtered = items.filter((v) => {
    const q = search.toLowerCase();
    return v.licensePlate.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) || (v.driver?.fullName || "").toLowerCase().includes(q);
  });
  const openAdd = () => { setEditing(null); setForm(emptyVehicle); setShowModal(true); };
  const openEdit = (v: Vehicle) => {
    setEditing(v);
    setForm({
      licensePlate: v.licensePlate, brand: v.brand, model: v.model,
      fuelType: v.fuelType, tankCapacity: v.tankCapacity, year: v.year,
      averageConsumption: v.averageConsumption, initialMileage: v.initialMileage,
      status: v.status, driverId: v.driverId,
    });
    setShowModal(true);
  };
  const save = async () => {
    const url = editing ? `/api/vehicles/${editing.id}` : "/api/vehicles";
    await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form, driverId: form.driverId ? Number(form.driverId) : null,
        tankCapacity: Number(form.tankCapacity), year: Number(form.year),
        averageConsumption: Number(form.averageConsumption), initialMileage: Number(form.initialMileage),
      }),
    });
    setShowModal(false);
    load();
  };
  const remove = async (id: number) => {
    if (!confirm("Удалить транспорт?")) return;
    await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    load();
  };
  const fuelLabel: Record<string, string> = { diesel: "Дизель", petrol: "Бензин", gas: "Газ", electric: "Электро" };
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#ba85ff" }} />
    </div>
  );
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "#e7e2f0" }}>
          <span style={{ fontSize: 20, opacity: 0.6 }}>&#9636;</span> Автопарк
        </h1>
        <div className="flex items-center gap-4">
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9d9dab" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Поиск по номеру, марке, модели, водителю..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: "rgba(30,25,40,0.3)", color: "#e7e2f0", border: "1px solid #35304a", borderRadius: 8, padding: "8px 12px 8px 36px", fontSize: 14, width: 400, height: 36, outline: "none" }} />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 text-sm font-medium"
            style={{ background: "#ba85ff", color: "#0f051c", borderRadius: 8, padding: "8px 12px", border: "none" }}>
            <Plus className="w-4 h-4" /> Добавить автомобиль
          </button>
        </div>
      </div>
      <table className="w-full text-sm" style={{ color: "#e7e2f0", borderCollapse: "separate", borderSpacing: 0 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #35304a" }}>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>Гос номер</th>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>Водитель</th>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>Тип топлива</th>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>Объем бака</th>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>Год выпуска</th>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>Статус</th>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((v) => (
            <tr key={v.id} style={{ borderBottom: "1px solid #35304a", height: 52 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1f1d2b")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
              <td style={{ padding: "8px", fontWeight: 500 }}>{v.licensePlate}</td>
              <td style={{ padding: "8px" }}>{v.driver?.fullName || "—"}</td>
              <td style={{ padding: "8px" }}>{fuelLabel[v.fuelType] || v.fuelType}</td>
              <td style={{ padding: "8px" }}>{v.tankCapacity} л</td>
              <td style={{ padding: "8px" }}>{v.year}</td>
              <td style={{ padding: "8px" }}>
                <span style={{ background: "#ba85ff", color: "#0f051c", padding: "2px 8px", borderRadius: 8, fontSize: 12, fontWeight: 500 }}>
                  {v.status === "active" ? "Активен" : "Не активен"}
                </span>
              </td>
              <td style={{ padding: "8px" }}>
                <div className="flex items-center gap-3">
                  <button className="hover:opacity-80"><Eye className="w-5 h-5" style={{ color: "#9d9dab" }} /></button>
                  <button onClick={() => openEdit(v)} className="hover:opacity-80"><Pencil className="w-5 h-5" style={{ color: "#9d9dab" }} /></button>
                  <button onClick={() => remove(v.id)} className="hover:opacity-80"><Trash2 className="w-5 h-5" style={{ color: "#9d9dab" }} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="rounded-lg p-6 w-full max-w-lg" style={{ background: "#26262a", border: "1px solid #464652" }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: "#e7e2f0" }}>
              {editing ? "Редактировать" : "Добавить"} автомобиль
            </h2>
            <div className="space-y-3">
              <input placeholder="Гос номер" value={form.licensePlate}
                onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }} />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Марка" value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="px-3 py-2 rounded text-sm"
                  style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }} />
                <input placeholder="Модель" value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className="px-3 py-2 rounded text-sm"
                  style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }} />
              </div>
              <select value={form.driverId || ""}
                onChange={(e) => setForm({ ...form, driverId: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }}>
                <option value="">Водитель...</option>
                {driversList.map((d) => <option key={d.id} value={d.id}>{d.fullName}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.fuelType}
                  onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                  className="px-3 py-2 rounded text-sm"
                  style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }}>
                  <option value="diesel">Дизель</option>
                  <option value="petrol">Бензин</option>
                  <option value="gas">Газ</option>
                  <option value="electric">Электро</option>
                </select>
                <input type="number" placeholder="Объем бака" value={form.tankCapacity}
                  onChange={(e) => setForm({ ...form, tankCapacity: Number(e.target.value) })}
                  className="px-3 py-2 rounded text-sm"
                  style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input type="number" placeholder="Год" value={form.year}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  className="px-3 py-2 rounded text-sm"
                  style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }} />
                <input type="number" placeholder="Расход л/100км" value={form.averageConsumption}
                  onChange={(e) => setForm({ ...form, averageConsumption: Number(e.target.value) })}
                  className="px-3 py-2 rounded text-sm"
                  style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }} />
                <input type="number" placeholder="Пробег" value={form.initialMileage}
                  onChange={(e) => setForm({ ...form, initialMileage: Number(e.target.value) })}
                  className="px-3 py-2 rounded text-sm"
                  style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }} />
              </div>
              <select value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }}>
                <option value="active">Активен</option>
                <option value="inactive">Не активен</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded text-sm"
                style={{ color: "#9d9dab", border: "1px solid #464652" }}>Отмена</button>
              <button onClick={save} className="px-4 py-2 rounded text-sm font-medium"
                style={{ background: "#ba85ff", color: "#0f051c" }}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}