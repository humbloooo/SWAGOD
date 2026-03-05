import { NextResponse } from 'next/server';
import { getGalleries, addGallery, deleteGallery } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET() {
    const data = await getGalleries();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    // @ts-expect-error - session.user is extended with role via NextAuth callbacks
    const userRole = session?.user?.role;
    if (!session || (userRole !== "admin" && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const newItem = await request.json();
        await addGallery(newItem);
        return NextResponse.json({ success: true, product: newItem });
    } catch (error) {
        console.error("DEBUG: Failed to add gallery item:", error);
        return NextResponse.json({ success: false, error: "Failed to add space", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    // @ts-expect-error - session.user is extended with role via NextAuth callbacks
    const userRole = session?.user?.role;
    if (!session || (userRole !== "admin" && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    try {
        await deleteGallery(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DEBUG: Failed to delete gallery item:", error);
        return NextResponse.json({ success: false, error: "Failed to delete", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
