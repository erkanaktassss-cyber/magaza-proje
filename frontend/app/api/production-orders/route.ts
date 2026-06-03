import { NextResponse } from 'next/server';
import { listResource } from '@/lib/db';

export async function GET() { return NextResponse.json(await listResource('productionOrders')); }
