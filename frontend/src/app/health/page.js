'use client';

import React, { useState } from 'react';

export default function HealthPage() {
  const [ragQuery, setRagQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const search = (q = null) => {
    const query = q || ragQuery;
    if (!query.trim()) return;
    setSearching(true);
    setTimeout(() => {
      setResults([
        {
          title: 'Vestibular Migraine — Clinical Practice Guideline',
          score: 94,
          excerpt: 'Patients presenting with acute photophobia combined with episodic vertigo and nausea should be evaluated for vestibular migraine using otology vestibular protocols before considering other diagnoses.',
          source: 'Medical Database · clinical_context_v1',
        },
        {
          title: 'Acute Vertigo — Triage & Pathology Protocol',
          score: 87,
          excerpt: 'Symptoms lasting > 48 hours with persistent nausea warrant anti-emetic administration and neuroimaging to rule out central causes.',
          source: 'Medical Database · pathology_context_v1',
        },
        {
          title: 'Photophobia Differential Diagnosis',
          score: 76,
          excerpt: 'Light sensitivity accompanied by unilateral headache is a hallmark presentation of migraine with aura. Intracranial pathology should be excluded if neurological deficits are present.',
          source: 'Medical Database · symptoms_context_v2',
        },
      ]);
      setSearching(false);
    }, 700);
  };

  const sbarSections = [
    {
      key: 'S',
      title: 'Situation',
      color: '#2563eb',
      bg: '#eff6ff',
      border: '#bfdbfe',
      content: '34-year-old female presenting with a 3-day history of acute recurrent vertigo episodes, severe photophobia, and localized left-sided headache rated 8/10 in severity.',
    },
    {
      key: 'B',
      title: 'Background',
      color: '#4f46e5',
      bg: '#eef2ff',
      border: '#c7d2fe',
      content: 'Known allergies: Penicillin, Sulfa drugs. Prior history of mild vitamin D deficiency (2022) and stress-related tinnitus. No recent head trauma or loss of consciousness.',
    },
    {
      key: 'A',
      title: 'Assessment',
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      content: 'Symptoms correlate strongly with Vestibular Migraine (94% AI confidence). Secondary consideration: Benign Paroxysmal Positional Vertigo (68%).',
    },
    {
      key: 'R',
      title: 'Recommendation',
      color: '#059669',
      bg: '#ecfdf5',
      border: '#a7f3d0',
      content: 'Recommend clinical evaluation for otology ENG/VNG testing, short-term triptan therapy trial, and hydration stabilization protocol. Follow-up in 7 days.',
    },
  ];

  const vitals = [
    { label: 'Heart Rate', value: '72 bpm', icon: 'favorite', color: '#e11d48', bg: '#fff1f2', status: 'Normal' },
    { label: 'Blood Pressure', value: '118/76', icon: 'blood_pressure', color: '#2563eb', bg: '#eff6ff', status: 'Normal' },
    { label: 'Temperature', value: '98.6°F', icon: 'thermometer', color: '#d97706', bg: '#fffbeb', status: 'Normal' },
    { label: 'O₂ Saturation', value: '98%', icon: 'air', color: '#0d9488', bg: '#f0fdfa', status: 'Normal' },
  ];

  return (
    <div className="page-root">
      <div className="page-container">

        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 className="text-heading" style={{ fontSize: 26, color: 'var(--slate-900)', marginBottom: 6 }}>
              My Health Report
            </h1>
            <p style={{ fontSize: 14, color: 'var(--slate-500)' }}>
              AI-generated clinical summary · Patient: Elena Vance (ID: 882-ES)
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => window.print()} className="btn btn-secondary" style={{ fontSize: 13 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>print</span>
              Print Report
            </button>
            <button className="btn btn-primary" style={{ fontSize: 13 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>share</span>
              Share
            </button>
          </div>
        </div>

        {/* AI Confidence Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff, #f0fdfa)',
          border: '1px solid var(--blue-200)',
          borderRadius: 16,
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 28,
          flexWrap: 'wrap',
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span className="material-symbols-outlined icon-filled" style={{ fontSize: 22, color: '#fff' }}>psychology</span>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--slate-800)', marginBottom: 4 }}>
              AI Assessment: <span style={{ color: 'var(--blue-700)' }}>Vestibular Migraine</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 6, background: 'var(--blue-100)', borderRadius: 99, overflow: 'hidden', maxWidth: 200 }}>
                <div style={{ width: '94%', height: '100%', background: 'var(--blue-600)', borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue-700)' }}>94% Confidence</span>
            </div>
          </div>
          <span style={{ background: '#fff', border: '1px solid var(--amber-200)', color: 'var(--amber-700)', fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 99 }}>
            Priority: Moderate
          </span>
        </div>

        {/* Two Column Layout */}
        <div className="grid-main">

          {/* Left: SBAR + RAG */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* SBAR Report */}
            <div>
              <div className="section-label">Clinical Summary (SBAR Format)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {sbarSections.map((s, i) => (
                  <div key={i} style={{
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    borderRadius: 16,
                    padding: '20px 22px',
                    transition: 'all 0.2s ease',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: s.color,
                        color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 14,
                        flexShrink: 0,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}>
                        {s.key}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {s.title}
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--slate-700)', lineHeight: 1.65 }}>
                      {s.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Database RAG Search */}
            <div>
              <div className="section-label">Medical Database Search (RAG Engine)</div>
              <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--slate-100)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined icon-filled" style={{ fontSize: 18, color: 'var(--teal-600)' }}>database</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--slate-800)' }}>Cross-Reference Medical Guidelines</div>
                      <div style={{ fontSize: 12, color: 'var(--slate-400)' }}>ChromaDB-powered semantic search</div>
                    </div>
                  </div>

                  {/* Sample queries */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                    {['Vestibular migraine protocol', 'Hypertension risk triage', 'Diabetes management guidelines'].map((q, i) => (
                      <button key={i} onClick={() => { setRagQuery(q); search(q); }} style={{
                        padding: '6px 12px', borderRadius: 99,
                        background: 'var(--slate-100)', color: 'var(--slate-600)',
                        border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-200)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--slate-100)'}
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Search input */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input
                      className="input-field"
                      value={ragQuery}
                      onChange={e => setRagQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && search()}
                      placeholder="Search medical database..."
                      style={{ flex: 1 }}
                    />
                    <button onClick={() => search()} disabled={searching} className="btn btn-teal" style={{ flexShrink: 0, fontSize: 13 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>search</span>
                      {searching ? 'Searching…' : 'Search'}
                    </button>
                  </div>
                </div>

                {/* Results */}
                {results && (
                  <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal-700)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {results.length} Results Found
                    </div>
                    {results.map((r, i) => (
                      <div key={i} style={{
                        background: 'var(--slate-50)',
                        border: '1px solid var(--slate-200)',
                        borderRadius: 14,
                        padding: '16px 18px',
                        transition: 'border-color 0.2s',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--slate-800)', flex: 1 }}>{r.title}</div>
                          <div style={{
                            background: r.score >= 90 ? 'var(--emerald-50)' : 'var(--amber-50)',
                            color: r.score >= 90 ? 'var(--emerald-700)' : 'var(--amber-700)',
                            fontSize: 11, fontWeight: 700,
                            padding: '3px 8px', borderRadius: 99,
                            flexShrink: 0,
                          }}>
                            {r.score}% match
                          </div>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: 10 }}>
                          "{r.excerpt}"
                        </p>
                        <div style={{ fontSize: 11, color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>source</span>
                          {r.source}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Vitals + Medications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Current Vitals */}
            <div>
              <div className="section-label">Current Vitals</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {vitals.map((v, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: '16px', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: v.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined icon-filled" style={{ fontSize: 16, color: v.color }}>{v.icon}</span>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--emerald-700)', background: 'var(--emerald-50)', padding: '2px 7px', borderRadius: 99 }}>
                        {v.status}
                      </span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--slate-900)', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}>{v.value}</div>
                    <div style={{ fontSize: 12, color: 'var(--slate-400)', marginTop: 2 }}>{v.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div>
              <div className="section-label">Active Medications</div>
              <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                {[
                  { name: 'Vitamin D3 (5000 IU)', dose: '1 capsule daily with food', refill: 'Oct 30', icon: 'medication', color: '#4f46e5', bg: '#eef2ff' },
                  { name: 'Magnesium Glycinate', dose: '400mg at bedtime', refill: 'Nov 5', icon: 'vaccines', color: '#0d9488', bg: '#f0fdfa' },
                ].map((med, i) => (
                  <div key={i} style={{ padding: '16px 20px', borderBottom: i === 0 ? '1px solid var(--slate-100)' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: med.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-outlined icon-filled" style={{ fontSize: 19, color: med.color }}>{med.icon}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--slate-800)' }}>{med.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate-400)', marginTop: 2 }}>{med.dose}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: 'var(--slate-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Refill</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate-700)' }}>{med.refill}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Known Allergies */}
            <div style={{ background: 'var(--rose-50)', border: '1px solid var(--rose-100)', borderRadius: 16, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: 18, color: 'var(--rose-600)' }}>warning</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--rose-600)' }}>Known Allergies</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Penicillin', 'Sulfonamides'].map((a, i) => (
                  <span key={i} style={{ background: '#fff', border: '1px solid var(--rose-200)', color: 'var(--rose-600)', fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 99 }}>
                    ⚠ {a}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
