import { NextResponse } from 'next/server';
import { trackVisit, getAnalytics } from '@/lib/db';

export async function POST() {
    await trackVisit();
    return NextResponse.json({ success: true });
}

export async function GET() {
    const data = await getAnalytics();
    return NextResponse.json(data);
}
