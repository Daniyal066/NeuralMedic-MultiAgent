import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === 'admin' && password === 'admin123') {
      const response = NextResponse.json({ success: true }, { status: 200 });

      response.cookies.set('auth_token', 'clinical_session_token_123', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid clinical credentials' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
