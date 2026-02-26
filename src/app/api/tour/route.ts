import { NextResponse } from 'next/server';
import { getTours, addTour, deleteTour } from '@/lib/db';
import { TourEvent } from '@/lib/types';

export async function GET() {
    const tours = await getTours();
    return NextResponse.json(tours);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await addTour(body as TourEvent);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to add tour' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await deleteTour(id);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 });
    }
}
