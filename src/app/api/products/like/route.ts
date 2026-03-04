import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Product from "@/lib/models/Product";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { productId, action } = await request.json();
        const userEmail = session.user.email;

        await dbConnect();

        const updateQuery = action === 'like'
            ? { $addToSet: { likes: userEmail } }
            : { $pull: { likes: userEmail } };

        const doc = await Product.findByIdAndUpdate(productId, updateQuery, { new: true });

        if (!doc) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, count: doc.likes?.length || 0 });
    } catch {
        return NextResponse.json({ error: "Sync failed" }, { status: 500 });
    }
}
