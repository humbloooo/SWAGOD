import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        // In a true environment, we'd hash the password here (e.g. bcrypt).
        // For our sync adapter test pass-throughs, we just store the user profile.
        await User.create({
            email,
            name,
            role: "USER"
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
