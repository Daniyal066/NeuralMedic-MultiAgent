"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { sendChatMessage } from '../actions';

const Intake = () => {
  const [messages, setMessages] = useState([
      { role: "system", content: "Agent AI is listening. Describe your symptoms naturally." }
  ]);
  const [inputData, setInputData] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionInfo] = useState({ sessionId: "demo_session_1", patientId: "882-ES" });

  const handleSend = async (e) => {
      e.preventDefault();
      if (!inputData.trim()) return;
      
      const newMessages = [...messages, { role: "user", content: inputData }];
      setMessages(newMessages);
      setInputData("");
      setLoading(true);
      
      // Hit the Python backend!
      const res = await sendChatMessage(sessionInfo.sessionId, sessionInfo.patientId, inputData);
      
      setLoading(false);
      if (res && res.reply) {
          setMessages(prev => [...prev, { role: "assistant", content: res.reply }]);
      }
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/30 min-h-screen">
      
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#3c4a42]/15 shadow-[0px_20px_40px_rgba(6,14,32,0.4)]">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-[#4edea3] font-black tracking-tighter text-xl font-headline">Emerald Sentinel</span>
            <div className="h-4 w-[1px] bg-outline-variant mx-2"></div>
            <span className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-outline-variant/30">Discovery Phase</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link prefetch={false} className="text-[#4edea3] font-bold font-headline transition-colors duration-300" href="/">Health</Link>
            <Link prefetch={false} className="text-[#dae2fd]/70 font-headline hover:text-[#4edea3] transition-colors duration-300" href="/history">History</Link>
            <Link prefetch={false} className="text-[#dae2fd]/70 font-headline hover:text-[#4edea3] transition-colors duration-300" href="/intake">Consult</Link>
            <Link prefetch={false} className="text-[#dae2fd]/70 font-headline hover:text-[#4edea3] transition-colors duration-300" href="/share">Settings</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-on-surface-variant scale-95 active:scale-90 transition-transform">qr_code_2</button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 p-0.5">
              <img className="w-full h-full rounded-full object-cover" data-alt="close-up professional portrait of a young patient with calm expression, soft cinematic lighting, tech-focused medical office background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-V2Ye30hrA0R47TYwQEeKfTRaPbvQzqrbUseVnzIz2o6tZw_Uj5CuOzLxPAhMaAl5SiMvl5ZLnnO0AGj4SiGcDPUVV627CEq2vEbcYcnK7au6oLpc47SrPuY7DQmC5Hg3Xgi3cFWkp7QNju7kTNSoFr19q6DHANeGWUXWrypPAuoTABuoCkM9yerojNWAway2-GPoDNm1cV_UPhNjRlHckiCtTDUqBVUPwJ8NZNzQ7oTJKAqcCUuYn99jw4MOUJ5BTsORD2VjxJf_"/>
            </div>
          </div>
        </div>
      </header>
      
      <aside className="fixed left-0 top-0 h-full z-40 bg-[#0b1326] w-64 hidden lg:flex flex-col border-r border-[#3c4a42]/15 pt-20">
        <div className="px-6 mb-8">
          <h2 className="font-headline font-bold text-[#4edea3]">Patient Portal</h2>
          <p className="text-xs text-on-surface-variant opacity-70">ID: #{sessionInfo.patientId}</p>
        </div>
        <nav className="flex-1 space-y-1">
          <Link prefetch={false} className="flex items-center gap-4 px-6 py-4 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-2 transition-all duration-300" href="/">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm">Overview</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-4 px-6 py-4 bg-[#131b2e] text-[#4edea3] border-l-4 border-[#4edea3]" href="/intake">
            <span className="material-symbols-outlined">mic_external_on</span>
            <span className="text-sm">Symptom Checker</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-4 px-6 py-4 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-2 transition-all duration-300" href="/history">
            <span className="material-symbols-outlined">folder_managed</span>
            <span className="text-sm">Medical Records</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-4 px-6 py-4 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-2 transition-all duration-300" href="/">
            <span className="material-symbols-outlined">biotech</span>
            <span className="text-sm">Lab Results</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-4 px-6 py-4 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-2 transition-all duration-300" href="/share">
            <span className="material-symbols-outlined">qr_code_scanner</span>
            <span className="text-sm">Doctor Access</span>
          </Link>
        </nav>
        <div className="p-6">
          <button className="w-full py-3 bg-error-container text-error rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2">
			  <span className="material-symbols-outlined text-sm">emergency_home</span> Emergency SOS
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 pt-16 h-screen relative flex flex-col overflow-hidden max-w-[1400px] mx-auto">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 mix-blend-screen pointer-events-none">
          <div className="relative w-[800px] h-[800px]">
            <img className="w-full h-full object-contain blur-[2px]" data-alt="futuristic anatomcial representation" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhVIz5SZh-HV2p4I2Jw57pmxZ7R_HUzHGdfz_RvZ36NTGSZkwnKGYuPdMxqbzNx3ekwvX6Kh4wm_7Dbr_UvbZ9f07u1TAYJXkzk53cLh05w49CfRywowoeD8ERGiomPAy2QcYo5fbFPxdrwkb4RiZlHAvTCWu1mxc86z9DiS3yfyyhyrXUlfOtwESjzqj2QEsu3jIuZoIuyWtAK7IgXPsWSrpNG9--SkFy39q4PEFdaXlBM3eVfs0z7Q6tpTaZWUT718ihnTwUajx5"/>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_#4edea3] animate-pulse"></div>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col p-8 gap-8 overflow-hidden">
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

          <div className="flex-1 grid grid-cols-12 gap-8 items-center overflow-hidden">
            {/* Left: Live Transcript */}
            <div className="col-span-12 lg:col-span-7 h-[500px] glass-panel rounded-3xl p-6 border border-outline-variant/5 bg-surface-container/50 backdrop-blur-sm flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">text_fields</span>
                <h3 className="text-xs font-label uppercase tracking-widest font-bold text-on-surface-variant">Live Transcript</h3>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar flex flex-col">
                  {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                              msg.role === 'user' ? 'bg-primary/20 text-on-surface rounded-br-none' : 
                              msg.role === 'system' ? 'opacity-40 italic mt-auto w-full text-center pb-4' : 'bg-surface-container-high text-on-surface/90 border border-outline-variant/10 rounded-bl-none shadow-lg'
                          }`}>
                            {msg.content}
                          </div>
                      </div>
                  ))}
                  {loading && (
                      <div className="flex items-center gap-2 mt-4 ml-2">
                          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                          <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></span>
                          <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></span>
                          <span className="text-xs text-primary font-medium italic ml-2">Agent is thinking...</span>
                      </div>
                  )}
              </div>
              
              <form onSubmit={handleSend} className="w-full mt-4 flex gap-2">
                  <input 
                      type="text" 
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      placeholder="Type your symptoms here..."
                      className="flex-1 bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                      disabled={loading}
                  />
                  <button 
                      type="submit" 
                      disabled={loading || !inputData.trim()}
                      className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl font-bold font-headline text-sm hover:brightness-110 disabled:opacity-50 transition-all flex gap-2 items-center"
                  >
                      {loading ? <span className="material-symbols-outlined animate-spin text-sm">cycle</span> : <span className="material-symbols-outlined text-sm">send</span>}
                      Send
                  </button>
              </form>
            </div>

            {/* Right: Extracted Insights */}
            <div className="col-span-12 lg:col-span-5 h-[500px] flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-sm">psychology</span>
                <h3 className="text-xs font-label uppercase tracking-widest font-bold text-on-surface-variant">Extracted Diagnostics</h3>
              </div>
              <div className="bg-surface-container-high/80 rounded-2xl p-4 border-l-2 border-primary shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-label text-primary-fixed-dim font-bold uppercase tracking-wider">Session</span>
                  <span className="material-symbols-outlined text-primary text-xs">push_pin</span>
                </div>
                <div className="text-lg font-headline font-bold text-on-surface">{sessionInfo.sessionId}</div>
                <div className="text-[10px] text-on-surface-variant mt-1 italic">Backend Connection Hub</div>
              </div>
              <div className="flex-1 border-2 border-dashed border-outline-variant/10 rounded-2xl flex items-center justify-center group cursor-pointer hover:bg-surface-container-low transition-colors">
                <div className="flex flex-col items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
                  <span className="material-symbols-outlined text-2xl">pending</span>
                  <span className="text-[10px] font-label uppercase tracking-widest text-center px-8">Awaiting extraction payload from Synthesizer Agent...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile NavBar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#131b2e]/90 backdrop-blur-2xl border-t border-[#3c4a42]/10 shadow-[0px_-10px_30px_rgba(0,0,0,0.3)] rounded-t-3xl">
        <Link prefetch={false} className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200 hover:text-[#4edea3]" href="/">
          <span className="material-symbols-outlined">monitoring</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Health</span>
        </Link>
        <Link prefetch={false} className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200 hover:text-[#4edea3]" href="/history">
          <span className="material-symbols-outlined">history_edu</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">History</span>
        </Link>
        <Link prefetch={false} className="flex flex-col items-center justify-center bg-gradient-to-br from-[#4edea3]/20 to-[#10b981]/10 text-[#4edea3] rounded-xl px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200" href="/intake">
          <span className="material-symbols-outlined">forum</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Consult</span>
        </Link>
        <Link prefetch={false} className="flex flex-col items-center justify-center text-[#dae2fd]/50 px-4 py-2 tap-highlight-none active:scale-95 transition-transform duration-200 hover:text-[#4edea3]" href="/share">
          <span className="material-symbols-outlined">settings_heart</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default Intake;
