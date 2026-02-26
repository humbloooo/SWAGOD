import { NextResponse } from 'next/server';
import { getArchives, addArchive, deleteArchive } from '@/lib/db';

export async function GET() {
    const data = await getArchives();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    try {
        const newItem = await request.json();
        if (!newItem.id) {
            newItem.id = Math.random().toString(36).substr(2, 9);
        }
        await addArchive(newItem);
        return NextResponse.json({ success: true, item: newItem });
    } catch {
        return NextResponse.json({ success: false, error: "Failed to add archive" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    try {
        await deleteArchive(id);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
    }
}
