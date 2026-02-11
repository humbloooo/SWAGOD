import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET() {
    try {
        const settings = await getSettings();
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        await saveSettings(body);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}
