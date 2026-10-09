'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Session {
  sessionId: string;
  patientId: string;
  timestamp: string;
  triageScore: string;
  chiefComplaint: string;
  vectorSimilarity: number;
  transcript: { speaker: string; text: string }[];
  extractedEntities: {
    symptoms: string[];
    onset?: string;
    riskLevel: string;
  };
}

export default function ClinicalSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      try {
        const res = await fetch('/api/sessions');
        if (res.ok) {
          const json = await res.json();
          setSessions(json.sessions);
          if (json.sessions.length > 0) {
            setSelectedSession(json.sessions[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load clinical sessions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <header className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-xs text-cyan-400 hover:underline">
                &larr; Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1">Clinical Session Inspector</h1>
            <p className="text-xs text-slate-400">Live Agent Transcripts & Medical Entity Extraction</p>
          </div>
        </header>

        {loading ? (
          <p className="text-slate-500 text-sm">Loading clinical sessions...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Session List Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Recent Triage Sessions
              </h2>
              <div className="space-y-2">
                {sessions.map((s) => (
                  <button
                    key={s.sessionId}
                    onClick={() => setSelectedSession(s)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedSession?.sessionId === s.sessionId
                        ? 'bg-slate-800 border-cyan-500 text-slate-100'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-cyan-400 font-bold">{s.sessionId}</span>
                      <span>{s.patientId}</span>
                    </div>
                    <p className="text-xs font-medium line-clamp-1 text-slate-200">{s.chiefComplaint}</p>
                    <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
                      <span>Vector Match: {(s.vectorSimilarity * 100).toFixed(1)}%</span>
                      <span>{s.triageScore}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Transcript & Clinical Inspection Panel */}
            {selectedSession && (
              <div className="lg:col-span-2 space-y-6">
                {/* Clinical Extraction Metadata */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{selectedSession.sessionId} Inspection</h3>
                      <p className="text-xs text-slate-400">Chief Complaint: {selectedSession.chiefComplaint}</p>
                    </div>
                    <span className="px-3 py-1 bg-rose-950 text-rose-400 border border-rose-800 rounded text-xs font-mono">
                      {selectedSession.extractedEntities.riskLevel}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Extracted Entities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSession.extractedEntities.symptoms.map((symptom, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-slate-800 text-cyan-300 rounded text-xs border border-slate-700">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Conversation Transcript */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Agent & Patient Conversation Log
                  </h4>
                  <div className="space-y-3">
                    {selectedSession.transcript.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg text-xs max-w-xl ${
                          msg.speaker === 'Agent'
                            ? 'bg-slate-800 text-cyan-200 border border-slate-700 ml-auto'
                            : 'bg-slate-950 text-slate-300 border border-slate-800'
                        }`}
                      >
                        <span className="block text-[10px] font-mono text-slate-500 mb-1">{msg.speaker}</span>
                        {msg.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
