import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { firestore } from '@/lib/firebase-admin';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { productId, action } = await request.json();
        const userEmail = session.user.email;
        const productRef = firestore.collection('products').doc(productId);

        const doc = await productRef.get();
        if (!doc.exists) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const data = doc.data();
        let likedBy = data?.likedBy || [];

        if (action === 'like') {
            if (!likedBy.includes(userEmail)) {
                likedBy.push(userEmail);
            }
        } else {
            likedBy = likedBy.filter((email: string) => email !== userEmail);
        }

        await productRef.update({ likedBy });

        return NextResponse.json({ success: true, count: likedBy.length });
    } catch {
        return NextResponse.json({ error: "Sync failed" }, { status: 500 });
    }
}
