'use client';
import { X } from 'lucide-react';
import { useEffect } from 'react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
          <h2 style={{fontSize:'18px',fontWeight:'bold',color:'#f1f5f9'}}>{title}</h2>
          <button onClick={onClose} style={{padding:'4px',borderRadius:'6px',backgroundColor:'transparent',border:'none',color:'#94a3b8',cursor:'pointer'}}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
