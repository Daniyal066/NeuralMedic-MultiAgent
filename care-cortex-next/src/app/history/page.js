import React from 'react';
import Link from 'next/link';

const HistoryPortal = () => {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/30 min-h-screen">
      {/* Generated from Stitch HTML */}
      
{/* TopAppBar */}
<header className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#3c4a42]/15 shadow-[0px_20px_40px_rgba(6,14,32,0.4)]">
<div className="flex justify-between items-center px-6 h-16 w-full">
<div className="flex items-center gap-4">
<span className="text-[#4edea3] font-black tracking-tighter text-xl font-headline">Emerald Sentinel</span>
<div className="h-6 w-[1px] bg-outline-variant/30 hidden md:block"></div>
<span className="hidden md:block text-[#dae2fd]/70 font-label text-xs uppercase tracking-widest">Clinician Portal v2.4</span>
</div>
<div className="flex items-center gap-6">
<div className="hidden md:flex gap-8">
<Link prefetch={false}   className="text-[#4edea3] font-bold transition-colors duration-300 font-headline text-lg tracking-tight" href="/">Health</Link>
<Link prefetch={false}   className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors duration-300 font-headline text-lg tracking-tight" href="/history">History</Link>
<Link prefetch={false}   className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors duration-300 font-headline text-lg tracking-tight" href="/intake">Consult</Link>
</div>
<div className="flex items-center gap-3">
<button className="scale-95 active:scale-90 transition-transform text-[#dae2fd]/70">
<span className="material-symbols-outlined">qr_code_2</span>
</button>
<div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
<img alt="Patient Profile Avatar" className="w-full h-full object-cover" data-alt="professional portrait of a medical doctor in clinical attire with soft studio lighting and dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnmfR1qOv81nYwjZUv1VxjzZmyXC5GcSX7brS8zQRr5thQeBybny-_vEywlZOuG9nEYP0D5vrGSm_XHrp1qNKNh5bZqi6r4V8cWUTpuymtwSpooqZT2ZF76pG-eqRdE4Jz1Y8vMEK3d--McydhnGzLaJgKd5nQcX8Ugs3q5Hr5pFL5N-3umoryy3Vt4GuMOj-6JJwEYPuYn7gb8LNFU7ZFvTJOaOLlCdBTlQ19ziA1R6OoGA8BU2SCLWINVwCHALIlRpMq_o8Ar6A9"/>
</div>
</div>
</div>
</div>
</header>
{/* SideNavBar (Desktop Only) */}
<aside className="fixed left-0 top-0 h-full z-40 h-full w-64 hidden lg:flex flex-col bg-[#0b1326] border-r border-[#3c4a42]/15 pt-20">
<div className="px-6 mb-8">
<h2 className="font-headline font-bold text-[#4edea3] text-lg">Patient Portal</h2>
<p className="text-[#dae2fd]/50 text-xs font-label uppercase tracking-tighter">ID: #882-ES</p>
</div>
<nav className="flex-1 space-y-1 px-3">
<Link prefetch={false}   className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-4" href="/">
<span className="material-symbols-outlined text-lg">dashboard</span>
<span className="text-sm">Overview</span>
</Link>
<Link prefetch={false}   className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-4" href="/intake">
<span className="material-symbols-outlined text-lg">mic_external_on</span>
<span className="text-sm">Symptom Checker</span>
</Link>
<Link prefetch={false}   className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 bg-[#131b2e] text-[#4edea3] border-l-4 border-[#4edea3] pl-4" href="/history">
<span className="material-symbols-outlined text-lg">folder_managed</span>
<span className="text-sm font-medium">Medical Records</span>
</Link>
<Link prefetch={false}   className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-4" href="/">
<span className="material-symbols-outlined text-lg">biotech</span>
<span className="text-sm">Lab Results</span>
</Link>
<Link prefetch={false}   className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-4" href="/share">
<span className="material-symbols-outlined text-lg">qr_code_scanner</span>
<span className="text-sm">Doctor Access</span>
</Link>
</nav>
<div className="p-6">
<button className="w-full py-3 px-4 bg-error-container text-error rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-error hover:text-on-error transition-colors">
<span className="material-symbols-outlined text-sm" className="fill-current">emergency</span>
                Emergency SOS
            </button>
</div>
</aside>
{/* Main Content Canvas */}
<main className="lg:ml-64 pt-20 pb-24 px-4 md:px-8">
{/* Patient Header Hero */}
<section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
<div>
<div className="flex items-center gap-4 mb-2">
<span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">ACTIVE CASE</span>
<span className="text-on-surface-variant text-xs">Last Sync: 2m ago</span>
</div>
<h1 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface tracking-tight">Elena Vance</h1>
<p className="text-on-surface-variant font-medium mt-1">34 y/o Female • O- Positive • No Known Allergies</p>
</div>
<div className="flex gap-3">
<button className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-semibold text-sm transition-all hover:bg-surface-bright flex items-center gap-2">
<span className="material-symbols-outlined text-sm">print</span> Export PDF
                </button>
<button className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#4edea3] to-[#10b981] text-on-primary font-bold text-sm transition-transform active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/20">
<span className="material-symbols-outlined text-sm">add</span> New Entry
                </button>
</div>
</section>
{/* Bento Grid Layout */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
{/* Vitals Dashboard (Col 1-4) */}
<div className="md:col-span-4 space-y-6">
<div className="bg-surface-container-low p-6 rounded-[2rem] border-l-2 border-primary shadow-sm">
<div className="flex justify-between items-start mb-6">
<h3 className="font-headline font-bold text-on-surface">Vitals Dashboard</h3>
<span className="material-symbols-outlined text-primary-fixed-dim">analytics</span>
</div>
<div className="space-y-8">
<div>
<div className="flex justify-between items-end mb-1">
<span className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Heart Rate</span>
<span className="text-primary text-xs font-bold">+2 bpm</span>
</div>
<div className="flex items-baseline gap-2">
<span className="font-headline text-4xl font-bold">72</span>
<span className="text-on-surface-variant text-sm font-medium">bpm</span>
</div>
<div className="h-12 mt-3 w-full opacity-60">
{/* Sparkline Mockup */}
<svg className="w-full h-full text-primary fill-none stroke-current stroke-1" viewBox="0 0 100 20">
<path d="M0 15 Q 10 5, 20 18 T 40 10 T 60 15 T 80 5 T 100 12"></path>
<path className="fill-primary/5 stroke-none" d="M0 15 Q 10 5, 20 18 T 40 10 T 60 15 T 80 5 T 100 12 V 20 H 0 Z"></path>
</svg>
</div>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="bg-surface-container-lowest p-4 rounded-2xl">
<p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-1">BMI Index</p>
<p className="font-headline text-2xl font-bold">22.4</p>
<span className="text-[10px] text-primary font-medium">Optimal</span>
</div>
<div className="bg-surface-container-lowest p-4 rounded-2xl">
<p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-1">SpO2</p>
<p className="font-headline text-2xl font-bold">98%</p>
<span className="text-[10px] text-primary font-medium">Stable</span>
</div>
</div>
<div>
<p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-3">Health Compliance</p>
<div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary w-[88%] rounded-full shadow-[0_0_10px_rgba(78,222,163,0.3)]"></div>
</div>
<div className="flex justify-between mt-2 text-[10px] font-medium text-on-surface-variant">
<span>Medication Adherence</span>
<span>88%</span>
</div>
</div>
</div>
</div>
{/* Smart Tagging System */}
<div className="bg-surface-container-low p-6 rounded-[2rem]">
<h3 className="font-headline font-bold text-on-surface mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-sm">label</span>
                        Recurrence Tags
                    </h3>
<div className="flex flex-wrap gap-2">
<span className="px-3 py-1.5 rounded-lg bg-surface-container-highest border border-primary/20 text-primary text-xs font-semibold">Migraine (3y)</span>
<span className="px-3 py-1.5 rounded-lg bg-surface-container-highest border border-tertiary/20 text-tertiary text-xs font-semibold">Tinnitus</span>
<span className="px-3 py-1.5 rounded-lg bg-surface-container-highest border border-primary/20 text-primary text-xs font-semibold">Nausea (Cluster)</span>
<span className="px-3 py-1.5 rounded-lg bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant text-xs font-semibold">Low Iron</span>
<span className="px-3 py-1.5 rounded-lg bg-surface-container-highest border border-primary/20 text-primary text-xs font-semibold">Fatigue (Chronic)</span>
</div>
<div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
<p className="text-xs text-on-surface-variant leading-relaxed">
<strong className="text-primary">Insight:</strong> Symptoms show a 28-day cyclical pattern, correlating with hormonal shifts noted in 2022-2023.
                        </p>
</div>
</div>
</div>
{/* Chronicle Timeline (Col 5-8) */}
<div className="md:col-span-5">
<div className="bg-surface-container-low p-8 rounded-[2rem]">
<div className="flex justify-between items-center mb-10">
<h3 className="font-headline font-bold text-xl text-on-surface">Chronicle Timeline</h3>
<div className="flex gap-2">
<button className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-highest text-on-surface-variant">
<span className="material-symbols-outlined text-sm">filter_list</span>
</button>
<button className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-highest text-on-surface-variant">
<span className="material-symbols-outlined text-sm">calendar_month</span>
</button>
</div>
</div>
<div className="relative space-y-12 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[1px] before:bg-outline-variant/30">
{/* Timeline Entry 1 */}
<div className="relative pl-10">
<div className="absolute left-0 top-1.5 w-6 h-6 bg-surface border-2 border-primary rounded-full flex items-center justify-center z-10">
<div className="w-2 h-2 bg-primary rounded-full"></div>
</div>
<span className="text-[10px] font-label text-primary font-bold uppercase tracking-widest">Oct 14, 2023 • Acute</span>
<h4 className="font-headline font-bold text-on-surface mt-1">Severe Photophobia &amp; Vertigo</h4>
<p className="text-sm text-on-surface-variant mt-2 leading-relaxed">Patient reported sudden onset at 04:00. Episode lasted 6 hours. Unresponsive to over-the-counter NSAIDs.</p>
<div className="mt-4 flex gap-3">
<div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant/10">
<span className="material-symbols-outlined text-sm text-primary">description</span>
<span className="text-[10px] font-medium">Scan_882.dicom</span>
</div>
<div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant/10">
<span className="material-symbols-outlined text-sm text-primary">lab_profile</span>
<span className="text-[10px] font-medium">Blood_Chem.pdf</span>
</div>
</div>
</div>
{/* Timeline Entry 2 */}
<div className="relative pl-10">
<div className="absolute left-0 top-1.5 w-6 h-6 bg-surface border-2 border-outline-variant/50 rounded-full flex items-center justify-center z-10">
<div className="w-2 h-2 bg-outline-variant rounded-full"></div>
</div>
<span className="text-[10px] font-label text-on-surface-variant font-bold uppercase tracking-widest">Aug 22, 2023 • Check-up</span>
<h4 className="font-headline font-bold text-on-surface mt-1">Routine Metabolic Panel</h4>
<p className="text-sm text-on-surface-variant mt-2 leading-relaxed">All vitals within normal limits. Slight deficiency in Vitamin D (22 ng/mL). Prescribed 5000 IU supplement.</p>
</div>
{/* Timeline Entry 3 */}
<div className="relative pl-10">
<div className="absolute left-0 top-1.5 w-6 h-6 bg-surface border-2 border-tertiary rounded-full flex items-center justify-center z-10">
<div className="w-2 h-2 bg-tertiary rounded-full"></div>
</div>
<span className="text-[10px] font-label text-tertiary font-bold uppercase tracking-widest">Jan 12, 2023 • Surgical</span>
<h4 className="font-headline font-bold text-on-surface mt-1">Laparoscopic Appendectomy</h4>
<p className="text-sm text-on-surface-variant mt-2 leading-relaxed">Post-op recovery successful. No complications noted during the 48-hour observation period.</p>
</div>
{/* Timeline Entry 4 */}
<div className="relative pl-10">
<div className="absolute left-0 top-1.5 w-6 h-6 bg-surface border-2 border-outline-variant/50 rounded-full flex items-center justify-center z-10">
<div className="w-2 h-2 bg-outline-variant rounded-full"></div>
</div>
<span className="text-[10px] font-label text-on-surface-variant font-bold uppercase tracking-widest">Nov 05, 2022 • Observation</span>
<h4 className="font-headline font-bold text-on-surface mt-1">Initial Tinnitus Report</h4>
<p className="text-sm text-on-surface-variant mt-2 leading-relaxed">High-pitched ringing in left ear during stressful work periods. Audiometry showed normal hearing range.</p>
</div>
</div>
</div>
</div>
{/* AI Specialist Insights (Col 9-12) */}
<div className="md:col-span-3 space-y-6">
<div className="bg-surface-container-high p-6 rounded-[2rem] relative overflow-hidden group">
{/* Glassmorphism Highlight */}
<div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl transition-all group-hover:bg-primary/30"></div>
<div className="flex items-center gap-3 mb-6">
<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
<span className="material-symbols-outlined text-primary" className="fill-current">psychology</span>
</div>
<h3 className="font-headline font-bold text-on-surface">AI Insights</h3>
</div>
<div className="space-y-6">
<div>
<span className="text-[10px] font-label text-primary font-bold uppercase tracking-widest">Likely Diagnosis</span>
<h4 className="font-headline text-lg font-bold text-on-surface mt-1">Vestibular Migraine</h4>
<div className="flex items-center gap-2 mt-2">
<div className="h-1.5 flex-1 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary w-[92%]"></div>
</div>
<span className="text-[10px] font-bold text-primary">92% Match</span>
</div>
</div>
<div className="p-4 bg-surface-container-lowest rounded-2xl border border-primary/10">
<p className="text-xs text-on-surface-variant leading-relaxed">
<span className="text-primary font-bold">Reasoning:</span> The combination of recurring photophobia, cluster nausea, and cyclical vertigo strongly suggests a vestibular origin rather than simple tension headaches.
                            </p>
</div>
<div className="space-y-3">
<p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Recommended Actions</p>
<ul className="space-y-2">
<li className="flex items-start gap-2 text-xs text-on-surface">
<span className="material-symbols-outlined text-primary text-sm">check_circle</span>
<span>Schedule ENG/VNG testing</span>
</li>
<li className="flex items-start gap-2 text-xs text-on-surface">
<span className="material-symbols-outlined text-primary text-sm">check_circle</span>
<span>Prescribe prophylactic triptans</span>
</li>
<li className="flex items-start gap-2 text-xs text-on-surface">
<span className="material-symbols-outlined text-primary text-sm">check_circle</span>
<span>Review 2021 MRI for basilar shift</span>
</li>
</ul>
</div>
</div>
<button className="w-full mt-6 py-3 bg-surface-bright text-on-surface font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary hover:text-on-primary transition-all active:scale-[0.98]">
                        Full AI Summary
                    </button>
</div>
<div className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/10">
<h3 className="font-headline font-bold text-on-surface mb-4 text-sm">Referral Status</h3>
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full overflow-hidden">
<img className="w-full h-full object-cover" data-alt="portrait of a female specialist doctor in a high-tech medical office environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBACYlkFjne_uCgepC3fXnb2945LfJ27iBhy-mIwzDrWFe-uOrenYNjpVIIWsatczF_400uD3a0dfM2BftpVsfshpQ3TG2xV8PJjH-__AKx4N0jVHNH10HpTvGKpZNvaGZY3pm9Jh6YuZJy1inDQCQlEWsZ0Mk4fYOeSWcEX1Ium8ZbVfydDmoE55CcbPa37wmzg5yfmXtc7ONpy21fRCxhRy82f8_9FqecaRVO7SNcxYIrNUXcanDFG-5DDblObiI_eIb9NwVqtPWA"/>
</div>
<div>
<p className="text-xs font-bold">Dr. Sarah Chen</p>
<p className="text-[10px] text-on-surface-variant">Neuro-Otology Specialist</p>
</div>
</div>
<div className="mt-4 flex gap-2">
<button className="flex-1 py-2 rounded-lg bg-surface-container-highest text-xs font-bold">Message</button>
<button className="flex-1 py-2 rounded-lg bg-surface-container-highest text-xs font-bold">Schedule</button>
</div>
</div>
</div>
</div>
</main>
{/* BottomNavBar (Mobile Only) */}
<nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#131b2e]/90 backdrop-blur-2xl border-t border-[#3c4a42]/10 shadow-[0px_-10px_30px_rgba(0,0,0,0.3)] rounded-t-3xl">
<Link prefetch={false}   className="flex flex-col items-center justify-center bg-gradient-to-br from-[#4edea3]/20 to-[#10b981]/10 text-[#4edea3] rounded-xl px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200" href="/">
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
<Link prefetch={false}   className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200" href="/share">
<span className="material-symbols-outlined">settings_heart</span>
<span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Settings</span>
</Link>
</nav>

    </div>
  );
};

export default HistoryPortal;
