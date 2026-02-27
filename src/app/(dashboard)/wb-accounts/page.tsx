'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import { Plus, Pencil, Trash2, Copy } from 'lucide-react';
interface WBAccount {
  id: number;
  name: string;
  supplierId: string;
  offices: string;
  status: string;
  lastUsed: string;
  token: string;
}
const initialAccounts: WBAccount[] = [
  { id: 1, name: 'Freshkom', supplierId: '344813', offices: '338827', status: 'Активен', lastUsed: '27.02.2026, 04:18', token: 'eyJhbGciOi...' },
];
export default function WBAccountsPage() {
  const [accounts, setAccounts] = useState<WBAccount[]>(initialAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<WBAccount | null>(null);
  const [form, setForm] = useState({ name: '', supplierId: '', offices: '', token: '' });
  const [showInactive, setShowInactive] = useState(true);
  const openCreate = () => { setEditing(null); setForm({ name: '', supplierId: '', offices: '', token: '' }); setIsModalOpen(true); };
  const openEdit = (acc: WBAccount) => { setEditing(acc); setForm({ name: acc.name, supplierId: acc.supplierId, offices: acc.offices, token: acc.token }); setIsModalOpen(true); };
  const handleSave = () => {
    if (editing) { setAccounts(prev => prev.map(a => a.id === editing.id ? { ...a, ...form } : a)); }
    else { setAccounts(prev => [...prev, { id: Date.now(), ...form, status: 'Активен', lastUsed: new Date().toLocaleString('ru') }]); }
    setIsModalOpen(false);
  };
  const handleDelete = (id: number) => { if (confirm('Удалить аккаунт?')) setAccounts(prev => prev.filter(a => a.id !== id)); };
  const copyText = (text: string) => { navigator.clipboard.writeText(text); };
  const filtered = showInactive ? accounts : accounts.filter(a => a.status === 'Активен');
  return (
    <div>
      <Header title="WB Аккаунты" subtitle="Управление аккаунтами Wildberries (токены, supplier ID, офисы)"
        actions={
          <div style={{display:'flex',gap:'10px'}}>
            <button className="btn-outline" onClick={() => setShowInactive(!showInactive)}>{showInactive ? 'Скрыть неактивные' : 'Показать все'}</button>
            <button className="btn-purple" onClick={openCreate}><Plus size={16} /> Добавить аккаунт</button>
          </div>
        }
      />
      <div style={{backgroundColor:'#1a2235',borderRadius:'12px',border:'1px solid #2a3548',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
          <thead>
            <tr style={{borderBottom:'1px solid #2a3548'}}>
              {['Название','Supplier ID','Офисы','Статус','Последнее использование','Действия'].map(h => (
                <th key={h} style={{padding:'12px 16px',textAlign:'left',color:'#94a3b8',fontWeight:500}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(acc => (
              <tr key={acc.id} style={{borderBottom:'1px solid #2a3548'}}>
                <td style={{padding:'10px 16px',color:'#e2e8f0'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <span style={{color:'#8b5cf6'}}>&#9881;</span> {acc.name}
                  </div>
                </td>
                <td style={{padding:'10px 16px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <span className="badge-purple">{acc.supplierId}</span>
                    <button onClick={() => copyText(acc.supplierId)} style={{padding:'2px',backgroundColor:'transparent',border:'none',color:'#94a3b8',cursor:'pointer'}}><Copy size={14}/></button>
                  </div>
                </td>
                <td style={{padding:'10px 16px'}}><span className="badge-purple">{acc.offices}</span></td>
                <td style={{padding:'10px 16px'}}><span className="badge-green">{acc.status}</span></td>
                <td style={{padding:'10px 16px',color:'#94a3b8'}}>{acc.lastUsed}</td>
                <td style={{padding:'10px 16px'}}>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button onClick={() => openEdit(acc)} style={{padding:'4px',backgroundColor:'transparent',border:'none',color:'#94a3b8',cursor:'pointer'}}><Pencil size={16}/></button>
                    <button onClick={() => handleDelete(acc.id)} style={{padding:'4px',backgroundColor:'transparent',border:'none',color:'#94a3b8',cursor:'pointer'}}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Редактировать аккаунт' : 'Добавить аккаунт'}>
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          <div><label className="form-label">Название</label><input className="form-input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Freshkom" /></div>
          <div><label className="form-label">Supplier ID</label><input className="form-input" value={form.supplierId} onChange={(e) => setForm({...form, supplierId: e.target.value})} placeholder="344813" /></div>
          <div><label className="form-label">Офисы (ID через запятую)</label><input className="form-input" value={form.offices} onChange={(e) => setForm({...form, offices: e.target.value})} placeholder="338827" /></div>
          <div><label className="form-label">API Токен</label><textarea className="form-input" rows={3} value={form.token} onChange={(e) => setForm({...form, token: e.target.value})} placeholder="eyJhbGciOi..." style={{resize:'vertical'}} /></div>
          <div style={{display:'flex',gap:'10px',justifyContent:'flex-end',marginTop:'8px'}}>
            <button className="btn-outline" onClick={() => setIsModalOpen(false)}>Отмена</button>
            <button className="btn-purple" onClick={handleSave}>{editing ? 'Сохранить' : 'Добавить'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
