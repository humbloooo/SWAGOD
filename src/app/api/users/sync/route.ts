import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";

export async function POST(req: Request) {
    try {
        const { uid, email, name } = await req.json();

        if (!uid || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        await User.findOneAndUpdate(
            { email },
            { email, name, role: "USER" },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Sync error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
