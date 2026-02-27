"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (login && password) {
      localStorage.setItem("auth_token", "authenticated");
      localStorage.setItem("user_login", login);
      router.push("/dashboard");
    } else {
      setError("Введите логин и пароль");
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="w-full max-w-md p-8 bg-dark-card rounded-2xl border border-dark-border shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-purple-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
        </div>
        <h1 className="text-2xl font-bold text-center text-white mb-2">Добро пожаловать</h1>
        <p className="text-center text-gray-400 mb-8">Войдите в систему управления логистикой</p>
        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Логин</label>
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Введите логин"
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-primary transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Пароль</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Введите пароль"
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-primary transition-colors" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-purple-primary hover:bg-purple-hover text-white font-medium rounded-lg transition-colors disabled:opacity-50">
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
