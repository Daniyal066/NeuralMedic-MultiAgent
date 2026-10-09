import { NextResponse } from 'next/server';

export async function GET() {
  const FASTAPI_URL = process.env.FASTAPI_ORCHESTRATOR_URL || 'http://localhost:8000';

  try {
    const res = await fetch(`${FASTAPI_URL}/api/v1/sessions`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.warn('FastAPI unavailable, returning fallback session state:', error);
  }

  return NextResponse.json({ sessions: [] });
}
