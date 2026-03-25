import React from 'react';
import Link from 'next/link';

const ShareHub = () => {
  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen" style={{fontFamily:"'Inter',sans-serif"}}>
      <header className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#3c4a62]/15">
        <div className="flex justify-between items-center px-6 h-16 max-w-[1600px] mx-auto">
          <span className="text-[#4edea3] font-black tracking-tighter text-xl" style={{fontFamily:"'Manrope',sans-serif"}}>Emerald Sentinel</span>
          <nav className="hidden md:flex items-center gap-8">
            <Link prefetch={false} className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors" href="/">Health</Link>
            <Link prefetch={false} className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors" href="/history">History</Link>
            <Link prefetch={false} className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors" href="/intake">Consult</Link>
            <Link prefetch={false} className="text-[#4edea3] font-bold transition-colors" href="/share">Doctor Access</Link>
          </nav>
          <div className="w-8 h-8 rounded-full bg-[#4edea3]/20 border border-[#4edea3]/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#4edea3] text-sm">person</span>
          </div>
        </div>
      </header>
      <aside className="fixed left-0 top-0 h-full z-40 bg-[#0b1326] w-64 hidden lg:flex flex-col border-r border-[#3c4a62]/15 pt-20">
        <div className="px-6 mb-8">
          <h2 className="font-bold text-[#4edea3]" style={{fontFamily:"'Manrope',sans-serif"}}>Patient Portal</h2>
          <p className="text-xs text-[#8a9bb8] opacity-70">ID: #882-ES</p>
        </div>
        <nav className="flex-1 space-y-1">
          <Link prefetch={false} className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-6 transition-all text-sm" href="/">
            <span className="material-symbols-outlined">dashboard</span><span>Overview</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-6 transition-all text-sm" href="/intake">
            <span className="material-symbols-outlined">mic_external_on</span><span>Symptom Checker</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-6 transition-all text-sm" href="/history">
            <span className="material-symbols-outlined">folder_managed</span><span>Medical Records</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-6 transition-all text-sm" href="/">
            <span className="material-symbols-outlined">biotech</span><span>Lab Results</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-3 px-4 py-3 bg-[#131b2e] text-[#4edea3] border-l-4 border-[#4edea3] text-sm" href="/share">
            <span className="material-symbols-outlined">qr_code_scanner</span><span>Doctor Access</span>
          </Link>
        </nav>
        <div className="p-6">
          <button className="w-full py-3 bg-[#2d1515] text-[#ef4444] rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">emergency_home</span> Emergency SOS
          </button>
        </div>
      </aside>
      <main className="lg:ml-64 pt-20 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{fontFamily:"'Manrope',sans-serif"}}>Doctor Handoff</h1>
          <p className="text-[#8a9bb8] mb-8">Securely share your real-time health data with a medical professional. This session is encrypted and will expire automatically.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR Code Panel */}
            <div className="bg-[#131b2e] rounded-3xl p-8 border border-[#3c4a62]/20 flex flex-col items-center gap-6">
              <h3 className="font-bold text-[#4edea3] uppercase tracking-widest text-xs">Live Access Token</h3>
              <div className="w-48 h-48 bg-[#0b1326] rounded-2xl border-2 border-[#4edea3]/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#4edea3] text-8xl">qr_code_2</span>
              </div>
              <div className="flex items-center gap-2 text-[#8a9bb8] text-sm">
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                <span>Refreshing in <strong className="text-[#4edea3]">42s</strong></span>
              </div>
              <button className="text-[#4edea3] text-sm font-bold flex items-center gap-2 hover:underline">
                <span className="material-symbols-outlined text-sm">share</span> Generate Link Access
              </button>
            </div>
            {/* Summary Panel */}
            <div className="bg-[#131b2e] rounded-3xl p-8 border border-[#3c4a62]/20 flex flex-col gap-4">
              <h3 className="font-bold text-[#8a9bb8] uppercase tracking-widest text-xs">Summary Preview for Provider</h3>
              <div className="bg-[#0b1326] rounded-xl p-4">
                <div className="text-[10px] text-[#8a9bb8] uppercase tracking-wider mb-1">BMI / Vitals Velocity</div>
                <div className="text-lg font-bold text-[#dae2fd]" style={{fontFamily:"'Manrope',sans-serif"}}>Stable Trend</div>
                <div className="text-[#4edea3] text-xs mt-1">+2.4% Optimal Range ↑</div>
              </div>
              <div className="bg-[#0b1326] rounded-xl p-4">
                <div className="text-[10px] text-[#8a9bb8] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#4edea3]">warning</span> Chronic Conditions
                </div>
                {["Type 2 Diabetes", "Hypertension", "Mild Asthma (History)"].map(c => (
                  <div key={c} className="flex items-center gap-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                    <span className="text-sm">{c}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#0b1326] rounded-xl p-4">
                <div className="text-[10px] text-[#8a9bb8] uppercase tracking-wider mb-2">Symptom Logs</div>
                {[{s:"Joint Pain", l:"Moderate", c:"#f59e0b"}, {s:"Insomnia", l:"Mild", c:"#4edea3"}].map(item => (
                  <div key={item.s} className="flex justify-between items-center py-1">
                    <span className="text-sm">{item.s}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase" style={{backgroundColor: item.c+'20', color: item.c}}>{item.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#131b2e]/90 backdrop-blur-2xl border-t border-[#3c4a62]/10 rounded-t-3xl">
        <Link prefetch={false} className="flex flex-col items-center text-[#dae2fd]/50 px-4 py-2 active:scale-95 hover:text-[#4edea3]" href="/">
          <span className="material-symbols-outlined">monitoring</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Health</span>
        </Link>
        <Link prefetch={false} className="flex flex-col items-center text-[#dae2fd]/50 px-4 py-2 active:scale-95 hover:text-[#4edea3]" href="/history">
          <span className="material-symbols-outlined">history_edu</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">History</span>
        </Link>
        <Link prefetch={false} className="flex flex-col items-center text-[#dae2fd]/50 px-4 py-2 active:scale-95 hover:text-[#4edea3]" href="/intake">
          <span className="material-symbols-outlined">forum</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Consult</span>
        </Link>
        <Link prefetch={false} className="flex flex-col items-center bg-gradient-to-br from-[#4edea3]/20 to-[#10b981]/10 text-[#4edea3] rounded-xl px-4 py-2 active:scale-95" href="/share">
          <span className="material-symbols-outlined">settings_heart</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default ShareHub;
