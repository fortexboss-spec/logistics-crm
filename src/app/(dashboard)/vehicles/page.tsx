'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
interface Vehicle {
  id: number;
  plate: string;
  driver: string;
  fuelType: string;
  tankVolume: number;
  year: number;
  status: string;
}
const initialVehicles: Vehicle[] = [
  { id: 1, plate: 'К580ОС76', driver: 'Смирнов О.Д.', fuelType: 'Дизель', tankVolume: 70, year: 2021, status: 'На линии' },
  { id: 2, plate: 'О481YH76', driver: 'Разгуляев Е.Е.', fuelType: 'Бензин', tankVolume: 60, year: 2020, status: 'На линии' },
  { id: 3, plate: 'К529YO797', driver: 'Шабаров В.С.', fuelType: 'Дизель', tankVolume: 80, year: 2022, status: 'На линии' },
  { id: 4, plate: 'О987ХМ44', driver: 'Коуров В.В.', fuelType: 'Дизель', tankVolume: 70, year: 2019, status: 'В ремонте' },
  { id: 5, plate: 'Y942MX44', driver: 'Ахмедов Э.А.', fuelType: 'Бензин', tankVolume: 55, year: 2023, status: 'На линии' },
  { id: 6, plate: 'Н262КС76', driver: 'Данилов Д.А.', fuelType: 'Дизель', tankVolume: 70, year: 2021, status: 'На линии' },
];
export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState({ plate: '', driver: '', fuelType: 'Дизель', tankVolume: 70, year: 2024 });
  const filtered = vehicles.filter(v =>
    v.plate.toLowerCase().includes(search.toLowerCase()) || v.driver.toLowerCase().includes(search.toLowerCase())
  );
  const openCreate = () => { setEditing(null); setForm({ plate: '', driver: '', fuelType: 'Дизель', tankVolume: 70, year: 2024 }); setIsModalOpen(true); };
  const openEdit = (v: Vehicle) => { setEditing(v); setForm({ plate: v.plate, driver: v.driver, fuelType: v.fuelType, tankVolume: v.tankVolume, year: v.year }); setIsModalOpen(true); };
  const handleSave = () => {
    if (editing) { setVehicles(prev => prev.map(v => v.id === editing.id ? { ...v, ...form } : v)); }
    else { setVehicles(prev => [...prev, { id: Date.now(), ...form, status: 'На линии' }]); }
    setIsModalOpen(false);
  };
  const handleDelete = (id: number) => { if (confirm('Удалить ТС?')) setVehicles(prev => prev.filter(v => v.id !== id)); };
  return (
    <div>
      <Header title="Автопарк" subtitle="Управление транспортными средствами" />
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
        <div style={{position:'relative'}}>
          <Search size={16} style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#64748b'}} />
          <input type="text" placeholder="Поиск по номеру, водителю..." value={search} onChange={(e) => setSearch(e.target.value)} className="form-input" style={{paddingLeft:'36px',width:'300px'}} />
        </div>
        <button className="btn-purple" onClick={openCreate}><Plus size={16} /> Добавить ТС</button>
      </div>
      <div style={{backgroundColor:'#1a2235',borderRadius:'12px',border:'1px solid #2a3548',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
          <thead>
            <tr style={{borderBottom:'1px solid #2a3548'}}>
              {['Гос номер','Водитель','Тип топлива','Объём бака','Год выпуска','Статус','Действия'].map(h => (
                <th key={h} style={{padding:'12px 16px',textAlign:'left',color:'#94a3b8',fontWeight:500}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id} style={{borderBottom:'1px solid #2a3548'}}>
                <td style={{padding:'10px 16px',color:'#8b5cf6',fontWeight:500}}>{v.plate}</td>
                <td style={{padding:'10px 16px',color:'#e2e8f0'}}>{v.driver}</td>
                <td style={{padding:'10px 16px',color:'#e2e8f0'}}>{v.fuelType}</td>
                <td style={{padding:'10px 16px',color:'#e2e8f0'}}>{v.tankVolume} л</td>
                <td style={{padding:'10px 16px',color:'#e2e8f0'}}>{v.year}</td>
                <td style={{padding:'10px 16px'}}><span className={v.status === 'На линии' ? 'badge-green' : v.status === 'В ремонте' ? 'badge-yellow' : 'badge-red'}>{v.status}</span></td>
                <td style={{padding:'10px 16px'}}>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button onClick={() => openEdit(v)} style={{padding:'4px',backgroundColor:'transparent',border:'none',color:'#94a3b8',cursor:'pointer'}}><Pencil size={16}/></button>
                    <button onClick={() => handleDelete(v.id)} style={{padding:'4px',backgroundColor:'transparent',border:'none',color:'#94a3b8',cursor:'pointer'}}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Редактировать ТС' : 'Добавить ТС'}>
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          <div><label className="form-label">Гос номер</label><input className="form-input" value={form.plate} onChange={(e) => setForm({...form, plate: e.target.value})} placeholder="А000АА00" /></div>
          <div><label className="form-label">Водитель</label><input className="form-input" value={form.driver} onChange={(e) => setForm({...form, driver: e.target.value})} placeholder="Иванов И.И." /></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            <div><label className="form-label">Тип топлива</label><select className="form-select" value={form.fuelType} onChange={(e) => setForm({...form, fuelType: e.target.value})}><option>Дизель</option><option>Бензин</option><option>Газ</option><option>Электро</option></select></div>
            <div><label className="form-label">Объём бака (л)</label><input className="form-input" type="number" value={form.tankVolume} onChange={(e) => setForm({...form, tankVolume: parseInt(e.target.value)||0})} /></div>
          </div>
          <div><label className="form-label">Год выпуска</label><input className="form-input" type="number" value={form.year} onChange={(e) => setForm({...form, year: parseInt(e.target.value)||2024})} /></div>
          <div style={{display:'flex',gap:'10px',justifyContent:'flex-end',marginTop:'8px'}}>
            <button className="btn-outline" onClick={() => setIsModalOpen(false)}>Отмена</button>
            <button className="btn-purple" onClick={handleSave}>{editing ? 'Сохранить' : 'Добавить'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
