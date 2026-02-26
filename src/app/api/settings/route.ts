import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export const revalidate = 300; // Cache for 5 minutes

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
    // @ts-expect-error - session.user might have role property
    if (!session || session.user?.role !== "admin") {
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
