import React from 'react';
import Link from 'next/link';

const HistoryPortal = () => {
  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen" style={{fontFamily:"'Inter',sans-serif"}}>
      <header className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#3c4a62]/15">
        <div className="flex justify-between items-center px-6 h-16 max-w-[1600px] mx-auto">
          <span className="text-[#4edea3] font-black tracking-tighter text-xl" style={{fontFamily:"'Manrope',sans-serif"}}>Emerald Sentinel</span>
          <nav className="hidden md:flex items-center gap-8">
            <Link prefetch={false} className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors" href="/">Health</Link>
            <Link prefetch={false} className="text-[#4edea3] font-bold transition-colors" href="/history">History</Link>
            <Link prefetch={false} className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors" href="/intake">Consult</Link>
            <Link prefetch={false} className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors" href="/share">Settings</Link>
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
          <Link prefetch={false} className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-4 transition-all" href="/">
            <span className="material-symbols-outlined">dashboard</span><span className="text-sm">Overview</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-4 transition-all" href="/intake">
            <span className="material-symbols-outlined">mic_external_on</span><span className="text-sm">Symptom Checker</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#131b2e] text-[#4edea3] border-l-4 border-[#4edea3] pl-4" href="/history">
            <span className="material-symbols-outlined">folder_managed</span><span className="text-sm">Medical Records</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-4 transition-all" href="/">
            <span className="material-symbols-outlined">biotech</span><span className="text-sm">Lab Results</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-4 transition-all" href="/share">
            <span className="material-symbols-outlined">qr_code_scanner</span><span className="text-sm">Doctor Access</span>
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
          <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{fontFamily:"'Manrope',sans-serif"}}>Medical History</h1>
          <p className="text-[#8a9bb8] mb-8">Complete clinical history for patient #882-ES</p>
          {/* Timeline */}
          <div className="space-y-6">
            {[
              { date: "Mar 2025", title: "Annual Physical Exam", doctor: "Dr. Patel", type: "Routine", notes: "All vitals normal. Blood pressure slightly elevated at 128/82. Recommended dietary changes.", icon: "stethoscope", color: "#4edea3" },
              { date: "Jan 2025", title: "Type 2 Diabetes Management", doctor: "Dr. Kumari", type: "Chronic Care", notes: "HbA1c at 7.2% — within target. Continuing Metformin 500mg twice daily. Next check in 3 months.", icon: "glucose", color: "#7b9fe8" },
              { date: "Nov 2024", title: "Hypertension Follow-up", doctor: "Dr. Patel", type: "Chronic Care", notes: "BP 119/79 — excellent response to Lisinopril 10mg. Maintaining current regimen.", icon: "monitor_heart", color: "#f59e0b" },
              { date: "Sep 2024", title: "Lab Results - Full Panel", doctor: "Lab Technician", type: "Labs", notes: "Cholesterol: 180 mg/dL (Good). Creatinine: 0.9 (Normal). Vitamin D: 32 ng/mL (Sufficient).", icon: "biotech", color: "#f87171" },
            ].map((record) => (
              <div key={record.title} className="relative flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border-2" style={{borderColor: record.color, backgroundColor: record.color + '20'}}>
                    <span className="material-symbols-outlined text-sm" style={{color: record.color}}>{record.icon}</span>
                  </div>
                  <div className="w-0.5 bg-[#3c4a62]/30 flex-1 mt-2"></div>
                </div>
                <div className="flex-1 bg-[#131b2e] rounded-2xl p-5 border border-[#3c4a62]/20 mb-2 hover:border-[#4edea3]/20 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-[#dae2fd]" style={{fontFamily:"'Manrope',sans-serif"}}>{record.title}</h3>
                      <p className="text-xs text-[#8a9bb8]">{record.doctor} • {record.date}</p>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider" style={{backgroundColor: record.color + '20', color: record.color}}>{record.type}</span>
                  </div>
                  <p className="text-sm text-[#dae2fd]/70 leading-relaxed">{record.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#131b2e]/90 backdrop-blur-2xl border-t border-[#3c4a62]/10 rounded-t-3xl">
        <Link prefetch={false} className="flex flex-col items-center text-[#dae2fd]/50 px-4 py-2 active:scale-95 hover:text-[#4edea3]" href="/">
          <span className="material-symbols-outlined">monitoring</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Health</span>
        </Link>
        <Link prefetch={false} className="flex flex-col items-center bg-gradient-to-br from-[#4edea3]/20 to-[#10b981]/10 text-[#4edea3] rounded-xl px-4 py-2 active:scale-95" href="/history">
          <span className="material-symbols-outlined">history_edu</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">History</span>
        </Link>
        <Link prefetch={false} className="flex flex-col items-center text-[#dae2fd]/50 px-4 py-2 active:scale-95 hover:text-[#4edea3]" href="/intake">
          <span className="material-symbols-outlined">forum</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Consult</span>
        </Link>
        <Link prefetch={false} className="flex flex-col items-center text-[#dae2fd]/50 px-4 py-2 active:scale-95 hover:text-[#4edea3]" href="/share">
          <span className="material-symbols-outlined">settings_heart</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default HistoryPortal;
