import React from 'react';
import Link from 'next/link';

export default function IntakePhase() {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container overflow-hidden min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#3c4a42]/15 shadow-[0px_20px_40px_rgba(6,14,32,0.4)]">
        <div className="flex justify-between items-center px-6 h-16 w-full">
          <div className="flex items-center gap-3">
            <span className="text-[#4edea3] font-black tracking-tighter text-xl font-headline">Emerald Sentinel</span>
            <div className="h-4 w-[1px] bg-outline-variant mx-2"></div>
            <span className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-outline-variant/30">Discovery Phase</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-[#4edea3] font-bold font-headline transition-colors duration-300" href="/health">Health</Link>
            <Link className="text-[#dae2fd]/70 font-headline hover:text-[#4edea3] transition-colors duration-300" href="/history">History</Link>
            <Link className="text-[#dae2fd]/70 font-headline hover:text-[#4edea3] transition-colors duration-300" href="/intake">Consult</Link>
            <Link className="text-[#dae2fd]/70 font-headline hover:text-[#4edea3] transition-colors duration-300" href="/share">Settings</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-on-surface-variant scale-95 active:scale-90 transition-transform">qr_code_2</button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-V2Ye30hrA0R47TYwQEeKfTRaPbvQzqrbUseVnzIz2o6tZw_Uj5CuOzLxPAhMaAl5SiMvl5ZLnnO0AGj4SiGcDPUVV627CEq2vEbcYcnK7au6oLpc47SrPuY7DQmC5Hg3Xgi3cFWkp7QNju7kTNSoFr19q6DHANeGWUXWrypPAuoTABuoCkM9yerojNWAway2-GPoDNm1cV_UPhNjRlHckiCtTDUqBVUPwJ8NZNzQ7oTJKAqcCUuYn99jw4MOUJ5BTsORD2VjxJf_" />
            </div>
          </div>
        </div>
      </header>

      {/* SideNavBar (Hidden on Mobile) */}
      <aside className="fixed left-0 top-0 h-full z-40 bg-[#0b1326] w-64 hidden lg:flex flex-col border-r border-[#3c4a42]/15 pt-20">
        <div className="px-6 mb-8">
          <h2 className="font-headline font-bold text-[#4edea3]">Patient Portal</h2>
          <p className="text-xs text-on-surface-variant opacity-70">ID: #882-ES</p>
        </div>
        <nav className="flex-1 space-y-1">
          <Link className="flex items-center gap-4 px-6 py-4 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-8 transition-all duration-300" href="/">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm">Overview</span>
          </Link>
          <Link className="flex items-center gap-4 px-6 py-4 bg-[#131b2e] text-[#4edea3] border-l-4 border-[#4edea3]" href="/intake">
            <span className="material-symbols-outlined">mic_external_on</span>
            <span className="text-sm">Symptom Checker</span>
          </Link>
          <Link className="flex items-center gap-4 px-6 py-4 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-8 transition-all duration-300" href="/history">
            <span className="material-symbols-outlined">folder_managed</span>
            <span className="text-sm">Medical Records</span>
          </Link>
          <Link className="flex items-center gap-4 px-6 py-4 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-8 transition-all duration-300" href="/health">
            <span className="material-symbols-outlined">biotech</span>
            <span className="text-sm">Lab Results</span>
          </Link>
          <Link className="flex items-center gap-4 px-6 py-4 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-8 transition-all duration-300" href="/share">
            <span className="material-symbols-outlined">qr_code_scanner</span>
            <span className="text-sm">Doctor Access</span>
          </Link>
        </nav>
        <div className="p-6">
          <button className="w-full py-3 bg-error-container text-error rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all">
            Emergency SOS
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="lg:ml-64 pt-16 flex-1 relative flex flex-col overflow-hidden">
        {/* Background 3D Health Twin (Visual Background) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 mix-blend-screen pointer-events-none">
          <div className="relative w-[800px] h-[800px]">
            <img className="w-full h-full object-contain blur-[2px]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhVIz5SZh-HV2p4I2Jw57pmxZ7R_HUzHGdfz_RvZ36NTGSZkwnKGYuPdMxqbzNx3ekwvX6Kh4wm_7Dbr_UvbZ9f07u1TAYJXkzk53cLh05w49CfRywowoeD8ERGiomPAy2QcYo5fbFPxdrwkb4RiZlHAvTCWu1mxc86z9DiS3yfyyhyrXUlfOtwESjzqj2QEsu3jIuZoIuyWtAK7IgXPsWSrpNG9--SkFy39q4PEFdaXlBM3eVfs0z7Q6tpTaZWUT718ihnTwUajx5" alt="Background" />
            {/* Interactive Highlight Points */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_#4edea3] animate-pulse"></div>
          </div>
        </div>

        {/* Discovery Interaction Layer */}
        <div className="relative z-10 flex-1 flex flex-col p-8 gap-8 overflow-hidden">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div className="max-w-xl">
              <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-2">Discovery Phase</h1>
              <p className="text-on-surface-variant font-light leading-relaxed">Agent AI is listening. Describe your symptoms naturally. Mention duration, intensity, and location for precise mapping.</p>
            </div>
            <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/10">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
              <span className="text-xs font-label text-primary uppercase tracking-widest font-bold">Intake Agent Active</span>
            </div>
          </div>

          {/* Central Neural Aura & Dual Panes */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 items-center overflow-hidden">
            {/* Left: Live Transcript */}
            <div className="md:col-span-3 h-[500px] glass-panel rounded-3xl p-6 border border-outline-variant/5 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">text_fields</span>
                <h3 className="text-xs font-label uppercase tracking-widest font-bold text-on-surface-variant">Live Transcript</h3>
              </div>
              <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                <div className="opacity-40 text-sm italic">...initializing neural sync</div>
                <div className="text-sm leading-relaxed text-on-surface/80">
                  "I've been feeling this sharp pain in my lower back for about three days now. It gets worse when I try to stand up straight..."
                </div>
                <div className="text-sm leading-relaxed text-on-surface/80">
                  "It also feels a bit warm to the touch, and I've noticed a small rash starting to form near the area."
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full animate-pulse"></span>
                  <span className="text-sm text-primary font-medium italic">User is speaking...</span>
                </div>
              </div>
            </div>

            {/* Center: Neural Aura Waveform */}
            <div className="md:col-span-6 flex flex-col items-center justify-center relative">
              <div className="neural-aura-glow absolute w-96 h-96 rounded-full -z-10 animate-pulse"></div>
              {/* Futuristic Waveform Visualization */}
              <div className="flex items-center justify-center gap-1 h-32 mb-12">
                <div className="w-1.5 h-8 bg-primary rounded-full animate-[bounce_1s_infinite]"></div>
                <div className="w-1.5 h-16 bg-primary-container rounded-full animate-[bounce_1.2s_infinite]"></div>
                <div className="w-1.5 h-24 bg-primary rounded-full animate-[bounce_0.8s_infinite]"></div>
                <div className="w-1.5 h-32 bg-primary-fixed-dim rounded-full animate-[bounce_1.5s_infinite]"></div>
                <div className="w-1.5 h-20 bg-primary-container rounded-full animate-[bounce_1.1s_infinite]"></div>
                <div className="w-1.5 h-28 bg-primary rounded-full animate-[bounce_0.9s_infinite]"></div>
                <div className="w-1.5 h-12 bg-primary-fixed-dim rounded-full animate-[bounce_1.3s_infinite]"></div>
                <div className="w-1.5 h-6 bg-primary-container rounded-full animate-[bounce_0.7s_infinite]"></div>
              </div>
              <button className="group relative flex flex-col items-center justify-center gap-4 transition-transform active:scale-95">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-[0_0_40px_rgba(78,222,163,0.4)] group-hover:shadow-[0_0_60px_rgba(78,222,163,0.6)] transition-all">
                  <span className="material-symbols-outlined text-on-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
                </div>
                <span className="text-sm font-headline font-bold tracking-widest text-primary uppercase">Talk to Me</span>
              </button>
              <div className="mt-12 flex flex-col items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
                </div>
                <span className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant font-bold">Analyzing Context...</span>
              </div>
            </div>

            {/* Right: Extracted Insights */}
            <div className="md:col-span-3 h-[500px] flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-sm">psychology</span>
                <h3 className="text-xs font-label uppercase tracking-widest font-bold text-on-surface-variant">Extracted Insights</h3>
              </div>
              <div className="bg-surface-container-high/80 rounded-2xl p-4 border-l-2 border-primary shadow-lg transition-all hover:translate-x-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-label text-primary-fixed-dim font-bold uppercase tracking-wider">Duration</span>
                  <span className="material-symbols-outlined text-primary text-xs">push_pin</span>
                </div>
                <div className="text-lg font-headline font-bold text-on-surface">3 Days</div>
                <div className="text-[10px] text-on-surface-variant mt-1 italic">Extracted from: "about three days now"</div>
              </div>
              <div className="bg-surface-container-high/80 rounded-2xl p-4 border-l-2 border-tertiary-container shadow-lg transition-all hover:translate-x-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-label text-tertiary-container font-bold uppercase tracking-wider">Severity</span>
                  <span className="material-symbols-outlined text-tertiary-container text-xs">push_pin</span>
                </div>
                <div className="text-lg font-headline font-bold text-on-surface">High (Sharp)</div>
                <div className="text-[10px] text-on-surface-variant mt-1 italic">Extracted from: "sharp pain... worse when standing"</div>
              </div>
              <div className="bg-surface-container-high/80 rounded-2xl p-4 border-l-2 border-secondary shadow-lg transition-all hover:translate-x-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-label text-secondary font-bold uppercase tracking-wider">Location</span>
                  <span className="material-symbols-outlined text-secondary text-xs">push_pin</span>
                </div>
                <div className="text-lg font-headline font-bold text-on-surface">Lower Back</div>
                <div className="text-[10px] text-on-surface-variant mt-1 italic">Extracted from: "pain in my lower back"</div>
              </div>
              <div className="flex-1 border-2 border-dashed border-outline-variant/10 rounded-2xl flex items-center justify-center group cursor-pointer hover:bg-surface-container-low transition-colors">
                <div className="flex flex-col items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
                  <span className="material-symbols-outlined text-2xl">pending</span>
                  <span className="text-[10px] font-label uppercase tracking-widest">Listening for vitals...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Bar (Contextual) */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-auto bg-surface-container-lowest/40 backdrop-blur-md p-6 rounded-[2rem] border border-outline-variant/10 gap-4">
            <div className="flex gap-4 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
              <button className="flex shrink-0 items-center gap-3 px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl border border-outline-variant/10 transition-all">
                <span className="material-symbols-outlined text-primary">add_a_photo</span>
                <div className="text-left">
                  <p className="text-[10px] font-label uppercase font-bold tracking-widest opacity-60">Upload Photo</p>
                  <p className="text-xs font-headline font-semibold">Skin/External</p>
                </div>
              </button>
              <button className="flex shrink-0 items-center gap-3 px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl border border-outline-variant/10 transition-all">
                <span className="material-symbols-outlined text-primary">upload_file</span>
                <div className="text-left">
                  <p className="text-[10px] font-label uppercase font-bold tracking-widest opacity-60">Upload Labs</p>
                  <p className="text-xs font-headline font-semibold">Reports (PDF)</p>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <p className="text-[10px] font-label uppercase tracking-tighter text-on-surface-variant font-bold">Confidence Score</p>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="w-[88%] h-full bg-primary shadow-[0_0_10px_#4edea3]"></div>
                  </div>
                  <span className="text-xs font-headline font-bold text-primary">88%</span>
                </div>
              </div>
              <button className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-black rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap">
                Proceed
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Visible on Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#131b2e]/90 backdrop-blur-2xl border-t border-[#3c4a42]/10 shadow-[0px_-10px_30px_rgba(0,0,0,0.3)] rounded-t-3xl">
        <Link className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200" href="/health">
          <span className="material-symbols-outlined">monitoring</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Health</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200" href="/history">
          <span className="material-symbols-outlined">history_edu</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">History</span>
        </Link>
        <Link className="flex flex-col items-center justify-center bg-gradient-to-br from-[#4edea3]/20 to-[#10b981]/10 text-[#4edea3] rounded-xl px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200" href="/intake">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Consult</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200" href="/share">
          <span className="material-symbols-outlined">settings_heart</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
