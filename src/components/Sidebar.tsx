'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Car, Package, Truck, Phone, Activity, Key, Building2, Route, BarChart3, FileText } from 'lucide-react';
const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Водители', href: '/drivers', icon: Users },
  { name: 'Автопарк', href: '/vehicles', icon: Car },
  { name: 'Коробки', href: '/boxes', icon: Package },
  { name: 'Доставки', href: '/deliveries', icon: Truck },
  { name: 'Звонки', href: '/calls', icon: Phone },
  { name: 'WB Мониторинг', href: '/wb-monitoring', icon: Activity },
  { name: 'WB Аккаунты', href: '/wb-accounts', icon: Key },
  { name: 'Перевозчики', href: '/organizations', icon: Building2 },
  { name: 'Маршруты', href: '/routes', icon: Route },
  { name: 'Аналитика маршрутов', href: '/routes-analytics', icon: BarChart3 },
  { name: 'Расчет зарплаты', href: '/waysheets', icon: FileText },
];
export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside style={{width:'220px',minHeight:'100vh',backgroundColor:'#1a1040',borderRight:'1px solid #2a3548',padding:'16px 0',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'0 20px',marginBottom:'24px'}}>
        <h1 style={{fontSize:'18px',fontWeight:'bold',color:'#8b5cf6'}}>Логистика</h1>
      </div>
      <nav style={{flex:1}}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}
              style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 20px',fontSize:'14px',
                color: isActive ? '#fff' : '#94a3b8',
                backgroundColor: isActive ? '#8b5cf6' : 'transparent',
                borderRadius: isActive ? '8px' : '0',
                margin: isActive ? '2px 8px' : '2px 0',
                textDecoration:'none',
                transition:'all 0.2s'
              }}
              onMouseEnter={(e) => { if(!isActive) { e.currentTarget.style.backgroundColor='#2a1a5e'; e.currentTarget.style.color='#e2e8f0'; }}}
              onMouseLeave={(e) => { if(!isActive) { e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.color='#94a3b8'; }}}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
