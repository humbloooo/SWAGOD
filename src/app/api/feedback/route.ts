import { NextResponse } from 'next/server';
import { addFeedback, getFeedback, deleteFeedback } from '@/lib/db';
import { Feedback } from '@/lib/types';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const newFeedback: Feedback = {
            id: Date.now().toString(),
            name: data.name,
            email: data.email,
            message: data.message,
            date: new Date().toISOString(),
        };

        await addFeedback(newFeedback);
        return NextResponse.json({ success: true, message: "Feedback received" });
    } catch (e) {
        return NextResponse.json({ success: false, error: "Failed to save feedback" }, { status: 500 });
    }
}

export async function GET() {
    const feedback = await getFeedback();
    return NextResponse.json(feedback);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    try {
        await deleteFeedback(id);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
    }
}
