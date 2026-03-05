import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/lib/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        const { items, total, shippingAddress, currency } = body;

        // Generate a clean order ID
        const orderId = `SWG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const newOrder = await Order.create({
            orderId,
            userEmail: session.user.email,
            items,
            total,
            currency: currency || "ZAR",
            status: "pending",
            shippingAddress
        });

        return NextResponse.json({ orderId: newOrder.orderId, id: newOrder._id });
    } catch (error) {
        console.error("Order creation failed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
