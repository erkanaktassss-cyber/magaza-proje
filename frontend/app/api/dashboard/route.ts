import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/db';

export async function GET() { return NextResponse.json(await getDashboardData()); }
