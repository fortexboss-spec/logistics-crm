"use client";
import { useState, useEffect } from "react";
import { Loader2, Plus, Pencil, Trash2, Eye } from "lucide-react";
interface Driver {
  id: number;
  fullName: string;
  vehicleNumber: string | null;
  phone: string | null;
  paymentType: string;
  paymentValue: string;
  withPenalties: boolean;
  withVat: boolean;
  driverIdWb: number | null;
  freelancerIdWb: number | null;
  status: string;
  organizationId: number | null;
  organization?: { id: number; name: string } | null;
}
const empty: Omit<Driver, "id" | "organization"> = {
  fullName: "", vehicleNumber: "", phone: "",
  paymentType: "fixed", paymentValue: "0.00",
  withPenalties: true, withVat: false,
  driverIdWb: null, freelancerIdWb: null,
  status: "на линии", organizationId: null,
};
export default function DriversPage() {
  const [items, setItems] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Driver | null>(null);
  const [form, setForm] = useState(empty);
  const [orgs, setOrgs] = useState<{ id: number; name: string }[]>([]);
  const [search, setSearch] = useState("");
  const load = () =>
    fetch("/api/drivers").then((r) => r.json()).then((d) => { setItems(d); setLoading(false); });
  useEffect(() => {
    load();
    fetch("/api/organizations").then((r) => r.json()).then(setOrgs);
  }, []);
  const filtered = items.filter((d) => {
    const q = search.toLowerCase();
    return d.fullName.toLowerCase().includes(q) ||
      (d.vehicleNumber || "").toLowerCase().includes(q) ||
      (d.organization?.name || "").toLowerCase().includes(q);
  });
  const openAdd = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (d: Driver) => {
    setEditing(d);
    setForm({
      fullName: d.fullName, vehicleNumber: d.vehicleNumber || "", phone: d.phone || "",
      paymentType: d.paymentType, paymentValue: d.paymentValue,
      withPenalties: d.withPenalties, withVat: d.withVat,
      driverIdWb: d.driverIdWb, freelancerIdWb: d.freelancerIdWb,
      status: d.status, organizationId: d.organizationId,
    });
    setShowModal(true);
  };
  const save = async () => {
    const url = editing ? `/api/drivers/${editing.id}` : "/api/drivers";
    await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, organizationId: form.organizationId ? Number(form.organizationId) : null }),
    });
    setShowModal(false);
    load();
  };
  const remove = async (id: number) => {
    if (!confirm("Удалить водителя?")) return;
    await fetch(`/api/drivers/${id}`, { method: "DELETE" });
    load();
  };
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#ba85ff" }} />
    </div>
  );
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "#e7e2f0" }}>
          <span style={{ fontSize: 20, opacity: 0.6 }}>&#9636;</span> Водители
        </h1>
        <div className="flex items-center gap-4">
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9d9dab" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Поиск по ФИО, номеру авто, перевозчику..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: "rgba(30,25,40,0.3)", color: "#e7e2f0", border: "1px solid #35304a", borderRadius: 8, padding: "8px 12px 8px 36px", fontSize: 14, width: 400, height: 36, outline: "none" }} />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 text-sm font-medium"
            style={{ background: "#ba85ff", color: "#0f051c", borderRadius: 8, padding: "8px 12px", border: "none" }}>
            <Plus className="w-4 h-4" /> Добавить водителя
          </button>
        </div>
      </div>
      <table className="w-full text-sm" style={{ color: "#e7e2f0", borderCollapse: "separate", borderSpacing: 0 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #35304a" }}>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>ФИО</th>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>Номер ТС</th>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>Перевозчик</th>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>Тип оплаты</th>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>Значение</th>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>Штрафы</th>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>НДС</th>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>Статус</th>
            <th className="text-left font-medium" style={{ color: "#e7e2f0", padding: "0 8px 12px", fontSize: 14 }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((d) => (
            <tr key={d.id} style={{ borderBottom: "1px solid #35304a", height: 52 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1f1d2b")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
              <td style={{ padding: "8px" }}>{d.fullName}</td>
              <td style={{ padding: "8px" }}>{d.vehicleNumber || "—"}</td>
              <td style={{ padding: "8px" }}>{d.organization?.name || "—"}</td>
              <td style={{ padding: "8px" }}>{d.paymentType === "fixed" ? "Ставка" : "Процент"}</td>
              <td style={{ padding: "8px" }}>{d.paymentType === "fixed" ? `${d.paymentValue} ₽` : `${d.paymentValue}%`}</td>
              <td style={{ padding: "8px" }}>
                <span style={{ background: d.withPenalties ? "#ba85ff" : "#392b4c", color: d.withPenalties ? "#0f051c" : "#e7e2f0", padding: "2px 8px", borderRadius: 8, fontSize: 12, fontWeight: 500 }}>
                  {d.withPenalties ? "Да" : "Нет"}
                </span>
              </td>
              <td style={{ padding: "8px" }}>
                <span style={{ background: d.withVat ? "#ba85ff" : "#392b4c", color: d.withVat ? "#0f051c" : "#e7e2f0", padding: "2px 8px", borderRadius: 8, fontSize: 12, fontWeight: 500 }}>
                  {d.withVat ? "Да" : "Нет"}
                </span>
              </td>
              <td style={{ padding: "8px" }}>
                <span style={{ background: "#ba85ff", color: "#0f051c", padding: "2px 8px", borderRadius: 8, fontSize: 12, fontWeight: 500 }}>
                  {d.status}
                </span>
              </td>
              <td style={{ padding: "8px" }}>
                <div className="flex items-center gap-3">
                  <button className="hover:opacity-80"><Eye className="w-5 h-5" style={{ color: "#9d9dab" }} /></button>
                  <button onClick={() => openEdit(d)} className="hover:opacity-80"><Pencil className="w-5 h-5" style={{ color: "#9d9dab" }} /></button>
                  <button onClick={() => remove(d.id)} className="hover:opacity-80"><Trash2 className="w-5 h-5" style={{ color: "#9d9dab" }} /></button>
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
              {editing ? "Редактировать" : "Добавить"} водителя
            </h2>
            <div className="space-y-3">
              <input placeholder="ФИО" value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded text-sm" style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }} />
              <input placeholder="Номер ТС" value={form.vehicleNumber || ""}
                onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
                className="w-full px-3 py-2 rounded text-sm" style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }} />
              <input placeholder="Телефон" value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded text-sm" style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }} />
              <select value={form.organizationId || ""}
                onChange={(e) => setForm({ ...form, organizationId: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3 py-2 rounded text-sm" style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }}>
                <option value="">Перевозчик...</option>
                {orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.paymentType}
                  onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
                  className="px-3 py-2 rounded text-sm" style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }}>
                  <option value="fixed">Ставка</option>
                  <option value="percent">Процент</option>
                </select>
                <input placeholder="Значение" value={form.paymentValue}
                  onChange={(e) => setForm({ ...form, paymentValue: e.target.value })}
                  className="px-3 py-2 rounded text-sm" style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }} />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm" style={{ color: "#e7e2f0" }}>
                  <input type="checkbox" checked={form.withPenalties}
                    onChange={(e) => setForm({ ...form, withPenalties: e.target.checked })} /> Штрафы
                </label>
                <label className="flex items-center gap-2 text-sm" style={{ color: "#e7e2f0" }}>
                  <input type="checkbox" checked={form.withVat}
                    onChange={(e) => setForm({ ...form, withVat: e.target.checked })} /> НДС
                </label>
              </div>
              <select value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 rounded text-sm" style={{ background: "#18181b", color: "#e7e2f0", border: "1px solid #464652" }}>
                <option value="на линии">На линии</option>
                <option value="не активен">Не активен</option>
                <option value="уволен">Уволен</option>
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