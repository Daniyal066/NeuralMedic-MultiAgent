'use client';

import React, { useState } from 'react';

const records = [
  {
    date: 'Oct 14, 2023',
    title: 'Emergency Visit: Severe Vertigo & Photophobia',
    doctor: 'Dr. Sarah Chen',
    facility: 'City General Hospital',
    type: 'Acute',
    typeColor: '#e11d48',
    typeBg: '#fff1f2',
    icon: 'emergency',
    iconColor: '#e11d48',
    iconBg: '#fff1f2',
    notes: 'Patient admitted with sudden onset severe photophobia and cluster nausea. IV fluids and anti-emetics administered. Discharged after 6 hours of observation with follow-up scheduled.',
    attachments: ['Scan_882.dicom', 'Blood_Chem.pdf'],
  },
  {
    date: 'Jun 22, 2023',
    title: 'Annual Physical Examination',
    doctor: 'Dr. Raj Patel',
    facility: 'Westside Medical Center',
    type: 'Routine',
    typeColor: '#059669',
    typeBg: '#ecfdf5',
    icon: 'stethoscope',
    iconColor: '#059669',
    iconBg: '#ecfdf5',
    notes: 'All vitals within normal range. Blood pressure slightly elevated at 128/82 mmHg. Vitamin D levels low (22 ng/mL). Recommended dietary changes and supplements.',
    attachments: ['Lab_Results_Jun23.pdf'],
  },
  {
    date: 'Feb 12, 2023',
    title: 'Laparoscopic Appendectomy',
    doctor: 'Dr. Maria Silva',
    facility: 'St. Mary\'s Surgical Center',
    type: 'Surgical',
    typeColor: '#d97706',
    typeBg: '#fffbeb',
    icon: 'healing',
    iconColor: '#d97706',
    iconBg: '#fffbeb',
    notes: 'Uncomplicated laparoscopic procedure. Recovery room vitals stable throughout. Prescribed standard post-operative pain management. Full recovery in 2 weeks.',
    attachments: ['Op_Report_Feb23.pdf', 'Discharge_Summary.pdf'],
  },
  {
    date: 'Nov 5, 2022',
    title: 'Audiology Assessment — Tinnitus Evaluation',
    doctor: 'Dr. Sarah Chen',
    facility: 'City General — ENT Clinic',
    type: 'Consult',
    typeColor: '#4f46e5',
    typeBg: '#eef2ff',
    icon: 'hearing',
    iconColor: '#4f46e5',
    iconBg: '#eef2ff',
    notes: 'Evaluation for reported high-pitched tinnitus in left ear. Pure tone audiometry within normal limits. Assessment: stress-related. Recommended stress management and sleep hygiene.',
    attachments: ['Audiogram_Nov22.pdf'],
  },
];

export default function HistoryPage() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('All');

  const types = ['All', 'Acute', 'Routine', 'Surgical', 'Consult'];
  const filtered = filter === 'All' ? records : records.filter(r => r.type === filter);

  return (
    <div className="page-root">
      <div className="page-container">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="text-heading" style={{ fontSize: 26, color: 'var(--slate-900)', marginBottom: 6 }}>Medical Records</h1>
            <p style={{ fontSize: 14, color: 'var(--slate-500)' }}>Your complete clinical history and event timeline.</p>
          </div>
          <button className="btn btn-secondary" style={{ fontSize: 13 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
            Export All
          </button>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, overflowX: 'auto', padding: '2px 0' }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: '8px 18px',
              borderRadius: 99,
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.18s ease',
              background: filter === t ? 'var(--blue-600)' : '#fff',
              color: filter === t ? '#fff' : 'var(--slate-600)',
              boxShadow: filter === t ? '0 2px 8px rgba(37,99,235,0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
              border: filter === t ? 'none' : '1px solid var(--slate-200)',
            }}>
              {t}
            </button>
          ))}
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
          {[
            { label: 'Total Records', value: records.length, icon: 'folder_open', color: 'var(--blue-600)', bg: 'var(--blue-50)' },
            { label: 'Procedures', value: 1, icon: 'healing', color: 'var(--amber-600)', bg: 'var(--amber-50)' },
            { label: 'Consultations', value: 3, icon: 'stethoscope', color: 'var(--emerald-600)', bg: 'var(--emerald-50)' },
            { label: 'Documents', value: 7, icon: 'attach_file', color: 'var(--purple-600)', bg: 'var(--purple-50)' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: '16px 20px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: 18, color: s.color }}>{s.icon}</span>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--slate-900)', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--slate-400)', marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Records */}
        <div className="section-label">Timeline</div>
        <div style={{ position: 'relative' }}>
          {/* Timeline vertical line */}
          <div style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 2, background: 'var(--slate-200)', zIndex: 0 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {filtered.map((rec, i) => {
              const isOpen = expanded === i;
              return (
                <div key={i} style={{ display: 'flex', gap: 20, position: 'relative', zIndex: 1 }}>
                  {/* Timeline dot */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: rec.iconBg, border: `3px solid #fff`,
                    boxShadow: `0 0 0 2px ${rec.iconColor}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 12,
                  }}>
                    <span className="material-symbols-outlined icon-filled" style={{ fontSize: 17, color: rec.iconColor }}>{rec.icon}</span>
                  </div>

                  {/* Card */}
                  <div
                    style={{
                      flex: 1,
                      background: '#fff',
                      border: '1px solid var(--slate-200)',
                      borderRadius: 18,
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'box-shadow 0.2s, transform 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
                    onClick={() => setExpanded(isOpen ? null : i)}
                  >
                    <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--slate-900)' }}>{rec.title}</span>
                          <span style={{ background: rec.typeBg, color: rec.typeColor, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, flexShrink: 0 }}>
                            {rec.type}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--slate-400)', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>person</span>
                            {rec.doctor}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>local_hospital</span>
                            {rec.facility}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>calendar_month</span>
                            {rec.date}
                          </span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--slate-400)', flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                        expand_more
                      </span>
                    </div>

                    {/* Expanded Content */}
                    {isOpen && (
                      <div style={{ padding: '0 22px 20px', borderTop: '1px solid var(--slate-100)', paddingTop: 16 }}>
                        <p style={{ fontSize: 14, color: 'var(--slate-600)', lineHeight: 1.7, marginBottom: 16 }}>{rec.notes}</p>
                        {rec.attachments?.length > 0 && (
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Attachments</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {rec.attachments.map((f, j) => (
                                <button key={j} style={{
                                  display: 'flex', alignItems: 'center', gap: 6,
                                  padding: '7px 14px', borderRadius: 10,
                                  background: 'var(--slate-50)', border: '1px solid var(--slate-200)',
                                  fontSize: 12, fontWeight: 600, color: 'var(--blue-600)',
                                  cursor: 'pointer', transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-50)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'var(--slate-50)'}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>attach_file</span>
                                  {f}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .stats-row { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
