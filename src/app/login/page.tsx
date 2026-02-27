'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function LoginPage() {
  const [login, setLogin] = useState('admin');
  const [password, setPassword] = useState('admin');
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login && password) {
      localStorage.setItem('crm_auth', 'true');
      router.push('/dashboard');
    }
  };
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'#18181b'}}>
      <div style={{backgroundColor:'#26262a',border:'1px solid #464652',borderRadius:'16px',padding:'40px',width:'400px',textAlign:'center'}}>
        <div style={{width:'48px',height:'48px',borderRadius:'12px',backgroundColor:'#ba85ff',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:'20px',fontWeight:'bold',color:'#0f051c'}}>C</div>
        <h1 style={{fontSize:'20px',fontWeight:'bold',color:'#e7e2f0',marginBottom:'4px'}}>Добро пожаловать</h1>
        <p style={{fontSize:'14px',color:'#9d9dab',marginBottom:'24px'}}>Войдите в систему управления логистикой</p>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <div style={{textAlign:'left'}}>
            <label className="form-label">Логин</label>
            <input className="form-input" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="admin" />
          </div>
          <div style={{textAlign:'left'}}>
            <label className="form-label">Пароль</label>
            <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="admin" />
          </div>
          <button type="submit" className="btn-primary" style={{width:'100%',justifyContent:'center',height:'40px',fontSize:'15px'}}>Войти</button>
        </form>
      </div>
    </div>
  );
}
