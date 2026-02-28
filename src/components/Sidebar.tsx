'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Car, Package, Truck, Phone, Activity, Key, Building2, Route, BarChart3, FileText, ChevronRight } from 'lucide-react';
const menuGroups = [
  {
    label: 'Основное',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Водители', href: '/drivers', icon: Users },
      { name: 'Автопарк', href: '/vehicles', icon: Car },
      { name: 'Коробки', href: '/boxes', icon: Package },
    ]
  },
  {
    label: 'Операции',
    items: [
      { name: 'Доставки', href: '/deliveries', icon: Truck },
      { name: 'Звонки', href: '/calls', icon: Phone },
      { name: 'Расчет зарплаты', href: '/waysheets', icon: FileText },
    ]
  },
  {
    label: 'Wildberries',
    items: [
      { name: 'WB Мониторинг', href: '/wb-monitoring', icon: Activity },
      { name: 'Остатки ПМ', href: '/wb-monitoring/last-mile', icon: BarChart3 },
      { name: 'WB Аккаунты', href: '/wb-accounts', icon: Key },
    ]
  },
  {
    label: 'Аналитика',
    items: [
      { name: 'Перевозчики', href: '/organizations', icon: Building2 },
      { name: 'Маршруты', href: '/routes', icon: Route },
      { name: 'Аналитика маршрутов', href: '/routes-analytics', icon: BarChart3 },
    ]
  },
];
export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside style={{width:'240px',minWidth:'240px',minHeight:'100vh',backgroundColor:'#1a1125',display:'flex',flexDirection:'column',padding:'12px 8px',borderRight:'1px solid #2d1f3d'}}>
      <div style={{padding:'10px 8px',marginBottom:'8px',display:'flex',alignItems:'center',gap:'8px'}}>
        <div style={{width:'28px',height:'28px',borderRadius:'8px',background:'linear-gradient(135deg,#7c3aed,#a855f7)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Truck size={14} color="white" />
        </div>
        <span style={{fontSize:'15px',fontWeight:700,color:'#e7e2f0',letterSpacing:'-0.3px'}}>Логистика</span>
      </div>
      <nav style={{display:'flex',flexDirection:'column',gap:'16px',flex:1}}>
        {menuGroups.map((group) => (
          <div key={group.label}>
            <div style={{padding:'0 8px',marginBottom:'4px'}}>
              <span style={{fontSize:'10px',fontWeight:600,color:'#6b5f7a',textTransform:'uppercase',letterSpacing:'0.8px'}}>{group.label}</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'1px'}}>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}
                    style={{
                      display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',
                      fontSize:'13px',color: isActive ? '#e7e2f0' : '#a89fba',
                      backgroundColor: isActive ? '#3b1f5e' : 'transparent',
                      borderRadius:'8px',textDecoration:'none',transition:'all 0.15s',
                      borderLeft: isActive ? '2px solid #8b5cf6' : '2px solid transparent',
                      fontWeight: isActive ? 600 : 400,
                    }}
                    onMouseEnter={(e) => { if(!isActive) { e.currentTarget.style.backgroundColor='#2d1f3d'; e.currentTarget.style.color='#e7e2f0'; }}}
                    onMouseLeave={(e) => { if(!isActive) { e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.color='#a89fba'; }}}
                  >
                    <Icon size={15} style={{opacity: isActive ? 1 : 0.6, color: isActive ? '#a855f7' : 'inherit'}} />
                    <span style={{flex:1}}>{item.name}</span>
                    {isActive && <ChevronRight size={12} style={{opacity:0.5}} />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div style={{padding:'12px 8px',borderTop:'1px solid #2d1f3d',marginTop:'8px'}}>
        <div style={{fontSize:'11px',color:'#6b5f7a',textAlign:'center'}}>CRM Логистика v1.0</div>
      </div>
    </aside>
  );
}

