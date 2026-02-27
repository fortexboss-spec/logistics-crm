'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
interface Route { id:number;number:string;name:string;normSK:number;payType:string;payment:number;fines:number;status:string; }
const init: Route[] = [
  {id:1,number:'M-001',name:'Ярославль - Москва',normSK:350,payType:'Ставка',payment:15000,fines:500,status:'Активен'},
  {id:2,number:'M-002',name:'Ярославль - СПб',normSK:400,payType:'Ставка',payment:18000,fines:700,status:'Активен'},
  {id:3,number:'M-003',name:'Москва - Казань',normSK:500,payType:'За коробку',payment:45,fines:300,status:'Активен'},
  {id:4,number:'M-004',name:'СПб - Нижний Новгород',normSK:420,payType:'Ставка',payment:20000,fines:600,status:'Неактивен'},
  {id:5,number:'M-005',name:'Ярославль - Кострома',normSK:200,payType:'Ставка',payment:8000,fines:200,status:'Активен'},
];
export default function RoutesPage() {
  const [routes,setRoutes]=useState<Route[]>(init);const [search,setSearch]=useState('');const [isModalOpen,setIsModalOpen]=useState(false);const [editing,setEditing]=useState<Route|null>(null);
  const [form,setForm]=useState({number:'',name:'',normSK:0,payType:'Ставка',payment:0,fines:0});
  const filtered=routes.filter(r=>r.number.toLowerCase().includes(search.toLowerCase())||r.name.toLowerCase().includes(search.toLowerCase()));
  const openCreate=()=>{setEditing(null);setForm({number:'',name:'',normSK:0,payType:'Ставка',payment:0,fines:0});setIsModalOpen(true);};
  const openEdit=(r:Route)=>{setEditing(r);setForm({number:r.number,name:r.name,normSK:r.normSK,payType:r.payType,payment:r.payment,fines:r.fines});setIsModalOpen(true);};
  const handleSave=()=>{if(editing){setRoutes(p=>p.map(r=>r.id===editing.id?{...r,...form}:r));}else{setRoutes(p=>[...p,{id:Date.now(),...form,status:'Активен'}]);}setIsModalOpen(false);};
  const handleDelete=(id:number)=>{if(confirm('Удалить?'))setRoutes(p=>p.filter(r=>r.id!==id));};
  return (<div>
    <Header title="Маршруты" actions={<button className="btn-primary" onClick={openCreate}><Plus size={16}/> Добавить маршрут</button>}/>
    <div style={{marginBottom:'16px'}}><div style={{position:'relative',display:'inline-block'}}><Search size={16} style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#6b6b7b'}}/><input type="text" placeholder="Поиск маршрутов..." value={search} onChange={e=>setSearch(e.target.value)} className="form-input" style={{paddingLeft:'36px',width:'300px'}}/></div></div>
    <div style={{borderRadius:'8px',border:'1px solid #464652',overflow:'hidden'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:'14px'}}>
        <thead><tr style={{borderBottom:'1px solid #464652'}}>{['Номер','Название','Норма ШК','Тип оплаты','Оплата','Штрафы','Статус','Действия'].map(h=>(<th key={h} style={{padding:'12px 16px',textAlign:'left',color:'#9d9dab',fontWeight:500}}>{h}</th>))}</tr></thead>
        <tbody>{filtered.map(r=>(<tr key={r.id} style={{borderBottom:'1px solid #464652'}}>
          <td style={{padding:'14px 16px',color:'#ba85ff',fontWeight:500}}>{r.number}</td>
          <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{r.name}</td>
          <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{r.normSK}</td>
          <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{r.payType}</td>
          <td style={{padding:'14px 16px',color:'#e7e2f0'}}>{r.payment.toLocaleString()} P</td>
          <td style={{padding:'14px 16px',color:'#ef4444'}}>{r.fines.toLocaleString()} P</td>
          <td style={{padding:'14px 16px'}}><span className={r.status==='Активен'?'badge-active':'badge-inactive'}>{r.status}</span></td>
          <td style={{padding:'14px 16px'}}><div style={{display:'flex',gap:'4px'}}><button onClick={()=>openEdit(r)} style={{padding:'6px',backgroundColor:'transparent',border:'none',color:'#9d9dab',cursor:'pointer'}}><Pencil size={16}/></button><button onClick={()=>handleDelete(r.id)} style={{padding:'6px',backgroundColor:'transparent',border:'none',color:'#9d9dab',cursor:'pointer'}}><Trash2 size={16}/></button></div></td>
        </tr>))}</tbody></table></div>
    <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} title={editing?'Редактировать маршрут':'Добавить маршрут'}>
      <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:'12px'}}><div><label className="form-label">Номер</label><input className="form-input" value={form.number} onChange={e=>setForm({...form,number:e.target.value})} placeholder="M-006"/></div><div><label className="form-label">Название</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Город - Город"/></div></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div><label className="form-label">Норма ШК</label><input className="form-input" type="number" value={form.normSK} onChange={e=>setForm({...form,normSK:parseInt(e.target.value)||0})}/></div><div><label className="form-label">Тип оплаты</label><select className="form-select" value={form.payType} onChange={e=>setForm({...form,payType:e.target.value})}><option>Ставка</option><option>За коробку</option><option>Процент</option></select></div></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div><label className="form-label">Оплата</label><input className="form-input" type="number" value={form.payment} onChange={e=>setForm({...form,payment:parseFloat(e.target.value)||0})}/></div><div><label className="form-label">Штрафы</label><input className="form-input" type="number" value={form.fines} onChange={e=>setForm({...form,fines:parseFloat(e.target.value)||0})}/></div></div>
        <div style={{display:'flex',gap:'10px',justifyContent:'flex-end',marginTop:'8px'}}><button className="btn-outline" onClick={()=>setIsModalOpen(false)}>Отмена</button><button className="btn-primary" onClick={handleSave}>{editing?'Сохранить':'Добавить'}</button></div>
      </div>
    </Modal>
  </div>);
}
