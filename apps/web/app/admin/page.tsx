'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Task {
  id: string;
  patientId: string;
  agent: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  createdAt: string;
}

interface FeedData {
  stats: {
    activeTasks: number;
    redisStatus: string;
    vectorDbStatus: string;
  };
  tasks: Task[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<FeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error('Failed to fetch task feed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Navigation & Logout */}
        <header className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">NeuralMedic Clinical Console</h1>
            <p className="text-xs text-slate-400">Multi-Agent Task & Triage Orchestrator</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/sessions"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-3 py-1.5 border border-cyan-800 rounded-md bg-cyan-950/40"
            >
              Session Inspector &rarr;
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 border border-slate-700 hover:border-slate-600 rounded-md bg-slate-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* System Health Status Banner */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium">Orchestrator Online</span>
          <span className="text-slate-500">• Real-time updates active</span>
        </div>

        {/* Metrics Grid */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-medium text-slate-400">Active Queue Tasks</h3>
            <p className="text-3xl font-bold mt-2 text-cyan-400">
              {loading ? '...' : data?.stats.activeTasks ?? 0}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-medium text-slate-400">Redis Broker</h3>
            <p className="text-3xl font-bold mt-2 text-emerald-400">
              {loading ? '...' : data?.stats.redisStatus}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-medium text-slate-400">PostgreSQL Vector DB</h3>
            <p className="text-3xl font-bold mt-2 text-emerald-400">
              {loading ? '...' : data?.stats.vectorDbStatus}
            </p>
          </div>
        </main>

        {/* Live Task Feed Table */}
        <section className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase">
              Recent Agent Execution Stream
            </h2>
            <span className="text-xs text-slate-500">Auto-refreshing every 3s</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/50 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Task ID</th>
                  <th className="px-6 py-3">Patient ID</th>
                  <th className="px-6 py-3">Assigned Agent</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-slate-500">
                      Loading clinical task stream...
                    </td>
                  </tr>
                ) : (
                  data?.tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-200">{task.id}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{task.patientId}</td>
                      <td className="px-6 py-4 font-medium text-slate-100">{task.agent}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs rounded border font-mono ${
                            task.priority === 'URGENT'
                              ? 'bg-rose-950 text-rose-400 border-rose-800'
                              : task.priority === 'HIGH'
                              ? 'bg-amber-950 text-amber-400 border-amber-800'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs rounded border font-mono ${
                            task.status === 'COMPLETED'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : task.status === 'PROCESSING'
                              ? 'bg-cyan-950 text-cyan-400 border-cyan-800 animate-pulse'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
