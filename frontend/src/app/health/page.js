import React from 'react';
import Link from 'next/link';

export default function HealthAnalytics() {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/30 selection:text-primary min-h-screen">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#3c4a42]/15 shadow-[0px_20px_40px_rgba(6,14,32,0.4)]">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-[1600px] mx-auto">
          <div className="text-[#4edea3] font-black tracking-tighter text-xl font-headline">Emerald Sentinel</div>
          <div className="hidden md:flex items-center space-x-8 font-headline font-bold text-lg tracking-tight">
            <Link className="text-[#4edea3] font-bold hover:text-[#4edea3] transition-colors duration-300" href="/health">Health</Link>
            <Link className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors duration-300" href="/history">History</Link>
            <Link className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors duration-300" href="/intake">Consult</Link>
            <Link className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors duration-300" href="/share">Settings</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors scale-95 active:scale-90">
              <span className="material-symbols-outlined">qr_code_2</span>
            </button>
            <div className="h-10 w-10 rounded-full border-2 border-primary/20 p-0.5">
              <img alt="Patient Profile Avatar" className="h-full w-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3ezEF42AoVNEHHtH6EvIfI6NajjmNoRDQmKdSTVQtw0G6t7Sw4X9s7Hn7L7jiTYa1NbgWYi-g5awjD4QzduHuwH1YUEuOdvtUwU4zq7rj2ldMEwpGcUbxNVc2uFgTx1gxwNPSKLKwdNmelnOErbkgfxm-pwpPoyii4ph5M4AwYUp7nTL8--BjUubkkrON3_CpeiKSRUA7OmB8PPzk6ma4tzdQjjkV4XU5EIUhDtnkqHFr-NFeeOxCY6b-Ru-w0dp_fL9yU1m1On5e" />
            </div>
          </div>
        </div>
      </nav>

      {/* SideNavBar (Desktop Only) */}
      <aside className="fixed left-0 top-0 z-40 h-full w-64 hidden lg:flex flex-col bg-[#0b1326] border-r border-[#3c4a42]/15 pt-20">
        <div className="px-6 mb-8">
          <h2 className="font-headline font-bold text-[#4edea3]">Patient Portal</h2>
          <p className="text-xs text-[#dae2fd]/50">ID: #882-ES</p>
        </div>
        <nav className="flex-1 space-y-2 px-3">
          <Link className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-6 transition-all duration-300 font-['Inter'] text-sm" href="/">
            <span className="material-symbols-outlined">dashboard</span> Overview
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-6 transition-all duration-300 font-['Inter'] text-sm" href="/intake">
            <span className="material-symbols-outlined">mic_external_on</span> Symptom Checker
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 bg-[#131b2e] text-[#4edea3] border-l-4 border-[#4edea3] font-['Inter'] text-sm transition-all duration-300" href="/health">
            <span className="material-symbols-outlined">analytics</span> Health Analytics
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-6 transition-all duration-300 font-['Inter'] text-sm" href="/history">
            <span className="material-symbols-outlined">folder_managed</span> Medical Records
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-6 transition-all duration-300 font-['Inter'] text-sm" href="/share">
            <span className="material-symbols-outlined">qr_code_scanner</span> Doctor Access
          </Link>
        </nav>
        <div className="p-6">
          <button className="w-full bg-error-container text-error py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-error/20 transition-colors">
            <span className="material-symbols-outlined text-sm">emergency_home</span> Emergency SOS
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="lg:pl-64 pt-20 pb-32 px-6">
        <div className="max-w-[1200px] mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-primary font-label text-[10px] uppercase tracking-[0.2em] font-bold">Proactive Analytics</span>
              <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mt-1">Metabolic Intelligence</h1>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/10">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-medium text-on-surface-variant">Live Biometric Sync: Active</span>
            </div>
          </header>

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-8 flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-headline font-bold text-lg text-primary">Clinical Insight Engine</h3>
              <p className="text-on-surface-variant leading-relaxed max-w-3xl">
                "Based on your <span className="text-on-surface font-semibold">2023 lab results</span> and current <span className="text-on-surface font-semibold">BMI of 24.2</span>, we suggest monitoring your hydration. A slight upward trend in serum creatinine suggests your current 1.5L daily intake may be insufficient for your increased activity levels."
              </p>
              <div className="flex gap-4 pt-2">
                <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">VIEW LAB CORRELATION <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
              </div>
            </div>
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-surface-container-low rounded-[2rem] p-8 space-y-6 relative overflow-hidden group">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-headline text-xl font-bold">Metabolic Trajectory</h2>
                  <p className="text-sm text-on-surface-variant">Glucose Stability Index (Past 90 Days)</p>
                </div>
                <div className="flex gap-2">
                  <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded">OPTIMAL</span>
                </div>
              </div>
              <div className="h-64 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 1000 300">
                  <defs>
                    <linearGradient id="gradient-area" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#4edea3" stopOpacity="0.3"></stop>
                      <stop offset="100%" stopColor="#4edea3" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <path d="M0,250 Q100,240 200,210 T400,180 T600,220 T800,150 T1000,140 L1000,300 L0,300 Z" fill="url(#gradient-area)"></path>
                  <path d="M0,250 Q100,240 200,210 T400,180 T600,220 T800,150 T1000,140" fill="none" stroke="#4edea3" strokeLinecap="round" strokeWidth="4"></path>
                  <circle cx="200" cy="210" fill="#4edea3" r="6"></circle>
                  <circle cx="600" cy="220" fill="#4edea3" r="6"></circle>
                  <circle className="animate-pulse" cx="1000" cy="140" fill="#4edea3" r="8"></circle>
                </svg>
                <div className="absolute right-4 top-28 bg-surface-container-high border border-outline-variant/20 p-3 rounded-xl shadow-xl">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Current Reading</p>
                  <p className="text-2xl font-headline font-extrabold text-primary">94 <span className="text-xs font-normal text-on-surface/50">mg/dL</span></p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-outline-variant/10 pt-6">
                <div>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">A1C Estimate</p>
                  <p className="text-lg font-headline font-bold">5.2%</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Variability</p>
                  <p className="text-lg font-headline font-bold">Low</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Target Range</p>
                  <p className="text-lg font-headline font-bold">92%</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-[2rem] p-8 flex flex-col justify-between">
              <div>
                <h2 className="font-headline text-xl font-bold">Risk Assessment</h2>
                <p className="text-sm text-on-surface-variant">Chronic Condition Probability</p>
              </div>
              <div className="relative flex items-center justify-center py-8">
                <svg className="w-48 h-48 -rotate-90">
                  <circle cx="96" cy="96" fill="none" r="80" stroke="#131b2e" strokeWidth="12"></circle>
                  <circle cx="96" cy="96" fill="none" r="80" stroke="#4edea3" strokeDasharray="502" strokeDashoffset="380" strokeLinecap="round" strokeWidth="12"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-headline font-black text-on-surface">24%</span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Aggregate Risk</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">cardiology</span>
                    <span className="text-sm font-medium">Cardiovascular</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant">Low (12%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl border-l-2 border-tertiary">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary text-xl">water_drop</span>
                    <span className="text-sm font-medium">Hypertension</span>
                  </div>
                  <span className="text-xs font-bold text-tertiary">Elevated (34%)</span>
                </div>
              </div>
            </div>
          </div>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-2xl font-bold">Wellness Roadmap</h2>
              <button className="text-xs font-bold text-on-surface-variant flex items-center gap-1 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/10">
                VIA COMMERCEPULSE <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group bg-surface-container-low rounded-3xl overflow-hidden flex flex-col transition-all hover:-translate-y-1">
                <div className="h-40 relative">
                  <img alt="Activity Suggestion" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYIujSaiNEMsBy4105WnTTBLq5PsDbNED6LpUGEP91SJknLeEQ4xEdBDLuVKWXDKlRCYkyGQv9efNbLB0cMEmlEWtxAJmwAtmb5PZ3foT7t6hQ0LwV-qJ9G_S-Frwa9gf-J0tIFaL772f5Xl18cx9Bhp0vNHV9_FVNqb4pBsoh72kjP6bQq2S1h5t505SXyslj7qgHBUkL32RY5-rjuesLAty1VWby896_c75TXxmGvpaxu0tQwc3IboucsS2kK_2trEDzbXkx8EoN" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] font-black px-2 py-1 rounded uppercase">Activity</div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-headline font-bold text-lg mb-2">Zone 2 Aerobic Training</h3>
                  <p className="text-sm text-on-surface-variant mb-4 flex-1">Integrated with your treadmill; aims to lower resting HR by 4bpm over 30 days.</p>
                  <button className="w-full bg-surface-container-high py-3 rounded-xl text-xs font-bold uppercase tracking-wider group-hover:bg-primary group-hover:text-on-primary transition-colors">Update Schedule</button>
                </div>
              </div>
              <div className="group bg-surface-container-low rounded-3xl overflow-hidden flex flex-col transition-all hover:-translate-y-1">
                <div className="h-40 relative">
                  <img alt="Diet Suggestion" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSu6-Z4fic2fvQAdlHKE8Is5-XIuo5jlDEdzkFzuVgXIHnzaQBtH1HPAqb7kMPVig_m_EVvIgASZq3-95chMpKWfQeXpo3g9dHHh6rU9HEkvij2SqbNSk_SoFBiQ5E7J-WNXYdmbe1uxcfMgwmlQyHZChAgDGLy49rRiKOGzNw2ZVDfn5BeFW891UrCL9eaoJHJxszmoikvFQTF0vjWNj7iNdlg9Ki2_10ODD6dXN009L0ubsdJZCunsiy-DARDr4nFjEjuPLYPBNi" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-tertiary text-on-tertiary text-[10px] font-black px-2 py-1 rounded uppercase">Dietary</div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-headline font-bold text-lg mb-2">Magnesium Rich Protocol</h3>
                  <p className="text-sm text-on-surface-variant mb-4 flex-1">Recommended to counter mild evening muscle tension detected in sleep bio-data.</p>
                  <button className="w-full bg-surface-container-high py-3 rounded-xl text-xs font-bold uppercase tracking-wider group-hover:bg-primary group-hover:text-on-primary transition-colors">View Meal Plan</button>
                </div>
              </div>
              <div className="group bg-surface-container-low rounded-3xl overflow-hidden flex flex-col transition-all hover:-translate-y-1">
                <div className="h-40 relative">
                  <img alt="Supplement Suggestion" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-MVggw0SHJGbKhC5xCLStIuBGnqpImToUrJ2EJCAkOcbKMTAH-0FBCm2lz8IL4epTmxGQnjhTcCeLIe-OCuccsEEDSrTQNQ9ENLb0O7RU1l-HMPT97LFWmb8GwKY1M6xxterIp2YKfSAUcOmlFnjkgTTjAhj4To5liIZiDTLEOVl7aSJm7JDtibQDyaUQKk1l3FraJTJ1ani0lQvt4UQOjdVtxFgDQQU0t2z8wsPJpH8_sgAHin44Yj_C4zXZcEngp-rKaz4skOPr" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-[#6ffbbe] text-[#002113] text-[10px] font-black px-2 py-1 rounded uppercase">Supplement</div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-headline font-bold text-lg mb-2">Trace Mineral Hydration</h3>
                  <p className="text-sm text-on-surface-variant mb-4 flex-1">Aligned with Agent suggest for hydration monitoring. Auto-added to your grocery sync.</p>
                  <button className="w-full bg-surface-container-high py-3 rounded-xl text-xs font-bold uppercase tracking-wider group-hover:bg-primary group-hover:text-on-primary transition-colors">Approve Purchase</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-[#131b2e]/90 backdrop-blur-2xl border-t border-[#3c4a42]/10 shadow-[0px_-10px_30px_rgba(0,0,0,0.3)] flex justify-around items-center px-4 pb-6 pt-2 rounded-t-3xl">
        <Link className="flex flex-col items-center justify-center bg-gradient-to-br from-[#4edea3]/20 to-[#10b981]/10 text-[#4edea3] rounded-xl px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200" href="/health">
          <span className="material-symbols-outlined">monitoring</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Health</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200 hover:text-[#4edea3]" href="/history">
          <span className="material-symbols-outlined">history_edu</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">History</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200 hover:text-[#4edea3]" href="/intake">
          <span className="material-symbols-outlined">forum</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Consult</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200 hover:text-[#4edea3]" href="/share">
          <span className="material-symbols-outlined">settings_heart</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
