import { NextResponse } from "next/server";
import { getLogs, isUserAdmin } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = session?.user?.email ? await isUserAdmin(session.user.email) : false;

        const logs = await getLogs(isAdmin);
        return NextResponse.json(logs);
    } catch (error) {
        console.error("Logs API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
