import { NextResponse } from "next/server";
import { getPromos, savePromos } from "@/lib/db";

export async function GET() {
    const promos = await getPromos();
    return NextResponse.json(promos || []);
}

export async function POST(request: Request) {
    const body = await request.json();

    // If it's a list, save it all (replaces everything, useful for delete/edit)
    // Or if it's a single item, append? 
    // Let's assume the client sends the NEW item to append, OR the full list.
    // For simplicity, let's handle "save full list" or "append one".
    // Let's strict to: POST = Append new promo. PUT = Replace full list (for delete/edit state).

    // Current pattern in other routes:
    // Products: POST = Append/Update single.

    // Let's support saving a single promo.
    const promos = await getPromos() || [];

    if (Array.isArray(body)) {
        // If body is array, replace all (bulk update)
        await savePromos(body);
        return NextResponse.json(body);
    }

    // Append single
    const newPromo = { ...body, id: body.id || Date.now().toString() };
    promos.push(newPromo);
    await savePromos(promos);

    return NextResponse.json(newPromo);
}
