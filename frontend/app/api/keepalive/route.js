import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const res = await fetch(`${apiUrl}/health`, { method: 'GET' });
    return NextResponse.json({ ok: res.ok, status: res.status, ts: Date.now() });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message, ts: Date.now() }, { status: 500 });
  }
}
