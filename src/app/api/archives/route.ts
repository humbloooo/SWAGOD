import { NextResponse } from 'next/server';
import { getArchives, saveArchives } from '@/lib/db';

export async function GET() {
    const data = await getArchives();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const newItem = await request.json();
    const archives = await getArchives();

    if (!newItem.id) {
        newItem.id = Math.random().toString(36).substr(2, 9);
    }

    archives.push(newItem);
    await saveArchives(archives);
    return NextResponse.json({ success: true, item: newItem });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Assuming archive items have IDs, need to verify

    // Check if archives have IDs. If not, we might need to delete by index or add IDs.
    // The previous POST code added IDs: Math.random()...

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const archives = await getArchives();
    const filtered = archives.filter(a => a.id !== id);

    await saveArchives(filtered);
    return NextResponse.json({ success: true });
}
