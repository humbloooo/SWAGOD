import { NextResponse } from 'next/server';
import { getGalleries, addGallery, deleteGallery } from '@/lib/db';

export async function GET() {
    const data = await getGalleries();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    try {
        const newItem = await request.json();
        if (!newItem.id || newItem.id === "") {
            delete newItem.id;
        }
        await addGallery(newItem);
        return NextResponse.json({ success: true, product: newItem });
    } catch {
        return NextResponse.json({ success: false, error: "Failed to add space" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    try {
        await deleteGallery(id);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
    }
}
