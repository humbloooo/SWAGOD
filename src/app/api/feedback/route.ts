import { NextResponse } from 'next/server';

import { saveFeedback, getFeedback } from '@/lib/db';
import { Feedback } from '@/lib/types';

export async function POST(request: Request) {
    const data = await request.json();
    let feedbackList: Feedback[] = [];
    try {
        feedbackList = await getFeedback();
    } catch (e) {
        feedbackList = [];
    }

    const newFeedback: Feedback = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        message: data.message,
        date: new Date().toISOString(),
    };

    feedbackList.unshift(newFeedback); // Newest first
    await saveFeedback(feedbackList);

    return NextResponse.json({ success: true, message: "Feedback received" });
}

export async function GET() {
    let feedback: Feedback[] = [];
    try {
        feedback = await getFeedback();
    } catch (e) {
        feedback = [];
    }
    return NextResponse.json(feedback);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    let feedbackList = await getFeedback().catch(() => []) || [];
    const filtered = feedbackList.filter(f => f.id !== id);

    await saveFeedback(filtered);
    return NextResponse.json({ success: true });
}
