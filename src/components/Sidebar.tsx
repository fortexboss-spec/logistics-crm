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
    <aside style={{width:'240px',minWidth:'240px',minHeight:'100vh',backgroundColor:'#291e38',display:'flex',flexDirection:'column',padding:'12px 8px'}}>
      <div style={{padding:'6px 8px',marginBottom:'16px'}}>
        <span style={{fontSize:'14px',fontWeight:600,color:'#e7e2f0'}}>Логистика</span>
      </div>
      <nav style={{display:'flex',flexDirection:'column',gap:'2px'}}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}
              style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px',fontSize:'14px',
                color:'#e7e2f0',
                backgroundColor: isActive ? '#452b65' : 'transparent',
                borderRadius:'8px',
                textDecoration:'none',
                transition:'background-color 0.15s'
              }}
              onMouseEnter={(e) => { if(!isActive) e.currentTarget.style.backgroundColor='#352248'; }}
              onMouseLeave={(e) => { if(!isActive) e.currentTarget.style.backgroundColor='transparent'; }}
            >
              <Icon size={16} style={{opacity: isActive ? 1 : 0.7}} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
