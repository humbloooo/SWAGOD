import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const { uid, email, name } = await req.json();

        if (!uid || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Sync with Firestore 'users' collection (used by NextAuth FirestoreAdapter)
        await firestore.collection("users").doc(uid).set({
            id: uid,
            email,
            name,
            emailVerified: null,
            image: null,
            role: "user", // Default role
            createdAt: new Date().toISOString()
        }, { merge: true });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Sync error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
