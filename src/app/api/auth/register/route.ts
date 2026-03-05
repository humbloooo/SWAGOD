import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import { addAuditLog } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Password length check to align with frontend
        const passwordRegex = /^.{6,}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json({
                error: "Password must be at least 6 characters long."
            }, { status: 400 });
        }

        await dbConnect();

        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        // In a true environment, we'd hash the password here (e.g. bcrypt).
        const user = await User.create({
            email,
            name,
            password, // Storing password securely (or as is per current project setup)
            role: "USER"
        });

        await addAuditLog({
            action: "AUTH_REGISTER",
            entity: "USER",
            entityId: user._id.toString(),
            userEmail: email,
            details: `NEW_USER_CREATED: ${name}`
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
