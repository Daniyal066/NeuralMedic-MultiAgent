"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { sendChatMessage } from '../actions';

const Intake = () => {
  const [messages, setMessages] = useState([
    { role: "system", content: "Agent AI is listening. Describe your symptoms naturally — mention duration, intensity, and location." }
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
    const res = await sendChatMessage(sessionInfo.sessionId, sessionInfo.patientId, inputData);
    setLoading(false);
    if (res?.reply) {
      setMessages(prev => [...prev, { role: "assistant", content: res.reply }]);
    }
  };

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen" style={{fontFamily:"'Inter',sans-serif"}}>
      <header className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#3c4a62]/15">
        <div className="flex justify-between items-center px-6 h-16 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-[#4edea3] font-black tracking-tighter text-xl" style={{fontFamily:"'Manrope',sans-serif"}}>Emerald Sentinel</span>
            <div className="h-4 w-[1px] bg-[#3c4a62] mx-2"></div>
            <span className="text-[#8a9bb8] text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-[#3c4a62]/30">Discovery Phase</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link prefetch={false} className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors duration-300" href="/">Health</Link>
            <Link prefetch={false} className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors duration-300" href="/history">History</Link>
            <Link prefetch={false} className="text-[#4edea3] font-bold transition-colors duration-300" href="/intake">Consult</Link>
            <Link prefetch={false} className="text-[#dae2fd]/70 hover:text-[#4edea3] transition-colors duration-300" href="/share">Settings</Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#131b2e] px-3 py-1.5 rounded-full border border-[#3c4a62]/20">
              <span className="flex h-2 w-2 rounded-full bg-[#4edea3] animate-ping"></span>
              <span className="text-xs text-[#4edea3] uppercase tracking-widest font-bold">Intake Agent Active</span>
            </div>
          </div>
        </div>
      </header>
      <aside className="fixed left-0 top-0 h-full z-40 bg-[#0b1326] w-64 hidden lg:flex flex-col border-r border-[#3c4a62]/15 pt-20">
        <div className="px-6 mb-8">
          <h2 className="font-bold text-[#4edea3]" style={{fontFamily:"'Manrope',sans-serif"}}>Patient Portal</h2>
          <p className="text-xs text-[#8a9bb8] opacity-70">ID: #{sessionInfo.patientId}</p>
        </div>
        <nav className="flex-1 space-y-1">
          <Link prefetch={false} className="flex items-center gap-4 px-6 py-4 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-8 transition-all duration-300" href="/">
            <span className="material-symbols-outlined">dashboard</span><span className="text-sm">Overview</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-4 px-6 py-4 bg-[#131b2e] text-[#4edea3] border-l-4 border-[#4edea3]" href="/intake">
            <span className="material-symbols-outlined">mic_external_on</span><span className="text-sm">Symptom Checker</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-4 px-6 py-4 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-8 transition-all duration-300" href="/history">
            <span className="material-symbols-outlined">folder_managed</span><span className="text-sm">Medical Records</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-4 px-6 py-4 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-8 transition-all duration-300" href="/">
            <span className="material-symbols-outlined">biotech</span><span className="text-sm">Lab Results</span>
          </Link>
          <Link prefetch={false} className="flex items-center gap-4 px-6 py-4 text-[#dae2fd]/60 hover:bg-[#131b2e]/50 hover:pl-8 transition-all duration-300" href="/share">
            <span className="material-symbols-outlined">qr_code_scanner</span><span className="text-sm">Doctor Access</span>
          </Link>
        </nav>
        <div className="p-6">
          <button className="w-full py-3 bg-[#2d1515] text-[#ef4444] rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">emergency_home</span> Emergency SOS
          </button>
        </div>
      </aside>
      <main className="lg:ml-64 pt-16 h-screen flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#dae2fd]" style={{fontFamily:"'Manrope',sans-serif"}}>Discovery Phase</h1>
            <p className="text-[#8a9bb8] text-sm mt-1">Describe your symptoms naturally. The AI agent will analyze and extract clinical insights in real time.</p>
          </div>
          <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
            {/* Chat Panel */}
            <div className="col-span-12 lg:col-span-8 flex flex-col bg-[#131b2e]/60 backdrop-blur-sm rounded-3xl p-6 border border-[#3c4a62]/10 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#4edea3] text-sm">text_fields</span>
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#8a9bb8]">Live Transcript</h3>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                      msg.role === 'user' ? 'bg-[#4edea3]/20 text-[#dae2fd] rounded-br-none' :
                      msg.role === 'system' ? 'opacity-40 italic text-center w-full' :
                      'bg-[#1a2540] text-[#dae2fd]/90 border border-[#3c4a62]/20 rounded-bl-none shadow-lg'
                    }`}>{msg.content}</div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 ml-2">
                    <span className="w-2 h-2 bg-[#4edea3] rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-[#4edea3] rounded-full animate-pulse delay-75"></span>
                    <span className="w-2 h-2 bg-[#4edea3] rounded-full animate-pulse delay-150"></span>
                    <span className="text-xs text-[#4edea3] italic ml-2">Agent is thinking...</span>
                  </div>
                )}
              </div>
              <form onSubmit={handleSend} className="w-full mt-4 flex gap-2">
                <input
                  type="text"
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder="Type your symptoms here..."
                  className="flex-1 bg-[#0b1326] border border-[#3c4a62]/30 rounded-xl px-4 py-3 text-sm text-[#dae2fd] focus:outline-none focus:border-[#4edea3] transition-colors"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !inputData.trim()}
                  className="bg-gradient-to-br from-[#4edea3] to-[#10b981] text-[#0b1a12] px-6 py-3 rounded-xl font-bold text-sm hover:brightness-110 disabled:opacity-50 transition-all flex gap-2 items-center"
                >
                  <span className="material-symbols-outlined text-sm">send</span> Send
                </button>
              </form>
            </div>
            {/* Insights Panel */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-sm">psychology</span>
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#8a9bb8]">Extracted Insights</h3>
              </div>
              <div className="bg-[#131b2e] rounded-2xl p-4 border-l-2 border-[#4edea3] shadow-lg">
                <div className="text-[10px] text-[#4edea3] font-bold uppercase tracking-wider mb-1">Session</div>
                <div className="text-lg font-bold" style={{fontFamily:"'Manrope',sans-serif"}}>{sessionInfo.sessionId}</div>
                <div className="text-[10px] text-[#8a9bb8] mt-1 italic">Active clinical session</div>
              </div>
              <div className="flex-1 border-2 border-dashed border-[#3c4a62]/20 rounded-2xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 opacity-30 px-8 text-center">
                  <span className="material-symbols-outlined text-2xl">pending</span>
                  <span className="text-[10px] uppercase tracking-widest">Awaiting diagnostic payload from Synthesizer Agent...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Mobile NavBar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#131b2e]/90 backdrop-blur-2xl border-t border-[#3c4a62]/10 rounded-t-3xl">
        <Link prefetch={false} className="flex flex-col items-center text-[#dae2fd]/50 px-4 py-2 active:scale-95 transition-transform hover:text-[#4edea3]" href="/">
          <span className="material-symbols-outlined">monitoring</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Health</span>
        </Link>
        <Link prefetch={false} className="flex flex-col items-center text-[#dae2fd]/50 px-4 py-2 active:scale-95 transition-transform hover:text-[#4edea3]" href="/history">
          <span className="material-symbols-outlined">history_edu</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">History</span>
        </Link>
        <Link prefetch={false} className="flex flex-col items-center bg-gradient-to-br from-[#4edea3]/20 to-[#10b981]/10 text-[#4edea3] rounded-xl px-4 py-2 active:scale-95 transition-transform" href="/intake">
          <span className="material-symbols-outlined">forum</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Consult</span>
        </Link>
        <Link prefetch={false} className="flex flex-col items-center text-[#dae2fd]/50 px-4 py-2 active:scale-95 transition-transform hover:text-[#4edea3]" href="/share">
          <span className="material-symbols-outlined">settings_heart</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-semibold mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default Intake;
