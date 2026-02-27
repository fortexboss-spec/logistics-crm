'use client';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Copy, Eye, EyeOff, Link2 } from 'lucide-react';
import Modal from '@/components/Modal';
interface WBAccount {
  id: number;
  name: string;
  supplierId: string;
  offices: string;
  token: string;
  status: 'active' | 'inactive';
  lastUsed: string;
}
const initialAccounts: WBAccount[] = [
  { id: 1, name: 'Freshkom', supplierId: '344813', offices: '338827', token: 'eyJhbGciOiJFUzI1...', status: 'active', lastUsed: '27.02.2026, 04:18' },
];
export default function WBAccountsPage() {
  const [accounts, setAccounts] = useState<WBAccount[]>(initialAccounts);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<WBAccount | null>(null);
  const [hideInactive, setHideInactive] = useState(false);
  const [showToken, setShowToken] = useState<Record<number, boolean>>({});
  const [form, setForm] = useState({ name: '', supplierId: '', offices: '', token: '', status: 'active' as const });
  const filtered = hideInactive ? accounts.filter(a => a.status === 'active') : accounts;
  const openAdd = () => { setEditItem(null); setForm({ name: '', supplierId: '', offices: '', token: '', status: 'active' }); setShowModal(true); };
  const openEdit = (a: WBAccount) => { setEditItem(a); setForm({ name: a.name, supplierId: a.supplierId, offices: a.offices, token: a.token, status: a.status }); setShowModal(true); };
  const save = () => {
    if (editItem) {
      setAccounts(accounts.map(a => a.id === editItem.id ? { ...a, ...form, lastUsed: a.lastUsed } : a));
    } else {
      setAccounts([...accounts, { id: Date.now(), ...form, lastUsed: new Date().toLocaleString('ru') }]);
    }
    setShowModal(false);
  };
  const remove = (id: number) => { if (confirm('Удалить аккаунт?')) setAccounts(accounts.filter(a => a.id !== id)); };
  const copyText = (text: string) => navigator.clipboard.writeText(text);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e7e2f0', margin: 0 }}>WB Аккаунты</h1>
          <p style={{ color: '#9d9dab', fontSize: 14, marginTop: 4 }}>Управление аккаунтами Wildberries (токены, supplier ID, офисы)</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setHideInactive(!hideInactive)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ba85ff', background: 'transparent', color: '#ba85ff', fontSize: 13, cursor: 'pointer' }}>
            {hideInactive ? 'Показать все' : 'Скрыть неактивные'}
          </button>
          <button onClick={openAdd} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#ba85ff', color: '#0f051c', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Добавить аккаунт
          </button>
        </div>
      </div>
      <div style={{ border: '1px solid #464652', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #464652' }}>
              {['Название','Supplier ID','Офисы','Статус','Последнее использование','Действия'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#9d9dab' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid #464652' }}>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#e7e2f0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Link2 size={14} style={{ color: '#ba85ff' }} /> {a.name}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ background: '#22c55e', color: '#fff', padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>{a.supplierId}</span>
                    <button onClick={() => copyText(a.supplierId)} style={{ background: 'none', border: 'none', color: '#9d9dab', cursor: 'pointer', padding: 2 }}><Copy size={14} /></button>
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#e7e2f0' }}>{a.offices}</td>
                <td style={{ padding: '14px 16px', fontSize: 14 }}>
                  <span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: a.status === 'active' ? '#ba85ff' : '#392b4c', color: a.status === 'active' ? '#0f051c' : '#e7e2f0' }}>
                    {a.status === 'active' ? 'Активен' : 'Неактивен'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#9d9dab' }}>{a.lastUsed}</td>
                <td style={{ padding: '14px 16px', fontSize: 14 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setShowToken(p => ({ ...p, [a.id]: !p[a.id] }))} style={{ background: 'none', border: 'none', color: '#9d9dab', cursor: 'pointer' }}>{showToken[a.id] ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
                    <button onClick={() => openEdit(a)} style={{ background: 'none', border: 'none', color: '#9d9dab', cursor: 'pointer' }}><Pencil size={16} /></button>
                    <button onClick={() => remove(a.id)} style={{ background: 'none', border: 'none', color: '#9d9dab', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Редактировать аккаунт' : 'Добавить аккаунт'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Название</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Supplier ID</label>
            <input value={form.supplierId} onChange={e => setForm({...form, supplierId: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Офисы</label>
            <input value={form.offices} onChange={e => setForm({...form, offices: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>API Токен</label>
            <input value={form.token} onChange={e => setForm({...form, token: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#9d9dab', marginBottom: 6, display: 'block' }}>Статус</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value as 'active'|'inactive'})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #3a3a42', background: 'rgba(58,58,66,0.3)', color: '#e7e2f0', fontSize: 14 }}>
              <option value="active">Активен</option>
              <option value="inactive">Неактивен</option>
            </select>
          </div>
          <button onClick={save} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#ba85ff', color: '#0f051c', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>
            {editItem ? 'Сохранить' : 'Добавить'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
