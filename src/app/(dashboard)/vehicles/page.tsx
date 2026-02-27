'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
interface Vehicle { id: number; plate: string; driver: string; fuelType: string; tankVolume: number; year: number; status: string; }
const init: Vehicle[] = [
  { id:1, plate:'К599ОС76', driver:'Смирнов О.Д.', fuelType:'Дизель', tankVolume:70, year:2021, status:'На линии' },
  { id:2, plate:'О461YH76', driver:'Разгуляев Е.Е.', fuelType:'Бензин', tankVolume:60, year:2020, status:'На линии' },
  { id:3, plate:'К529YO797', driver:'Шабаров В.С.', fuelType:'Дизель', tankVolume:80, year:2022, status:'На линии' },
  { id:4, plate:'О987ХМ44', driver:'Коуров В.В.', fuelType:'Дизель', tankVolume:70, year:2019, status:'В ремонте' },
  { id:5, plate:'Y942MX44', driver:'Ахмедов Э.А.', fuelType:'Бензин', tankVolume:55, year:2023, status:'На линии' },
  { id:6, plate:'Н262КС76', driver:'Данилов Д.А.', fuelType:'Дизель', tankVolume:70, year:2021, status:'На линии' },
];
export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(init);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle|null>(null);
  const [form, setForm] = useState({plate:'',driver:'',fuelType:'Дизель',tankVolume:70,year:2024});
  const filtered = vehicles.filter(v=>v.plate.toLowerCase().includes(search.toLowerCase())||v.driver.toLowerCase().includes(search.toLowerCase()));
  const openCreate = () => {setEditing(null);setForm({plate:'',driver:'',fuelType:'Дизель',tankVolume:70,year:2024});setIsModalOpen(true);};
  const openEdit = (v:Vehicle) => {setEditing(v);setForm({plate:v.plate,driver:v.driver,fuelType:v.fuelType,tankVolume:v.tankVolume,year:v.year});setIsModalOpen(true);};
  const handleSave = () => {if(editing){setVehicles(p=>p.map(v=>v.id===editing.id?{...v,...form}:v));}else{setVehicles(p=>[...p,{id:Date.now(),...form,status:'На линии'}]);}setIsModalOpen(false);};
  const handleDelete = (id:number) => {if(confirm('Удалить ТС?'))setVehicles(p=>p.filter(v=>v.id!==id));};
  return (
    <div>
      <Header title="Автопарк" actions={<button className="btn-primary" onClick={openCreate}><Plus size={16}/> Добавить ТС</button>}/>
      <div style={{marginBottom:'16px'}}><div style={{position:'relative',display:'inline-block'}}><Search size={16} style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#6b6b7b'}}/><input type="text" placeholder="Поиск по номеру, водителю..." value={search} onChange={e=>setSearch(e.target.value)} className="form-input" style={{paddingLeft:'36px',width:'300px'}}/></div></div>
      <div style={{borderRadius:'8px',border:'1px solid #464652',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'14px'}}>
          <thead><tr style={{borderBottom:'1px solid #464652'}}>{['Гос номер','Водитель','Тип топлива','Объём бака','Год выпуска','Статус','Действия'].map(h=>(<th key={h} style={{padding:'12px 16px',textAlign:'left',color:'#9d9dab',fontWeight:500}}>{h}</th>))}</tr></thead>
          <tbody>{filtered.map(v=>(<tr key={v.id} style={{borderBottom:'1px solid #464652'}}>
            <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{v.plate}</td>
            <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{v.driver}</td>
            <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{v.fuelType}</td>
            <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{v.tankVolume} л</td>
            <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{v.year}</td>
            <td style={{padding:'14px 16px'}}><span className={v.status==='На линии'?'badge-active':'badge-yellow'}>{v.status}</span></td>
            <td style={{padding:'14px 16px'}}><div style={{display:'flex',gap:'4px'}}><button onClick={()=>openEdit(v)} style={{padding:'6px',backgroundColor:'transparent',border:'none',color:'#9d9dab',cursor:'pointer'}}><Pencil size={16}/></button><button onClick={()=>handleDelete(v.id)} style={{padding:'6px',backgroundColor:'transparent',border:'none',color:'#9d9dab',cursor:'pointer'}}><Trash2 size={16}/></button></div></td>
          </tr>))}</tbody></table></div>
      <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} title={editing?'Редактировать ТС':'Добавить ТС'}>
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          <div><label className="form-label">Гос номер</label><input className="form-input" value={form.plate} onChange={e=>setForm({...form,plate:e.target.value})} placeholder="А000АА00"/></div>
          <div><label className="form-label">Водитель</label><input className="form-input" value={form.driver} onChange={e=>setForm({...form,driver:e.target.value})} placeholder="Иванов И.И."/></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div><label className="form-label">Тип топлива</label><select className="form-select" value={form.fuelType} onChange={e=>setForm({...form,fuelType:e.target.value})}><option>Дизель</option><option>Бензин</option><option>Газ</option></select></div><div><label className="form-label">Объём бака (л)</label><input className="form-input" type="number" value={form.tankVolume} onChange={e=>setForm({...form,tankVolume:parseInt(e.target.value)||0})}/></div></div>
          <div><label className="form-label">Год выпуска</label><input className="form-input" type="number" value={form.year} onChange={e=>setForm({...form,year:parseInt(e.target.value)||2024})}/></div>
          <div style={{display:'flex',gap:'10px',justifyContent:'flex-end',marginTop:'8px'}}><button className="btn-outline" onClick={()=>setIsModalOpen(false)}>Отмена</button><button className="btn-primary" onClick={handleSave}>{editing?'Сохранить':'Добавить'}</button></div>
        </div>
      </Modal>
    </div>);
}
