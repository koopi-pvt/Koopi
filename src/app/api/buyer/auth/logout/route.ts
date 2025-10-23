import { NextResponse } from 'next/server';

export async function POST() {
  // In a production app with sessions, clear the session here
  return NextResponse.json({ success: true });
}
