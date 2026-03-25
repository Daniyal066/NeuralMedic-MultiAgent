import React from 'react';
import Link from 'next/link';
import { fetchPatientContext } from './actions';

const Dashboard = async () => {
  const contextDataList = await fetchPatientContext("demo_session_1");
  const contextData = contextDataList?.[0] || null;

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen" style={{fontFamily:"'Inter',sans-serif"}}>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#3c4a42]/15 shadow-[0px_20px_40px_rgba(6,14,32,0.4)]">
        <div className="flex justify-between items-center px-6 h-16 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-[#4edea3] font-black tracking-tighter text-xl" style={{fontFamily:"'Manrope',sans-serif"}}>Emerald Sentinel</span>
            <div className="h-4 w-[1px] bg-[#3c4a62] mx-2"></div>
            <span className="text-[#8a9bb8] text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-[#3c4a62]/30">v2.4 Neural</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link prefetch={false} className="text-[#4edea3] font-bold transition-colors duration-300" href="/">Health</Link>
            <Link prefetch={false} className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors duration-300" href="/history">History</Link>
            <Link prefetch={false} className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors duration-300" href="/intake">Consult</Link>
            <Link prefetch={false} className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors duration-300" href="/share">Settings</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-[#8a9bb8]">notifications</button>
            <div className="w-8 h-8 rounded-full bg-[#4edea3]/20 border border-[#4edea3]/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#4edea3] text-sm">person</span>
            </div>
          </div>
        </div>
      </header>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full z-40 bg-[#0b1326] w-64 hidden lg:flex flex-col border-r border-[#3c4a62]/15 pt-20">
        <div className="px-6 mb-8">
          <h2 className="font-bold text-[#4edea3]" style={{fontFamily:"'Manrope',sans-serif"}}>Patient Portal</h2>
          <p className="text-xs text-[#8a9bb8] opacity-70">ID: #882-ES</p>
        </div>
        <nav className="flex-1 space-y-1">
          <Link prefetch={false} className="flex items-center gap-3 px-4 py-3 bg-[#131b2e] text-[#4edea3] border-l-4 border-[#4edea3] text-sm transition-all duration-300" href="/">
            <span className="material-symbols-outlined">dashboard</span><span>Overview</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-6 transition-all duration-300 text-sm" href="/intake">
            <span className="material-symbols-outlined">mic_external_on</span><span>Symptom Checker</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-6 transition-all duration-300 text-sm" href="/history">
            <span className="material-symbols-outlined">folder_managed</span><span>Medical Records</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-6 transition-all duration-300 text-sm" href="/">
            <span className="material-symbols-outlined">biotech</span><span>Lab Results</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-6 transition-all duration-300 text-sm" href="/share">
            <span className="material-symbols-outlined">qr_code_scanner</span><span>Doctor Access</span>
          </Link>
        </nav>
        <div className="p-6">
          <button className="w-full py-3 bg-[#2d1515] text-[#ef4444] rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">emergency_home</span> Emergency SOS
          </button>
        </div>
      </aside>
      {/* Main */}
      <main className="lg:ml-64 pt-20 px-6 pb-24 max-w-[1400px] mx-auto">
        {/* Hero Banner */}
        <section className="mb-8 rounded-3xl bg-gradient-to-br from-[#4edea3]/10 to-[#10b981]/5 border border-[#4edea3]/20 p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#4edea3] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0b1a12] fill-current">auto_awesome</span>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-[#4edea3]" style={{fontFamily:"'Manrope',sans-serif"}}>Clinical Insight Engine</h3>
              <p className="text-[#8a9bb8] leading-relaxed max-w-3xl whitespace-pre-wrap">
                {contextData?.analysis_summary || "Synthesizing clinical baseline. Once you begin your discovery phase in the Symptom Checker, your personalized RAG Analysis and Similar Cases will populate here instantly."}
              </p>
              <div className="flex gap-4 pt-2">
                <Link prefetch={false} href="/intake" className="text-xs font-bold text-[#4edea3] flex items-center gap-1 hover:underline">
                  START SYMPTOM CHECK <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: "favorite", label: "Heart Rate", value: "72 bpm", color: "#ef4444" },
            { icon: "water_drop", label: "Blood O₂", value: "98%", color: "#4edea3" },
            { icon: "thermostat", label: "Temperature", value: "36.8°C", color: "#f59e0b" },
            { icon: "speed", label: "Blood Pressure", value: "119/79", color: "#7b9fe8" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#131b2e] rounded-2xl p-5 border border-[#3c4a62]/20 hover:border-[#4edea3]/20 transition-all">
              <span className="material-symbols-outlined text-2xl mb-2" style={{color: stat.color}}>{stat.icon}</span>
              <div className="text-2xl font-bold" style={{fontFamily:"'Manrope',sans-serif"}}>{stat.value}</div>
              <div className="text-xs text-[#8a9bb8] uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
        {/* Upcoming & Medications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#131b2e] rounded-2xl p-6 border border-[#3c4a62]/20">
            <h3 className="font-bold text-[#4edea3] mb-4 flex items-center gap-2" style={{fontFamily:"'Manrope',sans-serif"}}>
              <span className="material-symbols-outlined text-sm">calendar_today</span> Upcoming Appointments
            </h3>
            {[
              { name: "Dr. Patel – Cardiology", date: "Mar 28, 2025", time: "10:30 AM" },
              { name: "Lab Work – Full Panel", date: "Apr 2, 2025", time: "8:00 AM" },
            ].map((apt) => (
              <div key={apt.name} className="flex justify-between items-center py-3 border-b border-[#3c4a62]/20 last:border-0">
                <div>
                  <div className="text-sm font-semibold">{apt.name}</div>
                  <div className="text-xs text-[#8a9bb8]">{apt.date} • {apt.time}</div>
                </div>
                <span className="material-symbols-outlined text-[#4edea3] text-sm">chevron_right</span>
              </div>
            ))}
          </div>
          <div className="bg-[#131b2e] rounded-2xl p-6 border border-[#3c4a62]/20">
            <h3 className="font-bold text-[#4edea3] mb-4 flex items-center gap-2" style={{fontFamily:"'Manrope',sans-serif"}}>
              <span className="material-symbols-outlined text-sm">medication</span> Active Medications
            </h3>
            {[
              { name: "Metformin 500mg", schedule: "Twice daily with food" },
              { name: "Lisinopril 10mg", schedule: "Once daily, morning" },
              { name: "Vitamin D3 2000IU", schedule: "Once daily" },
            ].map((med) => (
              <div key={med.name} className="flex items-start gap-3 py-3 border-b border-[#3c4a62]/20 last:border-0">
                <span className="material-symbols-outlined text-[#4edea3] text-sm mt-0.5">check_circle</span>
                <div>
                  <div className="text-sm font-semibold">{med.name}</div>
                  <div className="text-xs text-[#8a9bb8]">{med.schedule}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Mobile NavBar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#131b2e]/90 backdrop-blur-2xl border-t border-[#3c4a62]/10 rounded-t-3xl">
        <Link prefetch={false} className="flex flex-col items-center justify-center bg-gradient-to-br from-[#4edea3]/20 to-[#10b981]/10 text-[#4edea3] rounded-xl px-4 py-2 active:scale-95 transition-transform" href="/">
          <span className="material-symbols-outlined">monitoring</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Health</span>
        </Link>
        <Link prefetch={false} className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 active:scale-95 transition-transform hover:text-[#4edea3]" href="/history">
          <span className="material-symbols-outlined">history_edu</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">History</span>
        </Link>
        <Link prefetch={false} className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 active:scale-95 transition-transform hover:text-[#4edea3]" href="/intake">
          <span className="material-symbols-outlined">forum</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Consult</span>
        </Link>
        <Link prefetch={false} className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 active:scale-95 transition-transform hover:text-[#4edea3]" href="/share">
          <span className="material-symbols-outlined">settings_heart</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default Dashboard;
