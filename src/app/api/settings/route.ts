import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const settings = await getSettings();
        return NextResponse.json(settings);
    } catch {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    // @ts-expect-error - session.user is extended with role via NextAuth callbacks
    const userRole = session?.user?.role;
    if (!session || (userRole !== "admin" && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        await saveSettings(body);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}
