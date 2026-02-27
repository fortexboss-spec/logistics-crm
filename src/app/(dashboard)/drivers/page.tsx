'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import { Search, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
interface Driver {
  id: number;
  name: string;
  vehicle: string;
  carrier: string;
  payType: string;
  value: number;
  fines: boolean;
  nds: boolean;
  status: string;
}
const initialDrivers: Driver[] = [
  { id: 1, name: 'Смирнов Олег Дмитриевич', vehicle: 'К580ОС76', carrier: 'ООО ФРЕШКОМ', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 2, name: 'Разгуляев Егор Евгеньевич', vehicle: 'О481YH76', carrier: 'ООО ФРЕШКОМ', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 3, name: 'Шабаров Валерий Станиславович', vehicle: 'К529YO797', carrier: 'ООО ФРЕШКОМ', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 4, name: 'Коуров Владислав Валерьевич', vehicle: 'О987ХМ44', carrier: 'ООО ФРЕШКОМ', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 5, name: 'Ахмедов Эмиль Ахмедович', vehicle: 'Y942MX44', carrier: 'ООО ФРЕШКОМ', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 6, name: 'Данилов Дмитрий Алексеевич', vehicle: 'Н262КС76', carrier: 'ООО ФРЕШКОМ', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 7, name: 'Хухарев Александр Владимирович', vehicle: 'Y782EC76', carrier: 'ООО ФРЕШКОМ', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
  { id: 8, name: 'Иванов Станислав Александрович', vehicle: 'Y107KC76', carrier: 'ООО ФРЕШКОМ', payType: 'Ставка', value: 0, fines: true, nds: false, status: 'На линии' },
];
export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [form, setForm] = useState({ name: '', vehicle: '', carrier: 'ООО ФРЕШКОМ', payType: 'Ставка', value: 0, fines: true, nds: false });
  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.vehicle.toLowerCase().includes(search.toLowerCase()) ||
    d.carrier.toLowerCase().includes(search.toLowerCase())
  );
  const openCreate = () => {
    setEditingDriver(null);
    setForm({ name: '', vehicle: '', carrier: 'ООО ФРЕШКОМ', payType: 'Ставка', value: 0, fines: true, nds: false });
    setIsModalOpen(true);
  };
  const openEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setForm({ name: driver.name, vehicle: driver.vehicle, carrier: driver.carrier, payType: driver.payType, value: driver.value, fines: driver.fines, nds: driver.nds });
    setIsModalOpen(true);
  };
  const handleSave = () => {
    if (editingDriver) {
      setDrivers(prev => prev.map(d => d.id === editingDriver.id ? { ...d, ...form } : d));
    } else {
      setDrivers(prev => [...prev, { id: Date.now(), ...form, status: 'На линии' }]);
    }
    setIsModalOpen(false);
  };
  const handleDelete = (id: number) => {
    if (confirm('Удалить водителя?')) {
      setDrivers(prev => prev.filter(d => d.id !== id));
    }
  };
  return (
    <div>
      <Header title="Водители" />
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
        <div style={{position:'relative'}}>
          <Search size={16} style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#64748b'}} />
          <input
            type="text" placeholder="Поиск по ФИО, номеру авто, перевозчику..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="form-input" style={{paddingLeft:'36px',width:'350px'}}
          />
        </div>
        <button className="btn-purple" onClick={openCreate}>
          <Plus size={16} /> Добавить водителя
        </button>
      </div>
      <div style={{backgroundColor:'#1a2235',borderRadius:'12px',border:'1px solid #2a3548',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
          <thead>
            <tr style={{borderBottom:'1px solid #2a3548'}}>
              <th style={{padding:'12px 16px',textAlign:'left',color:'#94a3b8',fontWeight:500}}>ФИО</th>
              <th style={{padding:'12px 16px',textAlign:'left',color:'#94a3b8',fontWeight:500}}>Номер ТС</th>
              <th style={{padding:'12px 16px',textAlign:'left',color:'#94a3b8',fontWeight:500}}>Перевозчик</th>
              <th style={{padding:'12px 16px',textAlign:'left',color:'#94a3b8',fontWeight:500}}>Тип оплаты</th>
              <th style={{padding:'12px 16px',textAlign:'left',color:'#94a3b8',fontWeight:500}}>Значение</th>
              <th style={{padding:'12px 16px',textAlign:'center',color:'#94a3b8',fontWeight:500}}>Штрафы</th>
              <th style={{padding:'12px 16px',textAlign:'center',color:'#94a3b8',fontWeight:500}}>НДС</th>
              <th style={{padding:'12px 16px',textAlign:'left',color:'#94a3b8',fontWeight:500}}>Статус</th>
              <th style={{padding:'12px 16px',textAlign:'center',color:'#94a3b8',fontWeight:500}}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((driver) => (
              <tr key={driver.id} style={{borderBottom:'1px solid #2a3548'}}>
                <td style={{padding:'10px 16px',color:'#8b5cf6'}}>{driver.name}</td>
                <td style={{padding:'10px 16px',color:'#e2e8f0'}}>{driver.vehicle}</td>
                <td style={{padding:'10px 16px',color:'#e2e8f0'}}>{driver.carrier}</td>
                <td style={{padding:'10px 16px',color:'#e2e8f0'}}>{driver.payType}</td>
                <td style={{padding:'10px 16px',color:'#e2e8f0'}}>{driver.value.toFixed(2)} ₽</td>
                <td style={{padding:'10px 16px',textAlign:'center'}}><span className={driver.fines ? 'badge-green' : 'badge-red'}>{driver.fines ? 'Да' : 'Нет'}</span></td>
                <td style={{padding:'10px 16px',textAlign:'center'}}><span className={driver.nds ? 'badge-green' : 'badge-red'}>{driver.nds ? 'Да' : 'Нет'}</span></td>
                <td style={{padding:'10px 16px'}}><span className="badge-orange">{driver.status}</span></td>
                <td style={{padding:'10px 16px',textAlign:'center'}}>
                  <div style={{display:'flex',gap:'6px',justifyContent:'center'}}>
                    <button onClick={() => {}} style={{padding:'4px',backgroundColor:'transparent',border:'none',color:'#94a3b8',cursor:'pointer'}}><Eye size={16}/></button>
                    <button onClick={() => openEdit(driver)} style={{padding:'4px',backgroundColor:'transparent',border:'none',color:'#94a3b8',cursor:'pointer'}}><Pencil size={16}/></button>
                    <button onClick={() => handleDelete(driver.id)} style={{padding:'4px',backgroundColor:'transparent',border:'none',color:'#94a3b8',cursor:'pointer'}}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDriver ? 'Редактировать водителя' : 'Добавить водителя'}>
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          <div>
            <label className="form-label">ФИО</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Иванов Иван Иванович" />
          </div>
          <div>
            <label className="form-label">Номер ТС</label>
            <input className="form-input" value={form.vehicle} onChange={(e) => setForm({...form, vehicle: e.target.value})} placeholder="А000АА00" />
          </div>
          <div>
            <label className="form-label">Перевозчик</label>
            <input className="form-input" value={form.carrier} onChange={(e) => setForm({...form, carrier: e.target.value})} />
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            <div>
              <label className="form-label">Тип оплаты</label>
              <select className="form-select" value={form.payType} onChange={(e) => setForm({...form, payType: e.target.value})}>
                <option>Ставка</option>
                <option>Процент</option>
                <option>За коробку</option>
              </select>
            </div>
            <div>
              <label className="form-label">Значение</label>
              <input className="form-input" type="number" value={form.value} onChange={(e) => setForm({...form, value: parseFloat(e.target.value) || 0})} />
            </div>
          </div>
          <div style={{display:'flex',gap:'20px'}}>
            <label style={{display:'flex',alignItems:'center',gap:'8px',color:'#e2e8f0',fontSize:'14px',cursor:'pointer'}}>
              <input type="checkbox" checked={form.fines} onChange={(e) => setForm({...form, fines: e.target.checked})} /> Штрафы
            </label>
            <label style={{display:'flex',alignItems:'center',gap:'8px',color:'#e2e8f0',fontSize:'14px',cursor:'pointer'}}>
              <input type="checkbox" checked={form.nds} onChange={(e) => setForm({...form, nds: e.target.checked})} /> НДС
            </label>
          </div>
          <div style={{display:'flex',gap:'10px',justifyContent:'flex-end',marginTop:'8px'}}>
            <button className="btn-outline" onClick={() => setIsModalOpen(false)}>Отмена</button>
            <button className="btn-purple" onClick={handleSave}>{editingDriver ? 'Сохранить' : 'Добавить'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
