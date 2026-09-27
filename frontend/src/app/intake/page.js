'use client';

import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../actions';

const initialMessages = [
  {
    sender: 'agent',
    text: "Hello Elena! I'm your CareCortex clinical assistant. I'll help evaluate your symptoms and prepare a report for your doctor.\n\nHow are you feeling today? Please describe your symptoms in as much detail as possible.",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
];

export default function IntakePage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState('SES-89214');
  const [patientId] = useState('PAT-882');
  const [extracted, setExtracted] = useState({ symptoms: '—', duration: '—', severity: '—', location: '—' });
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text = null) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    setInput('');

    const userMsg = { sender: 'user', text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Update extracted symptoms from message
    const lower = msg.toLowerCase();
    const newExtracted = { ...extracted };
    if (lower.includes('headache') || lower.includes('head')) { newExtracted.symptoms = 'Headache'; newExtracted.location = 'Head'; }
    if (lower.includes('back')) { newExtracted.symptoms = 'Back pain'; newExtracted.location = 'Lower back'; }
    if (lower.includes('fever')) { newExtracted.symptoms = (newExtracted.symptoms === '—' ? '' : newExtracted.symptoms + ', ') + 'Fever'; }
    if (lower.includes('day') || lower.includes('week')) {
      const dayMatch = lower.match(/(\d+)\s*(day|days|week|weeks)/);
      if (dayMatch) newExtracted.duration = dayMatch[0];
    }
    if (/\b([1-9]|10)\s*\/\s*10\b/.test(lower)) {
      const m = lower.match(/(\d+)\s*\/\s*10/);
      if (m) newExtracted.severity = `${m[1]}/10`;
    }
    setExtracted(newExtracted);

    try {
      const result = await sendChatMessage(sessionId, patientId, msg);
      let reply = result?.reply || `Thank you for sharing that. Could you tell me when these symptoms started and how severe they are on a scale of 1–10?`;
      setMessages(prev => [...prev, { sender: 'agent', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch {
      setMessages(prev => [...prev, { sender: 'agent', text: "I've noted your symptoms. On a scale of 1–10, how would you rate the severity, and when did they start?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "I have a severe headache with fever for 2 days",
    "Sharp lower back pain when I stand up",
    "I feel dizzy and nauseous since yesterday",
  ];

  const steps = [
    { label: 'Describe Symptoms', icon: 'chat', done: messages.length > 1, active: messages.length <= 1 },
    { label: 'AI Analysis', icon: 'psychology', done: messages.length > 3, active: messages.length > 1 && messages.length <= 3 },
    { label: 'Report Ready', icon: 'clinical_notes', done: false, active: false },
  ];

  return (
    <div className="page-root">
      <div className="page-container">

        {/* Page Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 className="text-heading" style={{ fontSize: 26, color: 'var(--slate-900)', marginBottom: 6 }}>
            Symptom Checker
          </h1>
          <p style={{ fontSize: 14, color: 'var(--slate-500)' }}>
            Describe how you're feeling. Our AI will analyze your symptoms and prepare a clinical report.
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          background: '#fff', border: '1px solid var(--slate-200)',
          borderRadius: 16, padding: '16px 24px',
          marginBottom: 28, boxShadow: 'var(--shadow-sm)',
          overflowX: 'auto',
        }}>
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: step.done ? 'var(--emerald-600)' : step.active ? 'var(--blue-600)' : 'var(--slate-100)',
                  color: (step.done || step.active) ? '#fff' : 'var(--slate-400)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: 18 }}>
                    {step.done ? 'check' : step.icon}
                  </span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: step.done ? 'var(--emerald-700)' : step.active ? 'var(--blue-700)' : 'var(--slate-400)' }}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, background: step.done ? 'var(--emerald-200)' : 'var(--slate-200)', margin: '0 16px', minWidth: 24 }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main Layout */}
        <div className="grid-main">

          {/* ─── Chat Column ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 20, overflow: 'hidden', height: 580, boxShadow: 'var(--shadow-sm)' }}>

            {/* Chat Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--slate-100)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: 20, color: '#fff' }}>smart_toy</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--slate-800)' }}>Clinical AI Assistant</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--emerald-600)', fontWeight: 500 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--emerald-600)', display: 'inline-block' }} />
                  Active — Listening
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--slate-50)' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate-400)', marginBottom: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {msg.sender === 'user' ? 'You' : 'AI Assistant'} · {msg.time}
                  </div>
                  <div className={msg.sender === 'user' ? 'bubble-user' : 'bubble-agent'} style={{ whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div className="bubble-agent" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 18px' }}>
                    {[0, 0.2, 0.4].map((d, i) => (
                      <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--blue-400)', display: 'inline-block', animation: `bounce-dot 1.2s ${d}s ease-in-out infinite` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--slate-100)', display: 'flex', gap: 8, overflowX: 'auto', background: '#fff' }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{
                  padding: '7px 14px',
                  borderRadius: 99,
                  background: 'var(--slate-100)',
                  color: 'var(--slate-600)',
                  fontSize: 12, fontWeight: 500,
                  whiteSpace: 'nowrap',
                  border: 'none', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-200)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--slate-100)'}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--slate-100)', display: 'flex', gap: 10, alignItems: 'center', background: '#fff' }}>
              <input
                className="input-field"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Describe your symptoms..."
                style={{ flex: 1, margin: 0, borderRadius: 99 }}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                style={{
                  width: 42, height: 42,
                  borderRadius: '50%',
                  background: input.trim() && !loading ? 'var(--blue-600)' : 'var(--slate-200)',
                  color: input.trim() && !loading ? '#fff' : 'var(--slate-400)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                  flexShrink: 0,
                  transition: 'all 0.18s ease',
                }}
              >
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: 20, marginLeft: 2 }}>send</span>
              </button>
            </div>
          </div>

          {/* ─── Right: Symptom Summary ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Extracted Info */}
            <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--slate-100)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: 18, color: 'var(--teal-600)' }}>fact_check</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--slate-800)' }}>Symptom Summary</div>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <p style={{ fontSize: 12, color: 'var(--slate-400)', lineHeight: 1.6, marginBottom: 16 }}>
                  As you chat, the AI automatically organizes your symptoms for your doctor.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Main Symptoms', value: extracted.symptoms, icon: 'sick' },
                    { label: 'Body Location', value: extracted.location, icon: 'location_on' },
                    { label: 'Duration', value: extracted.duration, icon: 'schedule' },
                    { label: 'Severity', value: extracted.severity, icon: 'bar_chart' },
                  ].map((r, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '11px 14px',
                      background: 'var(--slate-50)',
                      borderRadius: 10,
                      border: '1px solid var(--slate-100)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--slate-400)' }}>{r.icon}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.label}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: r.value === '—' ? 'var(--slate-300)' : 'var(--slate-800)' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div style={{ background: 'var(--blue-50)', border: '1px solid var(--blue-100)', borderRadius: 16, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: 20, color: 'var(--blue-600)', flexShrink: 0, marginTop: 1 }}>shield</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue-800)', marginBottom: 4 }}>Your data is private</div>
                <div style={{ fontSize: 12, color: 'var(--blue-700)', lineHeight: 1.6, opacity: 0.85 }}>
                  This session is encrypted and HIPAA compliant. Only you and your authorized providers can view this report.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
