'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import Modal from '@/components/Modal';
interface Organization { id: number; name: string; inn: string | null; paymentType: string; paymentValue: string; withVat: boolean; withPenalties: boolean; isActive: boolean; }
export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Organization | null>(null);
  const [form, setForm] = useState({ name: '', inn: '', paymentType: 'fixed', paymentValue: '0', withVat: false, withPenalties: true, isActive: true });
  useEffect(() => { fetchOrgs(); }, []);
  const fetchOrgs = async () => {
    try { setLoading(true); const res = await fetch('/api/organizations'); const data = await res.json(); if (Array.isArray(data)) setOrgs(data); } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  const openAdd = () => { setEditItem(null); setForm({ name: '', inn: '', paymentType: 'fixed', paymentValue: '0', withVat: false, withPenalties: true, isActive: true }); setShowModal(true); };
  const openEdit = (o: Organization) => { setEditItem(o); setForm({ name: o.name, inn: o.inn || '', paymentType: o.paymentType, paymentValue: o.paymentValue, withVat: o.withVat, withPenalties: o.withPenalties, isActive: o.isActive }); setShowModal(true); };
  const save = async () => {
    if (editItem) {
      await fetch('/api/organizations/' + editItem.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch('/api/organizations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    setShowModal(false);
    fetchOrgs();
  };
  const remove = async (id: number) => {
    if (!confirm('Удалить перевозчика?')) return;
    await fetch('/api/organizations/' + id, { method: 'DELETE' });
    fetchOrgs();
  };
  const payLabel = (t: string) => t === 'fixed' ? 'Фикс' : t === 'percent' ? 'Процент' : t === 'per_box' ? 'За коробку' : t;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e7e2f0', margin: 0 }}>Перевозчики</h1>
        <button onClick={openAdd} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#ba85ff', color: '#0f051c', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, height: 36 }}><Plus size={16} /> Добавить</button>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 64 }}><Loader2 size={32} style={{ color: '#ba85ff' }} className="animate-spin" /><p style={{ color: '#9d9dab', marginTop: 16 }}>Загрузка...</p></div>
      ) : orgs.length === 0 ? (
        <div style={{ border: '1px solid #464652', borderRadius: 8, padding: 48, textAlign: 'center' }}>
          <p style={{ color: '#e7e2f0', fontWeight: 600, fontSize: 16 }}>Нет перевозчиков</p>
          <p style={{ color: '#9d9dab', fontSize: 13 }}>Нажмите "Добавить" чтобы создать первого перевозчика</p>
        </div>
      ) : (
        <div style={{ border: '1px solid #464652', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid #464652' }}>{['Название','ИНН','Тип оплаты','Значение','НДС','Штрафы','Статус','Действия'].map(h => (<th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#9d9dab' }}>{h}</th>))}</tr></thead>
            <tbody>{orgs.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid #464652' }}>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#e7e2f0', fontWeight: 500 }}>{o.name}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#9d9dab' }}>{o.inn || '\\u2014'}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#9d9dab' }}>{payLabel(o.paymentType)}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#e7e2f0' }}>{o.paymentValue}</td>
                <td style={{ padding: '14px 16px', fontSize: 14 }}><span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: o.withVat ? '#ba85ff' : '#392b4c', color: o.withVat ? '#0f051c' : '#e7e2f0' }}>{o.withVat ? 'Да' : 'Нет'}</span></td>
                <td style={{ padding: '14px 16px', fontSize: 14 }}><span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: o.withPenalties ? '#ba85ff' : '#392b4c', color: o.withPenalties ? '#0f051c' : '#e7e2f0' }}>{o.withPenalties ? 'Да' : 'Нет'}</span></td>
                <td style={{ padding: '14px 16px', fontSize: 14 }}><span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: o.isActive ? '#ba85ff' : '#392b4c', color: o.isActive ? '#0f051c' : '#e7e2f0' }}>{o.isActive ? 'Активен' : 'Неактивен'}</span></td>
                <td style={{ padding: '14px 16px' }}><div style={{ display: 'flex', gap: 8 }}><button onClick={() => openEdit(o)} style={{ background: 'none', border: 'none', color: '#9d9dab', cursor: 'pointer' }}><Pencil size={16} /></button><button onClick={() => remove(o.id)} style={{ background: 'none', border: 'none', color: '#9d9dab', cursor: 'pointer' }}><Trash2 size={16} /></button></div></td>
              </tr>
            ))}</tbody>
          </table>
          <div style={{ padding: '12px 16px', borderTop: '1px solid #464652', color: '#9d9dab', fontSize: 13 }}>Всего: {orgs.length}</div>
        </div>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Редактировать' : 'Добавить перевозчика'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Название</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }} /></div>
          <div><label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>ИНН</label><input value={form.inn} onChange={e => setForm({...form, inn: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Тип оплаты</label><select value={form.paymentType} onChange={e => setForm({...form, paymentType: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }}><option value="fixed">Фиксированная</option><option value="percent">Процент</option><option value="per_box">За коробку</option></select></div>
            <div><label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Значение</label><input value={form.paymentValue} onChange={e => setForm({...form, paymentValue: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }} /></div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e7e2f0', fontSize: 14, cursor: 'pointer' }}><input type="checkbox" checked={form.withVat} onChange={e => setForm({...form, withVat: e.target.checked})} /> НДС</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e7e2f0', fontSize: 14, cursor: 'pointer' }}><input type="checkbox" checked={form.withPenalties} onChange={e => setForm({...form, withPenalties: e.target.checked})} /> Штрафы</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e7e2f0', fontSize: 14, cursor: 'pointer' }}><input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} /> Активен</label>
          </div>
          <button onClick={save} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#ba85ff', color: '#0f051c', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>{editItem ? 'Сохранить' : 'Добавить'}</button>
        </div>
      </Modal>
    </div>
  );
}