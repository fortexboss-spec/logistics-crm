'use client';
import { Moon, User, PanelLeft } from 'lucide-react';
interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}
export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header style={{display:'flex',alignItems:'center',height:'56px',padding:'0 16px',borderBottom:'1px solid #464652',backgroundColor:'rgba(24,24,27,0.6)',backdropFilter:'blur(12px)',position:'sticky',top:0,zIndex:10,gap:'12px'}}>
      <button style={{padding:'8px',borderRadius:'8px',backgroundColor:'transparent',border:'none',color:'#e7e2f0',cursor:'pointer',display:'flex',alignItems:'center'}}>
        <PanelLeft size={18} />
      </button>
      <h1 style={{fontSize:'16px',fontWeight:600,color:'#e7e2f0',flex:1}}>{title}</h1>
      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
        {actions}
        <button style={{padding:'8px',borderRadius:'8px',backgroundColor:'transparent',border:'none',color:'#e7e2f0',cursor:'pointer',display:'flex',alignItems:'center'}}>
          <Moon size={16} />
        </button>
        <button style={{padding:'8px',borderRadius:'8px',backgroundColor:'transparent',border:'none',color:'#e7e2f0',cursor:'pointer',display:'flex',alignItems:'center'}}>
          <User size={16} />
        </button>
      </div>
    </header>
  );
}
