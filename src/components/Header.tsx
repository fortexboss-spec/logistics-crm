'use client';
import { Moon, User } from 'lucide-react';
interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}
export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px'}}>
      <div>
        <h1 style={{fontSize:'24px',fontWeight:'bold',color:'#f1f5f9'}}>{title}</h1>
        {subtitle && <p style={{fontSize:'14px',color:'#64748b',marginTop:'4px'}}>{subtitle}</p>}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
        {actions}
        <button style={{padding:'8px',borderRadius:'8px',backgroundColor:'transparent',border:'1px solid #2a3548',color:'#94a3b8',cursor:'pointer'}}>
          <Moon size={18} />
        </button>
        <button style={{padding:'8px',borderRadius:'8px',backgroundColor:'transparent',border:'1px solid #2a3548',color:'#94a3b8',cursor:'pointer'}}>
          <User size={18} />
        </button>
      </div>
    </header>
  );
}
