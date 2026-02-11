import { NextResponse } from 'next/server';
import { getAbout, saveAbout } from '@/lib/db';

export async function GET() {
    const data = await getAbout();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const data = await request.json();
    await saveAbout(data);
    return NextResponse.json({ success: true });
}
