'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import Modal from '@/components/Modal';
interface Organization { id: number; name: string; inn: string | null; payment_type: string; payment_value: string; with_vat: boolean; with_penalties: boolean; is_active: boolean; }
export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Organization | null>(null);
  const [form, setForm] = useState({ name: '', inn: '', payment_type: 'fixed', payment_value: '0', with_vat: false, with_penalties: true, is_active: true });
  useEffect(() => { fetchOrgs(); }, []);
  const fetchOrgs = async () => {
    try { setLoading(true); const res = await fetch('/api/crm/organizations/'); const data = await res.json(); if (Array.isArray(data)) setOrgs(data); } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  const openAdd = () => { setEditItem(null); setForm({ name: '', inn: '', payment_type: 'fixed', payment_value: '0', with_vat: false, with_penalties: true, is_active: true }); setShowModal(true); };
  const openEdit = (o: Organization) => { setEditItem(o); setForm({ name: o.name, inn: o.inn || '', payment_type: o.payment_type, payment_value: o.payment_value, with_vat: o.with_vat, with_penalties: o.with_penalties, is_active: o.is_active }); setShowModal(true); };
  const save = () => { if (editItem) { setOrgs(orgs.map(o => o.id === editItem.id ? { ...o, ...form } : o)); } else { setOrgs([...orgs, { id: Date.now(), ...form }]); } setShowModal(false); };
  const remove = (id: number) => { if (confirm('Удалить?')) setOrgs(orgs.filter(o => o.id !== id)); };
  const payLabel = (t: string) => t === 'fixed' ? 'Фикс' : t === 'percent' ? 'Процент' : t;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e7e2f0', margin: 0 }}>Перевозчики</h1>
        <button onClick={openAdd} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#ba85ff', color: '#0f051c', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, height: 36 }}><Plus size={16} /> Добавить</button>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 64 }}><Loader2 size={32} style={{ color: '#ba85ff' }} className="animate-spin" /><p style={{ color: '#9d9dab', marginTop: 16 }}>Загрузка из CRM...</p></div>
      ) : (
        <div style={{ border: '1px solid #464652', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid #464652' }}>{['Название','ИНН','Тип оплаты','Значение','НДС','Штрафы','Статус','Действия'].map(h => (<th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#9d9dab' }}>{h}</th>))}</tr></thead>
            <tbody>{orgs.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid #464652' }}>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#e7e2f0', fontWeight: 500 }}>{o.name}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#9d9dab' }}>{o.inn || '\\u2014'}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#9d9dab' }}>{payLabel(o.payment_type)}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#e7e2f0' }}>{o.payment_value}</td>
                <td style={{ padding: '14px 16px', fontSize: 14 }}><span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: o.with_vat ? '#ba85ff' : '#392b4c', color: o.with_vat ? '#0f051c' : '#e7e2f0' }}>{o.with_vat ? 'Да' : 'Нет'}</span></td>
                <td style={{ padding: '14px 16px', fontSize: 14 }}><span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: o.with_penalties ? '#ba85ff' : '#392b4c', color: o.with_penalties ? '#0f051c' : '#e7e2f0' }}>{o.with_penalties ? 'Да' : 'Нет'}</span></td>
                <td style={{ padding: '14px 16px', fontSize: 14 }}><span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: o.is_active ? '#ba85ff' : '#392b4c', color: o.is_active ? '#0f051c' : '#e7e2f0' }}>{o.is_active ? 'Активен' : 'Неактивен'}</span></td>
                <td style={{ padding: '14px 16px' }}><div style={{ display: 'flex', gap: 8 }}><button onClick={() => openEdit(o)} style={{ background: 'none', border: 'none', color: '#9d9dab', cursor: 'pointer' }}><Pencil size={16} /></button><button onClick={() => remove(o.id)} style={{ background: 'none', border: 'none', color: '#9d9dab', cursor: 'pointer' }}><Trash2 size={16} /></button></div></td>
              </tr>
            ))}</tbody>
          </table>
          <div style={{ padding: '12px 16px', borderTop: '1px solid #464652', color: '#9d9dab', fontSize: 13 }}>Всего: {orgs.length} перевозчиков</div>
        </div>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Редактировать' : 'Добавить перевозчика'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Название</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }} /></div>
          <div><label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>ИНН</label><input value={form.inn} onChange={e => setForm({...form, inn: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }} /></div>
          <button onClick={save} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#ba85ff', color: '#0f051c', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>{editItem ? 'Сохранить' : 'Добавить'}</button>
        </div>
      </Modal>
    </div>
  );
}
