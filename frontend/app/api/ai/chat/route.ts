import { NextRequest, NextResponse } from 'next/server';
import { aiReply } from '@/lib/production-data';

export async function POST(request: NextRequest) {
  const body = await request.json() as { message?: string };
  const reply = aiReply(body.message || '');
  return NextResponse.json({ reply, source: 'rule-based-production-assistant' });
}
