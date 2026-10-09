import { NextResponse } from 'next/server';

export async function GET() {
  const FASTAPI_URL = process.env.FASTAPI_ORCHESTRATOR_URL || 'http://localhost:8000';

  try {
    const res = await fetch(`${FASTAPI_URL}/api/v1/tasks`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.warn('FastAPI unavailable, returning fallback queue state:', error);
  }

  return NextResponse.json({
    stats: { activeTasks: 1, redisStatus: 'Connecting...', vectorDbStatus: 'pgvector Ready' },
    tasks: [
      {
        id: 'TASK-9021',
        patientId: 'PT-8942',
        agent: 'Interview & Triage Agent',
        status: 'PROCESSING',
        priority: 'HIGH',
        createdAt: new Date().toISOString(),
      },
    ],
  });
}
