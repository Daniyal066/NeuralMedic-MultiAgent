export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">NeuralMedic Clinical Console</h1>
            <p className="text-xs text-slate-400">Multi-Agent Task & Triage Orchestrator</p>
          </div>
          <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-mono">
            System Online
          </span>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-medium text-slate-400">Active Tasks</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-medium text-slate-400">Redis Broker</h3>
            <p className="text-3xl font-bold mt-2 text-emerald-400">Connected</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-medium text-slate-400">PostgreSQL Vector DB</h3>
            <p className="text-3xl font-bold mt-2 text-emerald-400">pgvector Ready</p>
          </div>
        </main>
      </div>
    </div>
  );
}
