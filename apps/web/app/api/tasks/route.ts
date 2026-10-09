import { NextResponse } from 'next/server';

export async function GET() {
  const tasks = [
    {
      id: 'TASK-9021',
      patientId: 'PT-8942',
      agent: 'Interview & Triage Agent',
      status: 'PROCESSING',
      priority: 'HIGH',
      createdAt: new Date(Date.now() - 60000).toISOString(),
    },
    {
      id: 'TASK-9020',
      patientId: 'PT-3105',
      agent: 'Embedding Vector Search',
      status: 'COMPLETED',
      priority: 'NORMAL',
      createdAt: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: 'TASK-9019',
      patientId: 'PT-6621',
      agent: 'Context Extraction Agent',
      status: 'QUEUED',
      priority: 'URGENT',
      createdAt: new Date(Date.now() - 15000).toISOString(),
    },
  ];

  const stats = {
    activeTasks: tasks.filter((t) => t.status === 'PROCESSING' || t.status === 'QUEUED').length,
    redisStatus: 'Connected',
    vectorDbStatus: 'pgvector Ready',
  };

  return NextResponse.json({ stats, tasks });
}
