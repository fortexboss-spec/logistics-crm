'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import { Search, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
interface Driver {
  id: number; name: string; vehicle: string; carrier: string; payType: string; value: number; fines: boolean; nds: boolean; status: string;
}
const initialDrivers: Driver[] = [
  { id: 1, name: 'Смирнов Олег Дмитриевич', vehicle: 'К599ОС76', carrier: 'ООО "ФРЕШКОМ"', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 2, name: 'Разгуляев Егор Евгеньевич', vehicle: 'О461YH76', carrier: 'ООО "ФРЕШКОМ"', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 3, name: 'Шабаров Валерий Станиславович', vehicle: 'К529YO797', carrier: 'ООО "ФРЕШКОМ"', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 4, name: 'Коуров Владислав Валерьевич', vehicle: 'О987ХМ44', carrier: 'ООО "ФРЕШКОМ"', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 5, name: 'Ахмедов Эмиль Ахмедович', vehicle: 'Y942MX44', carrier: 'ООО "ФРЕШКОМ"', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 6, name: 'Данилов Дмитрий Алексеевич', vehicle: 'Н262КС76', carrier: 'ООО "ФРЕШКОМ"', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 7, name: 'Хухарев Александр Владимирович', vehicle: 'Y762EC76', carrier: 'ООО "ФРЕШКОМ"', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 8, name: 'Иванов Станислав Александрович', vehicle: 'Y107KC76', carrier: 'ООО "ФРЕШКОМ"', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 9, name: 'Горшков Артём Вячеславович', vehicle: 'Y095AX76', carrier: 'ООО "ФРЕШКОМ"', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 10, name: 'Кононов Юрий Геннадьевич', vehicle: 'С274КХ76', carrier: 'ООО "ФРЕШКОМ"', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
];
export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [form, setForm] = useState({ name: '', vehicle: '', carrier: 'ООО "ФРЕШКОМ"', payType: 'Ставка', value: 0, fines: true, nds: false });
  const filtered = drivers.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.vehicle.toLowerCase().includes(search.toLowerCase()) || d.carrier.toLowerCase().includes(search.toLowerCase()));
  const openCreate = () => { setEditingDriver(null); setForm({ name: '', vehicle: '', carrier: 'ООО "ФРЕШКОМ"', payType: 'Ставка', value: 0, fines: true, nds: false }); setIsModalOpen(true); };
  const openEdit = (d: Driver) => { setEditingDriver(d); setForm({ name: d.name, vehicle: d.vehicle, carrier: d.carrier, payType: d.payType, value: d.value, fines: d.fines, nds: d.nds }); setIsModalOpen(true); };
  const handleSave = () => { if (editingDriver) { setDrivers(prev => prev.map(d => d.id === editingDriver.id ? { ...d, ...form } : d)); } else { setDrivers(prev => [...prev, { id: Date.now(), ...form, status: 'На линии' }]); } setIsModalOpen(false); };
  const handleDelete = (id: number) => { if (confirm('Удалить водителя?')) setDrivers(prev => prev.filter(d => d.id !== id)); };
  return (
    <div>
      <Header title="Водители" actions={<button className="btn-primary" onClick={openCreate}><Plus size={16} /> Добавить водителя</button>} />
      <div style={{marginBottom:'16px'}}>
        <div style={{position:'relative',display:'inline-block'}}>
          <Search size={16} style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#6b6b7b'}} />
          <input type="text" placeholder="Поиск по ФИО, номеру авто, перевозчику..." value={search} onChange={(e) => setSearch(e.target.value)} className="form-input" style={{paddingLeft:'36px',width:'400px'}} />
        </div>
      </div>
      <div style={{borderRadius:'8px',border:'1px solid #464652',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'14px'}}>
          <thead>
            <tr style={{borderBottom:'1px solid #464652'}}>
              {['ФИО','Номер ТС','Перевозчик','Тип оплаты','Значение','Штрафы','НДС','Статус','Действия'].map(h => (
                <th key={h} style={{padding:'12px 16px',textAlign:'left',color:'#9d9dab',fontWeight:500,fontSize:'14px'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id} style={{borderBottom:'1px solid #464652'}}>
                <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{d.name}</td>
                <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{d.vehicle}</td>
                <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{d.carrier}</td>
                <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{d.payType}</td>
                <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{d.value.toFixed(2)} P</td>
                <td style={{padding:'14px 16px'}}><span className={d.fines ? 'badge-active' : 'badge-inactive'}>{d.fines ? 'Да' : 'Нет'}</span></td>
                <td style={{padding:'14px 16px'}}><span className={d.nds ? 'badge-active' : 'badge-inactive'}>{d.nds ? 'Да' : 'Нет'}</span></td>
                <td style={{padding:'14px 16px'}}><span className="badge-active">{d.status}</span></td>
                <td style={{padding:'14px 16px'}}>
                  <div style={{display:'flex',gap:'4px'}}>
                    <button onClick={() => {}} style={{padding:'6px',backgroundColor:'transparent',border:'none',color:'#9d9dab',cursor:'pointer',borderRadius:'6px'}}><Eye size={16}/></button>
                    <button onClick={() => openEdit(d)} style={{padding:'6px',backgroundColor:'transparent',border:'none',color:'#9d9dab',cursor:'pointer',borderRadius:'6px'}}><Pencil size={16}/></button>
                    <button onClick={() => handleDelete(d.id)} style={{padding:'6px',backgroundColor:'transparent',border:'none',color:'#9d9dab',cursor:'pointer',borderRadius:'6px'}}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDriver ? 'Редактировать водителя' : 'Добавить водителя'}>
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          <div><label className="form-label">ФИО</label><input className="form-input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Иванов Иван Иванович" /></div>
          <div><label className="form-label">Номер ТС</label><input className="form-input" value={form.vehicle} onChange={(e) => setForm({...form, vehicle: e.target.value})} placeholder="А000АА00" /></div>
          <div><label className="form-label">Перевозчик</label><input className="form-input" value={form.carrier} onChange={(e) => setForm({...form, carrier: e.target.value})} /></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            <div><label className="form-label">Тип оплаты</label><select className="form-select" value={form.payType} onChange={(e) => setForm({...form, payType: e.target.value})}><option>Ставка</option><option>Процент</option><option>За коробку</option></select></div>
            <div><label className="form-label">Значение</label><input className="form-input" type="number" value={form.value} onChange={(e) => setForm({...form, value: parseFloat(e.target.value)||0})} /></div>
          </div>
          <div style={{display:'flex',gap:'20px'}}>
            <label style={{display:'flex',alignItems:'center',gap:'8px',color:'#e7e2f0',fontSize:'14px',cursor:'pointer'}}><input type="checkbox" checked={form.fines} onChange={(e) => setForm({...form, fines: e.target.checked})} /> Штрафы</label>
            <label style={{display:'flex',alignItems:'center',gap:'8px',color:'#e7e2f0',fontSize:'14px',cursor:'pointer'}}><input type="checkbox" checked={form.nds} onChange={(e) => setForm({...form, nds: e.target.checked})} /> НДС</label>
          </div>
          <div style={{display:'flex',gap:'10px',justifyContent:'flex-end',marginTop:'8px'}}>
            <button className="btn-outline" onClick={() => setIsModalOpen(false)}>Отмена</button>
            <button className="btn-primary" onClick={handleSave}>{editingDriver ? 'Сохранить' : 'Добавить'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
