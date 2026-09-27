'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SharePage() {
  const [tokenGenerated, setTokenGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateToken = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setTokenGenerated(true);
    }, 1200);
  };

  const token = 'CC-882-XR2T-9KLP';
  const shareUrl = `https://carecortex.health/access/${token}`;

  const doctors = [
    { name: 'Dr. Sarah Chen', specialty: 'Neuro-Otology', initials: 'SC', color: '#2563eb', lastAccess: 'Oct 14, 2023', status: 'active' },
    { name: 'Dr. Raj Patel', specialty: 'General Medicine', initials: 'RP', color: '#059669', lastAccess: 'Jun 22, 2023', status: 'expired' },
  ];

  return (
    <div className="page-root">
      <div className="page-container">

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="text-heading" style={{ fontSize: 26, color: 'var(--slate-900)', marginBottom: 6 }}>Care Team & Doctor Handoff</h1>
          <p style={{ fontSize: 14, color: 'var(--slate-500)' }}>
            Securely share your clinical summary and AI triage reports with your healthcare providers.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid-main">

          {/* Left: Share Token Generator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Generate Token Card */}
            <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--slate-100)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined icon-filled" style={{ fontSize: 22, color: 'var(--blue-600)' }}>key</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--slate-900)' }}>Generate Access Token</div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--slate-500)', marginLeft: 52 }}>
                  Create a secure, one-time link for your doctor. Tokens expire automatically after 24 hours.
                </p>
              </div>

              <div style={{ padding: '24px 28px' }}>
                {!tokenGenerated ? (
                  <div>
                    {/* What gets shared */}
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                        What will be shared:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                          { icon: 'clinical_notes', label: 'AI Clinical Summary (SBAR)', color: '#2563eb', bg: '#eff6ff' },
                          { icon: 'monitor_heart', label: 'Vitals & Health Metrics', color: '#059669', bg: '#ecfdf5' },
                          { icon: 'history', label: 'Medical History Timeline', color: '#4f46e5', bg: '#eef2ff' },
                          { icon: 'medication', label: 'Active Medications', color: '#d97706', bg: '#fffbeb' },
                        ].map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--slate-50)', borderRadius: 10, border: '1px solid var(--slate-100)' }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span className="material-symbols-outlined icon-filled" style={{ fontSize: 16, color: item.color }}>{item.icon}</span>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--slate-700)' }}>{item.label}</span>
                            <span className="material-symbols-outlined icon-filled" style={{ fontSize: 16, color: 'var(--emerald-600)', marginLeft: 'auto' }}>check_circle</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={generateToken}
                      disabled={generating}
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '13px 20px', borderRadius: 12 }}
                    >
                      {generating ? (
                        <>
                          <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                          Generating Secure Token…
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>qr_code</span>
                          Generate Secure Token
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      {/* Simulated QR Code */}
                      <div style={{
                        width: 160, height: 160, margin: '0 auto 16px',
                        background: '#fff',
                        border: '2px solid var(--slate-200)',
                        borderRadius: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--shadow-md)',
                      }}>
                        <span className="material-symbols-outlined icon-filled" style={{ fontSize: 100, color: 'var(--slate-800)' }}>qr_code</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--slate-400)', marginBottom: 12 }}>Scan to share or use the link below</div>
                    </div>

                    {/* Token display */}
                    <div style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 12, padding: '14px 18px', marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Access Token</div>
                      <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: 'var(--blue-700)', letterSpacing: '0.15em' }}>{token}</div>
                    </div>

                    {/* URL display */}
                    <div style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 12, padding: '12px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--slate-600)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {shareUrl}
                      </span>
                      <button style={{ flexShrink: 0, color: 'var(--blue-600)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>content_copy</span>
                        Copy
                      </button>
                    </div>

                    {/* Expiry notice */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--amber-50)', border: '1px solid var(--amber-100)', borderRadius: 10, marginBottom: 16 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--amber-600)' }}>timer</span>
                      <span style={{ fontSize: 12, color: 'var(--amber-700)', fontWeight: 600 }}>This token expires in 23 hours 59 minutes</span>
                    </div>

                    <button onClick={() => setTokenGenerated(false)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
                      Generate New Token
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div style={{ background: 'linear-gradient(135deg, var(--blue-50), var(--teal-50))', border: '1px solid var(--blue-100)', borderRadius: 18, padding: '20px 24px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: 20, color: '#fff' }}>shield</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--slate-800)', marginBottom: 6 }}>HIPAA Compliant & End-to-End Encrypted</div>
                <p style={{ fontSize: 13, color: 'var(--slate-600)', lineHeight: 1.65 }}>
                  All data transfers are encrypted in transit. Providers can only view data with the token you explicitly generate. Tokens auto-expire and can be revoked at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Care Team + Recent Access */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Care Team */}
            <div>
              <div className="section-label">My Care Team</div>
              <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                {doctors.map((doc, i) => (
                  <div key={i} style={{
                    padding: '18px 20px',
                    borderBottom: i < doctors.length - 1 ? '1px solid var(--slate-100)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: 46, height: 46, borderRadius: '50%',
                      background: doc.color,
                      color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 14,
                      flexShrink: 0,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                      {doc.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--slate-800)' }}>{doc.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate-400)', marginTop: 2 }}>{doc.specialty}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{
                        fontSize: 11, fontWeight: 700, marginBottom: 4, padding: '3px 9px', borderRadius: 99,
                        background: doc.status === 'active' ? 'var(--emerald-50)' : 'var(--slate-100)',
                        color: doc.status === 'active' ? 'var(--emerald-700)' : 'var(--slate-400)',
                      }}>
                        {doc.status === 'active' ? '● Active Access' : 'Expired'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--slate-400)' }}>{doc.lastAccess}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Options */}
            <div>
              <div className="section-label">Share Options</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: 'qr_code', label: 'Share via QR Code', desc: 'Show QR code to your doctor in person', color: 'var(--blue-600)', bg: 'var(--blue-50)', href: '#' },
                  { icon: 'link', label: 'Copy Shareable Link', desc: 'Send the access link via email or messaging', color: 'var(--teal-600)', bg: 'var(--teal-50)', href: '#' },
                  { icon: 'print', label: 'Print Summary Report', desc: 'Download and print the clinical report', color: 'var(--purple-600)', bg: 'var(--purple-50)', href: '/health' },
                ].map((opt, i) => (
                  <Link key={i} href={opt.href} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px 18px',
                    background: '#fff',
                    border: '1px solid var(--slate-200)',
                    borderRadius: 14,
                    textDecoration: 'none',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: opt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-outlined icon-filled" style={{ fontSize: 20, color: opt.color }}>{opt.icon}</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--slate-800)' }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate-400)', marginTop: 2 }}>{opt.desc}</div>
                    </div>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--slate-300)', marginLeft: 'auto' }}>arrow_forward_ios</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
