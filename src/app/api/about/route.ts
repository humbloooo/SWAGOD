import { NextResponse } from 'next/server';
import { getAbout, saveAbout } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET() {
    const data = await getAbout();
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
        const data = await request.json();
        await saveAbout(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DEBUG: Failed to save about:", error);
        return NextResponse.json({ error: "Failed to save about", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
