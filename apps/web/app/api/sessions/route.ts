import { NextResponse } from 'next/server';

export async function GET() {
  const sessions = [
    {
      sessionId: 'SESS-1042',
      patientId: 'PT-8942',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      triageScore: 'HIGH URGENCY (8.8/10)',
      chiefComplaint: 'Acute chest pressure radiating to left arm',
      vectorSimilarity: 0.942,
      transcript: [
        { speaker: 'Agent', text: 'Hello. What symptoms are you experiencing today?' },
        { speaker: 'Patient', text: 'I have intense chest tightness and my left arm feels numb.' },
        { speaker: 'Agent', text: 'When did this sensation start, and are you feeling short of breath?' },
        { speaker: 'Patient', text: 'Started about 30 minutes ago after walking upstairs. Yes, breathing is hard.' },
      ],
      extractedEntities: {
        symptoms: ['Chest pressure', 'Left arm numbness', 'Dyspnea'],
        onset: '30 minutes ago',
        riskLevel: 'ACUTE_CORONARY_SYNDROME_SUSPECTED',
      },
    },
    {
      sessionId: 'SESS-1041',
      patientId: 'PT-3105',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      triageScore: 'ROUTINE (2.4/10)',
      chiefComplaint: 'Mild seasonal allergies and scratchy throat',
      vectorSimilarity: 0.812,
      transcript: [
        { speaker: 'Agent', text: 'What brings you in today?' },
        { speaker: 'Patient', text: 'My throat feels a bit scratchy and I have been sneezing.' },
      ],
      extractedEntities: {
        symptoms: ['Scratchy throat', 'Sneezing'],
        onset: '2 days ago',
        riskLevel: 'LOW_PRIORITY',
      },
    },
  ];

  return NextResponse.json({ sessions });
}
