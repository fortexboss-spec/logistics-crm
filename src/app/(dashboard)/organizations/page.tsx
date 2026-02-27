'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import { Plus, Pencil, Trash2 } from 'lucide-react';
interface Org {
  id: number;
  name: string;
  inn: string;
  payType: string;
  value: number;
  nds: boolean;
  fines: boolean;
  status: string;
}
const initialOrgs: Org[] = [
  { id: 1, name: 'ООО ФРЕШКОМ', inn: '7604301245', payType: 'Ставка', value: 0, nds: true, fines: true, status: 'Активен' },
  { id: 2, name: 'ИП Козлов А.С.', inn: '760412345678', payType: 'Процент', value: 15, nds: false, fines: true, status: 'Активен' },
  { id: 3, name: 'ООО ТрансЛогистик', inn: '7703456789', payType: 'Ставка', value: 5000, nds: true, fines: false, status: 'Неактивен' },
];
export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Org[]>(initialOrgs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Org | null>(null);
  const [form, setForm] = useState({ name: '', inn: '', payType: 'Ставка', value: 0, nds: true, fines: true });
  const openCreate = () => { setEditing(null); setForm({ name: '', inn: '', payType: 'Ставка', value: 0, nds: true, fines: true }); setIsModalOpen(true); };
  const openEdit = (org: Org) => { setEditing(org); setForm({ name: org.name, inn: org.inn, payType: org.payType, value: org.value, nds: org.nds, fines: org.fines }); setIsModalOpen(true); };
  const handleSave = () => {
    if (editing) { setOrgs(prev => prev.map(o => o.id === editing.id ? { ...o, ...form } : o)); }
    else { setOrgs(prev => [...prev, { id: Date.now(), ...form, status: 'Активен' }]); }
    setIsModalOpen(false);
  };
  const handleDelete = (id: number) => { if (confirm('Удалить перевозчика?')) setOrgs(prev => prev.filter(o => o.id !== id)); };
  return (
    <div>
      <Header title="Перевозчики" subtitle="Управление организациями-перевозчиками" actions={<button className="btn-purple" onClick={openCreate}><Plus size={16} /> Добавить перевозчика</button>} />
      <div style={{backgroundColor:'#1a2235',borderRadius:'12px',border:'1px solid #2a3548',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
          <thead>
            <tr style={{borderBottom:'1px solid #2a3548'}}>
              {['Название','ИНН','Тип оплаты','Значение','НДС','Штрафы','Статус','Действия'].map(h => (
                <th key={h} style={{padding:'12px 16px',textAlign:'left',color:'#94a3b8',fontWeight:500}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orgs.map(o => (
              <tr key={o.id} style={{borderBottom:'1px solid #2a3548'}}>
                <td style={{padding:'10px 16px',color:'#8b5cf6',fontWeight:500}}>{o.name}</td>
                <td style={{padding:'10px 16px',color:'#e2e8f0'}}>{o.inn}</td>
                <td style={{padding:'10px 16px',color:'#e2e8f0'}}>{o.payType}</td>
                <td style={{padding:'10px 16px',color:'#e2e8f0'}}>{o.value}</td>
                <td style={{padding:'10px 16px'}}><span className={o.nds ? 'badge-green' : 'badge-red'}>{o.nds ? 'Да' : 'Нет'}</span></td>
                <td style={{padding:'10px 16px'}}><span className={o.fines ? 'badge-green' : 'badge-red'}>{o.fines ? 'Да' : 'Нет'}</span></td>
                <td style={{padding:'10px 16px'}}><span className={o.status === 'Активен' ? 'badge-green' : 'badge-red'}>{o.status}</span></td>
                <td style={{padding:'10px 16px'}}>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button onClick={() => openEdit(o)} style={{padding:'4px',backgroundColor:'transparent',border:'none',color:'#94a3b8',cursor:'pointer'}}><Pencil size={16}/></button>
                    <button onClick={() => handleDelete(o.id)} style={{padding:'4px',backgroundColor:'transparent',border:'none',color:'#94a3b8',cursor:'pointer'}}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Редактировать перевозчика' : 'Добавить перевозчика'}>
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          <div><label className="form-label">Название</label><input className="form-input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="ООО Название" /></div>
          <div><label className="form-label">ИНН</label><input className="form-input" value={form.inn} onChange={(e) => setForm({...form, inn: e.target.value})} placeholder="7700000000" /></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            <div><label className="form-label">Тип оплаты</label><select className="form-select" value={form.payType} onChange={(e) => setForm({...form, payType: e.target.value})}><option>Ставка</option><option>Процент</option></select></div>
            <div><label className="form-label">Значение</label><input className="form-input" type="number" value={form.value} onChange={(e) => setForm({...form, value: parseFloat(e.target.value)||0})} /></div>
          </div>
          <div style={{display:'flex',gap:'20px'}}>
            <label style={{display:'flex',alignItems:'center',gap:'8px',color:'#e2e8f0',fontSize:'14px',cursor:'pointer'}}><input type="checkbox" checked={form.nds} onChange={(e) => setForm({...form, nds: e.target.checked})} /> НДС</label>
            <label style={{display:'flex',alignItems:'center',gap:'8px',color:'#e2e8f0',fontSize:'14px',cursor:'pointer'}}><input type="checkbox" checked={form.fines} onChange={(e) => setForm({...form, fines: e.target.checked})} /> Штрафы</label>
          </div>
          <div style={{display:'flex',gap:'10px',justifyContent:'flex-end',marginTop:'8px'}}>
            <button className="btn-outline" onClick={() => setIsModalOpen(false)}>Отмена</button>
            <button className="btn-purple" onClick={handleSave}>{editing ? 'Сохранить' : 'Добавить'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
