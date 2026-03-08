import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Transaction from "@/lib/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const transactions = await Transaction.find()
            .sort({ timestamp: -1 })
            .limit(10);

        return NextResponse.json(transactions);
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
