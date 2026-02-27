'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const auth = localStorage.getItem('crm_auth');
    if (!auth) { router.push('/login'); } else { setIsAuth(true); }
  }, [router]);
  if (!isAuth) return null;
  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      <Sidebar />
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <main style={{flex:1,overflow:'auto'}}>
          <div style={{padding:'24px'}}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
