import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { theme } = await request.json();
    
    if (!['light', 'dark', 'system'].includes(theme)) {
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });
    
    response.cookies.set('theme', theme, {
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
      sameSite: 'strict',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

