'use client';

import React from 'react';
import Link from 'next/link';

const S = {
  // Typography colors
  t1: 'var(--slate-900)',
  t2: 'var(--slate-700)',
  t3: 'var(--slate-500)',
  t4: 'var(--slate-400)',
};

function StatCard({ icon, iconBg, iconColor, label, value, unit, badge, badgeColor, badgeBg, delay = 0 }) {
  return (
    <div className="stat-card anim-fade-up" style={{ animationDelay: `${delay}s` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="icon-wrap" style={{
          width: 44, height: 44,
          background: iconBg,
          color: iconColor,
          borderRadius: 12,
        }}>
          <span className="material-symbols-outlined icon-filled" style={{ fontSize: 22 }}>{icon}</span>
        </div>
        {badge && (
          <span style={{
            background: badgeBg,
            color: badgeColor,
            fontSize: 11, fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 99,
            letterSpacing: '0.04em',
          }}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: S.t1, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em', lineHeight: 1 }}>
          {value}
          {unit && <span style={{ fontSize: 14, fontWeight: 500, color: S.t3, marginLeft: 4 }}>{unit}</span>}
        </div>
        <div style={{ fontSize: 13, color: S.t3, fontWeight: 500, marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

function ActivityRow({ icon, iconBg, iconColor, title, desc, date }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
      padding: '16px 20px',
      borderBottom: '1px solid var(--slate-100)',
      transition: 'background 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        width: 38, height: 38,
        borderRadius: 10,
        background: iconBg,
        color: iconColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span className="material-symbols-outlined icon-filled" style={{ fontSize: 19 }}>{icon}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: S.t1 }}>{title}</div>
          <div style={{ fontSize: 12, color: S.t4, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>{date}</div>
        </div>
        <div style={{ fontSize: 13, color: S.t3, marginTop: 2 }}>{desc}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const stats = [
    { icon: 'favorite', iconBg: 'var(--rose-50)', iconColor: 'var(--rose-600)', label: 'Resting Heart Rate', value: '72', unit: 'bpm', badge: 'Normal', badgeBg: 'var(--emerald-50)', badgeColor: 'var(--emerald-700)', delay: 0.05 },
    { icon: 'calendar_month', iconBg: 'var(--blue-50)', iconColor: 'var(--blue-600)', label: 'Next Appointment', value: 'Oct 28', unit: '', badge: 'Upcoming', badgeBg: 'var(--amber-50)', badgeColor: 'var(--amber-700)', delay: 0.1 },
    { icon: 'medication', iconBg: 'var(--indigo-50)', iconColor: 'var(--indigo-600)', label: 'Active Prescriptions', value: '2', unit: '', badge: null, delay: 0.15 },
  ];

  const activities = [
    { icon: 'smart_toy', iconBg: 'var(--purple-50)', iconColor: 'var(--purple-600)', title: 'AI Symptom Check', desc: 'Evaluated for mild recurring headaches — report ready.', date: 'Today, 9:00 AM' },
    { icon: 'science', iconBg: 'var(--blue-50)', iconColor: 'var(--blue-600)', title: 'Lab Results Uploaded', desc: 'Annual metabolic panel ready for review.', date: 'Yesterday' },
    { icon: 'vaccines', iconBg: 'var(--teal-50)', iconColor: 'var(--teal-600)', title: 'Prescription Refilled', desc: 'Vitamin D3 (5000 IU) picked up at pharmacy.', date: 'Oct 14' },
  ];

  const quickActions = [
    { icon: 'stethoscope', label: 'Check Symptoms', desc: 'Start AI triage', color: '#2563eb', bg: '#eff6ff', href: '/intake' },
    { icon: 'ecg_heart', label: 'My Health Report', desc: 'View AI summary', color: '#0d9488', bg: '#f0fdfa', href: '/health' },
    { icon: 'folder_open', label: 'Medical Records', desc: 'View full timeline', color: '#4f46e5', bg: '#eef2ff', href: '/history' },
    { icon: 'diversity_3', label: 'Care Team', desc: 'Share with doctor', color: '#9333ea', bg: '#faf5ff', href: '/share' },
  ];

  return (
    <div className="page-root anim-fade-up">
      <div className="page-container">

        {/* ─── HERO GREETING ─── */}
        <div style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
          borderRadius: 24,
          padding: '36px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          marginBottom: 32,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(37,99,235,0.25)',
        }}>
          {/* BG decoration */}
          <div style={{ position: 'absolute', right: -60, top: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', right: 80, bottom: -80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em', marginBottom: 6 }}>
              Good morning, 👋
            </div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 32, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 10 }}>
              Elena Vance
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {['34 Yrs', 'O-Positive', 'ID: 882-ES'].map((tag, i) => (
                <span key={i} style={{
                  fontSize: 12, fontWeight: 600,
                  color: 'rgba(255,255,255,0.75)',
                  background: 'rgba(255,255,255,0.12)',
                  padding: '4px 10px',
                  borderRadius: 99,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 1, flexShrink: 0 }}>
            <Link href="/intake" className="btn" style={{
              background: '#fff',
              color: '#2563eb',
              padding: '11px 22px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              textDecoration: 'none',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>stethoscope</span>
              Check Symptoms
            </Link>
          </div>
        </div>

        {/* ─── STAT CARDS ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}
             className="stats-grid">
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* ─── MAIN CONTENT GRID ─── */}
        <div className="grid-main">

          {/* ─── LEFT: Recent Activity + Quick Actions ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Quick Action Buttons */}
            <div>
              <div className="section-label">Quick Access</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {quickActions.map((a, i) => (
                  <Link key={i} href={a.href} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '16px 18px',
                    background: '#fff',
                    border: '1px solid var(--slate-200)',
                    borderRadius: 16,
                    textDecoration: 'none',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: a.bg, color: a.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span className="material-symbols-outlined icon-filled" style={{ fontSize: 20 }}>{a.icon}</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--slate-800)', lineHeight: 1.2 }}>{a.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate-400)', marginTop: 2 }}>{a.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="section-label">Recent Activity</div>
              <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                {activities.map((a, i) => <ActivityRow key={i} {...a} />)}
                <div style={{ padding: '12px 20px', textAlign: 'center' }}>
                  <Link href="/history" style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue-600)', textDecoration: 'none' }}>
                    View Full History →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: AI Banner + Doctor Card ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* AI Symptom Checker Banner */}
            <div style={{
              background: 'linear-gradient(145deg, #1d4ed8, #2563eb)',
              borderRadius: 20,
              padding: '28px 28px 24px',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
            }}>
              <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.08 }}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: 120 }}>psychology</span>
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 99, marginBottom: 14 }}>
                  NeuralMedic AI Engine
                </span>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 20, lineHeight: 1.2, marginBottom: 10 }}>
                  Feeling unwell?
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 20 }}>
                  Our multi-agent AI evaluates your symptoms and creates a clinical report for your doctor — in minutes.
                </p>
                <Link href="/intake" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#fff', color: '#2563eb',
                  padding: '10px 18px',
                  borderRadius: 10,
                  fontSize: 13, fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  transition: 'all 0.18s ease',
                }}>
                  Start Analysis
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Upcoming Appointment */}
            <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--slate-100)' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--slate-800)' }}>Upcoming Appointment</div>
                <span style={{ background: 'var(--amber-50)', color: 'var(--amber-700)', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99 }}>Oct 28</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #0d9488)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0,
                }}>
                  SC
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--slate-800)' }}>Dr. Sarah Chen</div>
                  <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 2 }}>Neuro-Otology Specialist</div>
                  <div style={{ fontSize: 12, color: 'var(--blue-600)', marginTop: 4, fontWeight: 600 }}>2:30 PM · City General Hospital</div>
                </div>
              </div>
              <Link href="/share" className="btn btn-secondary" style={{ width: '100%', marginTop: 16, justifyContent: 'center', textDecoration: 'none', fontSize: 13 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>qr_code</span>
                Share My Report
              </Link>
            </div>

            {/* Health Status Summary */}
            <div style={{ background: 'var(--emerald-50)', border: '1px solid var(--emerald-100)', borderRadius: 20, padding: '20px 24px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: 20, color: 'var(--emerald-600)' }}>verified</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--emerald-700)' }}>Health Status: Good</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--emerald-700)', lineHeight: 1.6, opacity: 0.85 }}>
                All your recent vitals are within normal range. Keep up with your prescribed medications and your next checkup on Oct 28.
              </p>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
