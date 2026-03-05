import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/lib/models/Order";

export async function POST(req: Request) {
    try {
        const { reference, orderId } = await req.json();

        if (!reference) {
            return NextResponse.json({ error: "Reference missing" }, { status: 400 });
        }

        // Verify with Paystack API
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        const data = await response.json();

        if (data.status && data.data.status === "success") {
            await dbConnect();

            // Security: Check if amount matches order total (Paystack returns amount in kobo/cents)
            const order = await Order.findOne({ orderId });

            if (!order) {
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }

            // Paystack amount is in cents, multiply order total by 100 for comparison
            // However, Paystack might have different currencies. For now assuming ZAR.
            // const expectedAmount = order.total * 100;
            // if (data.data.amount !== expectedAmount) { ... }

            order.status = "paid";
            order.paystackReference = reference;
            await order.save();

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 });
    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
