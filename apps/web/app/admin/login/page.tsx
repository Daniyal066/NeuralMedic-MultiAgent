'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        setError('Invalid clinical credentials');
      }
    } catch {
      setError('Authentication request failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-lg space-y-4">
        <h1 className="text-xl font-semibold text-center text-slate-100">NeuralMedic Admin</h1>
        <p className="text-xs text-slate-400 text-center">Clinical Portal Authentication</p>

        {error && <div className="text-xs text-red-400 bg-red-950/50 border border-red-900 p-2 rounded text-center">{error}</div>}

        <div>
          <label className="block text-xs text-slate-400 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-slate-600"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-slate-600"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium py-2 rounded text-sm transition-colors border border-slate-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}