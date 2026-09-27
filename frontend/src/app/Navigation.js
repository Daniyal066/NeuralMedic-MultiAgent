'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home',         path: '/',        icon: 'home' },
  { name: 'Symptoms',     path: '/intake',  icon: 'stethoscope' },
  { name: 'My Health',    path: '/health',  icon: 'ecg_heart' },
  { name: 'Records',      path: '/history', icon: 'folder_open' },
  { name: 'Care Team',    path: '/share',   icon: 'diversity_3' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [showStatus, setShowStatus] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const services = [
    { name: 'Orchestrator',       status: 'Online',     color: '#059669' },
    { name: 'Interview Agent',    status: 'Active',     color: '#2563eb' },
    { name: 'Pathology Worker',   status: 'Active',     color: '#4f46e5' },
    { name: 'Risk Evaluator',     status: 'Active',     color: '#d97706' },
    { name: 'Synthesizer Agent',  status: 'Active',     color: '#9333ea' },
    { name: 'ChromaDB (RAG)',     status: 'Online',     color: '#059669' },
    { name: 'PostgreSQL / Redis', status: 'Connected',  color: '#059669' },
  ];

  return (
    <>
      {/* ─── TOP BAR ─── */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 'var(--nav-height)',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--slate-200)',
        boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          maxWidth: 1120,
          margin: '0 auto',
          height: '100%',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #2563eb, #0d9488)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
              flexShrink: 0,
            }}>
              <span className="material-symbols-outlined icon-filled" style={{ color: '#fff', fontSize: 20 }}>
                medical_services
              </span>
            </div>
            <div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 17, color: 'var(--slate-900)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                CareCortex
              </div>
              <div style={{ fontSize: 10, color: 'var(--slate-400)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>
                Patient Portal
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}
               className="desktop-nav">
            {navItems.map(item => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path} className={`nav-link ${isActive ? 'active' : ''}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* System Status */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowStatus(!showStatus)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 99,
                  background: 'var(--emerald-50)',
                  border: '1px solid var(--emerald-100)',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--emerald-700)',
                }}
              >
                <span style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
                  <span style={{
                    position: 'absolute', inset: 0,
                    borderRadius: '50%',
                    background: '#059669',
                    animation: 'pulse-ring 1.5s ease-out infinite',
                    opacity: 0.6,
                  }} />
                  <span style={{
                    position: 'absolute', inset: 0,
                    borderRadius: '50%',
                    background: '#059669',
                  }} />
                </span>
                <span className="status-label">All Systems Online</span>
              </button>

              {/* Dropdown */}
              {showStatus && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: 300,
                  background: '#fff',
                  borderRadius: 16,
                  border: '1px solid var(--slate-200)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                  animation: 'fadeInUp 0.2s ease',
                  zIndex: 200,
                }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--slate-800)' }}>Backend Services</div>
                      <div style={{ fontSize: 11, color: 'var(--slate-400)', marginTop: 2 }}>Multi-agent AI architecture</div>
                    </div>
                    <button onClick={() => setShowStatus(false)} style={{ color: 'var(--slate-400)', cursor: 'pointer', fontSize: 18 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                    </button>
                  </div>
                  <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {services.map((s, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        background: 'var(--slate-50)',
                        borderRadius: 8,
                      }}>
                        <span style={{ fontSize: 12, color: 'var(--slate-700)', fontWeight: 500 }}>{s.name}</span>
                        <span style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          fontSize: 11, fontWeight: 700, color: s.color,
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #0d9488)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
              cursor: 'pointer',
              border: '2px solid white',
              boxShadow: '0 0 0 2px var(--blue-200)',
            }}>
              EV
            </div>

            {/* Hamburger - mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: 'none', color: 'var(--slate-600)', cursor: 'pointer' }}
              className="hamburger-btn"
            >
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#fff',
            borderBottom: '1px solid var(--slate-200)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            animation: 'fadeInUp 0.2s ease',
            zIndex: 99,
          }}>
            {navItems.map(item => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 20px',
                    fontSize: 15,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--blue-700)' : 'var(--slate-600)',
                    background: isActive ? 'var(--blue-50)' : 'transparent',
                    borderBottom: '1px solid var(--slate-100)',
                    textDecoration: 'none',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* ─── RESPONSIVE STYLES ─── */}
      <style>{`
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .status-label { display: none; }
        }
      `}</style>

      {/* ─── BOTTOM NAV (Mobile only) ─── */}
      <nav style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--slate-200)',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
        padding: '8px 0 max(env(safe-area-inset-bottom), 8px)',
      }} className="bottom-nav">
        {navItems.map(item => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              flex: 1,
              padding: '4px 0',
              color: isActive ? 'var(--blue-600)' : 'var(--slate-400)',
              textDecoration: 'none',
              transition: 'color 0.18s ease',
            }}>
              <div style={{
                width: 36, height: 28,
                borderRadius: 8,
                background: isActive ? 'var(--blue-50)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.18s ease',
              }}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: 22 }}>{item.icon}</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, letterSpacing: '0.02em' }}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
      <style>{`
        @media (max-width: 767px) {
          .bottom-nav { display: flex !important; }
        }
      `}</style>
    </>
  );
}
