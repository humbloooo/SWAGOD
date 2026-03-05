import { NextResponse } from "next/server";
import { getPromos, addPromo, updatePromo, deletePromo } from "@/lib/db";
import { Product } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
    const promos = await getPromos();
    return NextResponse.json(promos || []);
}

export async function POST(request: Request) {
    const body = await request.json();

    // Firestore-based: Only support adding a single item
    // Generate ID purely for client-side optimisms if needed, but Firestore can auto-gen.
    // However, keeping consistent ID is good.
    const newPromo = { ...body };
    if (!newPromo.id || newPromo.id === "") {
        delete newPromo.id;
    }
    await addPromo(newPromo);
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
    const body: Product = await request.json();
    if (!body.id) {
        return NextResponse.json({ error: "Promo ID required" }, { status: 400 });
    }
    await updatePromo(body as Product & { id: string });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
        await deletePromo(id);
        revalidatePath("/", "layout");
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
}
