import React from 'react';
import Link from 'next/link';

const ShareHub = () => {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/30 min-h-screen">
      {/* Generated from Stitch HTML */}
      
{/* Top Navigation Bar */}
<header className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#3c4a42]/15 shadow-[0px_20px_40px_rgba(6,14,32,0.4)]">
<div className="flex justify-between items-center px-6 h-16 w-full">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[#4edea3]">shield</span>
<span className="text-[#4edea3] font-black tracking-tighter text-xl font-['Manrope']">Emerald Sentinel</span>
</div>
<div className="hidden md:flex items-center space-x-8">
<Link prefetch={false}   className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors duration-300 font-['Inter'] text-sm font-medium" href="/">Health</Link>
<Link prefetch={false}   className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors duration-300 font-['Inter'] text-sm font-medium" href="/history">History</Link>
<Link prefetch={false}   className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors duration-300 font-['Inter'] text-sm font-medium" href="/intake">Consult</Link>
<Link prefetch={false}   className="text-[#4edea3] font-bold font-['Inter'] text-sm" href="/share">Doctor Access</Link>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-[#dae2fd]/70 cursor-pointer scale-95 active:scale-90 transition-transform">qr_code_2</span>
<span className="material-symbols-outlined text-[#dae2fd]/70 cursor-pointer scale-95 active:scale-90 transition-transform">account_circle</span>
</div>
</div>
</header>
{/* Sidebar (Large Screens Only) */}
<aside className="fixed left-0 top-0 h-full z-40 h-full w-64 hidden lg:flex flex-col bg-[#0b1326] border-r border-[#3c4a42]/15">
<div className="p-8 pt-24">
<h2 className="font-['Manrope'] font-bold text-[#4edea3] text-lg">Patient Portal</h2>
<p className="text-[#dae2fd]/40 text-xs font-['Inter'] mb-8">ID: #882-ES</p>
<nav className="space-y-1">
<Link prefetch={false}   className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-2 transition-all duration-300 rounded-xl" href="/">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-['Inter'] text-sm">Overview</span>
</Link>
<Link prefetch={false}   className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-2 transition-all duration-300 rounded-xl" href="/intake">
<span className="material-symbols-outlined">mic_external_on</span>
<span className="font-['Inter'] text-sm">Symptom Checker</span>
</Link>
<Link prefetch={false}   className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-2 transition-all duration-300 rounded-xl" href="/history">
<span className="material-symbols-outlined">folder_managed</span>
<span className="font-['Inter'] text-sm">Medical Records</span>
</Link>
<Link prefetch={false}   className="flex items-center gap-3 px-4 py-3 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-2 transition-all duration-300 rounded-xl" href="/">
<span className="material-symbols-outlined">biotech</span>
<span className="font-['Inter'] text-sm">Lab Results</span>
</Link>
<Link prefetch={false}   className="flex items-center gap-3 px-4 py-3 bg-[#131b2e] text-[#4edea3] border-l-4 border-[#4edea3] rounded-r-xl" href="/share">
<span className="material-symbols-outlined">qr_code_scanner</span>
<span className="font-['Inter'] text-sm font-semibold">Doctor Access</span>
</Link>
</nav>
</div>
<div className="mt-auto p-6">
<button className="w-full bg-error-container text-error py-3 rounded-xl font-bold flex items-center justify-center gap-2 scale-95 active:scale-90 transition-transform">
<span className="material-symbols-outlined">emergency_home</span>
                Emergency SOS
            </button>
</div>
</aside>
{/* Main Content Canvas */}
<main className="lg:ml-64 pt-24 pb-32 px-6 min-h-screen bg-[#0b1326]">
<div className="max-w-5xl mx-auto">
{/* Hero Header */}
<div className="mb-12">
<h1 className="font-['Manrope'] text-4xl font-extrabold text-[#dae2fd] tracking-tight mb-2">Doctor Handoff</h1>
<p className="text-[#dae2fd]/60 font-['Inter'] max-w-2xl">Securely share your real-time health data with a medical professional. This session is encrypted and will expire automatically.</p>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
{/* Left: QR Access Card (Bento Focus) */}
<div className="lg:col-span-5 space-y-6">
<div className="glass-card rounded-[2rem] p-8 relative overflow-hidden flex flex-col items-center justify-center border border-white/5 shadow-2xl">
<div className="absolute inset-0 opacity-10 qr-gradient blur-3xl -z-10"></div>
<div className="mb-8 text-center">
<span className="inline-block px-3 py-1 rounded-full bg-[#4edea3]/10 text-[#4edea3] text-[10px] font-bold tracking-widest uppercase mb-4">Live Access Token</span>
<div className="relative group cursor-pointer">
<div className="absolute -inset-1 bg-gradient-to-r from-[#4edea3] to-[#10b981] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
<div className="relative p-4 bg-[#0b1326] rounded-2xl border border-[#3c4a42]/20">
{/* Literal Transcription for Icons */}
<div className="w-48 h-48 flex items-center justify-center text-[#4edea3]">
<span className="material-symbols-outlined !text-9xl" className="fill-current">qr_code_2</span>
</div>
</div>
</div>
</div>
<div className="flex flex-col items-center gap-4 w-full">
<div className="flex items-center gap-3 text-sm text-[#dae2fd]/80">
<span className="material-symbols-outlined text-[#4edea3] animate-pulse">sync</span>
                                Refreshing in <span className="font-mono text-[#4edea3] font-bold">42s</span>
</div>
<button className="w-full qr-gradient py-4 rounded-xl font-bold text-on-primary-container flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all">
<span className="material-symbols-outlined">share</span>
                                Generate Link Access
                            </button>
</div>
</div>
{/* Privacy Log Card */}
<div className="bg-surface-container-low rounded-[1.5rem] p-6 border border-white/5">
<div className="flex items-center justify-between mb-6">
<h3 className="font-['Manrope'] font-bold text-sm tracking-wide flex items-center gap-2">
<span className="material-symbols-outlined text-sm">history</span>
                                ACCESS LOG
                            </h3>
<span className="text-[10px] text-[#dae2fd]/40 font-bold uppercase tracking-widest">Last 48 Hours</span>
</div>
<div className="space-y-4">
<div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest/50 border-l-2 border-[#4edea3]">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
<span className="material-symbols-outlined text-xs">person</span>
</div>
<div>
<p className="text-xs font-bold">Dr. Elena Vance</p>
<p className="text-[10px] text-[#dae2fd]/40 italic">Full Medical Handoff</p>
</div>
</div>
<span className="text-[10px] text-[#dae2fd]/60 font-mono">14:02 Today</span>
</div>
<div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest/50">
<div className="flex items-center gap-3 opacity-60">
<div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
<span className="material-symbols-outlined text-xs">local_hospital</span>
</div>
<div>
<p className="text-xs font-bold">Mercy General API</p>
<p className="text-[10px] text-[#dae2fd]/40 italic">Lab Results Sync</p>
</div>
</div>
<span className="text-[10px] text-[#dae2fd]/60 font-mono">Yesterday</span>
</div>
</div>
</div>
</div>
{/* Right: Patient History Preview (Editorial Style) */}
<div className="lg:col-span-7 space-y-8">
<div className="p-2">
<div className="flex items-center gap-4 mb-8">
<div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#3c4a42]/30 to-transparent"></div>
<span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#4edea3]/60">Summary Preview for Provider</span>
<div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#3c4a42]/30 to-transparent"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Vitals Velocity */}
<div className="bg-surface-container-low p-6 rounded-3xl border border-white/5 md:col-span-2">
<div className="flex justify-between items-start mb-6">
<div>
<p className="text-[10px] font-black tracking-widest text-[#dae2fd]/40 uppercase mb-1">BMI / Vitals Velocity</p>
<h4 className="font-['Manrope'] text-2xl font-bold">Stable Trend</h4>
</div>
<div className="text-right">
<p className="text-[10px] text-[#4edea3] font-bold">+2.4% Optimal Range</p>
<span className="material-symbols-outlined text-[#4edea3]">trending_up</span>
</div>
</div>
<div className="h-24 w-full flex items-end gap-1 px-2">
{/* Sparkline Sim */}
<div className="flex-1 bg-primary/20 rounded-t-sm" ></div>
<div className="flex-1 bg-primary/30 rounded-t-sm" ></div>
<div className="flex-1 bg-primary/25 rounded-t-sm" ></div>
<div className="flex-1 bg-primary/40 rounded-t-sm" ></div>
<div className="flex-1 bg-primary/35 rounded-t-sm" ></div>
<div className="flex-1 qr-gradient rounded-t-sm" ></div>
</div>
<div className="flex justify-between mt-4 text-[10px] font-mono text-[#dae2fd]/30 px-2">
<span>30D AGO</span>
<span>TODAY</span>
</div>
</div>
{/* Chronic Conditions */}
<div className="bg-surface-container-low p-6 rounded-3xl border border-white/5">
<h3 className="font-['Manrope'] font-bold text-sm tracking-wide flex items-center gap-2 mb-6">
<span className="material-symbols-outlined text-sm text-[#4edea3]">pill</span>
                                    CHRONIC CONDITIONS
                                </h3>
<ul className="space-y-3">
<li className="flex items-center gap-3">
<span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
<span className="text-xs font-semibold text-[#dae2fd]/90">Type 2 Diabetes</span>
</li>
<li className="flex items-center gap-3">
<span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
<span className="text-xs font-semibold text-[#dae2fd]/90">Hypertension</span>
</li>
<li className="flex items-center gap-3 opacity-40">
<span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
<span className="text-xs font-semibold">Mild Asthma (History)</span>
</li>
</ul>
</div>
{/* Recent Symptom Logs */}
<div className="bg-surface-container-low p-6 rounded-3xl border border-white/5">
<h3 className="font-['Manrope'] font-bold text-sm tracking-wide flex items-center gap-2 mb-6">
<span className="material-symbols-outlined text-sm text-tertiary">warning</span>
                                    SYMPTOM LOGS
                                </h3>
<div className="space-y-3">
<div className="flex items-center justify-between">
<span className="text-xs font-semibold">Joint Pain</span>
<span className="px-2 py-0.5 rounded text-[8px] bg-tertiary-container/20 text-tertiary border border-tertiary/20">MODERATE</span>
</div>
<div className="flex items-center justify-between">
<span className="text-xs font-semibold">Insomnia</span>
<span className="px-2 py-0.5 rounded text-[8px] bg-primary/10 text-[#4edea3] border border-[#4edea3]/20">MILD</span>
</div>
<p className="text-[10px] text-[#dae2fd]/40 mt-4 leading-relaxed italic">
                                        "Noticed increased discomfort after morning walks this week..."
                                    </p>
</div>
</div>
{/* Editorial Image Visual */}
<div className="md:col-span-2 relative h-48 rounded-3xl overflow-hidden group">
<img alt="Clinical Environment" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="Modern high-tech medical laboratory with futuristic equipment and clinical teal soft lighting on polished surfaces" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAvQPp_aOymR5F3V-5nmFnzJcBvUS5G0EGZYrzvzz8SS7x43_L1Akow2ND6k4-8B63C6PZ2861sg-d0_L0s8GcmMehVpcn3M7CWf1KR0ghzVu_pRYDbpsiTe2DEC386iuvA6IRVqubeMwsomJQEf1iKfnMo3F1-2pphmsywasipVfxxQeX2bsj0VjM9sszLMIjuOA3L8UNeggWfhLXxFJZ3boGPRo4D8yWZa0qRfvha6NJLkVZLOSDz6iF518plptTrYKfVWvQafSG"/>
<div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent"></div>
<div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
<div>
<p className="text-[10px] font-black text-[#4edea3] tracking-[0.2em] uppercase">Verified Identity</p>
<h4 className="text-xl font-['Manrope'] font-bold">Secure Sentinel Core</h4>
</div>
<span className="material-symbols-outlined !text-3xl opacity-40" className="fill-current">verified_user</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
{/* Bottom Navigation Bar (Mobile only) */}
<nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#131b2e]/90 backdrop-blur-2xl border-t border-[#3c4a42]/10 shadow-[0px_-10px_30px_rgba(0,0,0,0.3)] rounded-t-3xl">
<Link prefetch={false}   className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200" href="/">
<span className="material-symbols-outlined">monitoring</span>
<span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Health</span>
</Link>
<Link prefetch={false}   className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200" href="/history">
<span className="material-symbols-outlined">history_edu</span>
<span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">History</span>
</Link>
<Link prefetch={false}   className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200" href="/intake">
<span className="material-symbols-outlined">forum</span>
<span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Consult</span>
</Link>
<Link prefetch={false}   className="flex flex-col items-center justify-center bg-gradient-to-br from-[#4edea3]/20 to-[#10b981]/10 text-[#4edea3] rounded-xl px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200" href="/share">
<span className="material-symbols-outlined" className="fill-current">qr_code_scanner</span>
<span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Share</span>
</Link>
</nav>

    </div>
  );
};

export default ShareHub;
