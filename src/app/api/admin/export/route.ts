import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";;
import { getAdminProducts } from "@/lib/db";

export const runtime = 'nodejs';

export async function GET() {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.email && (
        session.user.email.endsWith("@swagod.com") ||
        session.user.email === "admin@swagod.co.za"
    );

    if (!isAdmin) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const products = await getAdminProducts();

        // Item 91: Convert to CSV
        const header = "ID,Title,Price,Category,Active\n";
        const rows = products.map(p =>
            `${p.id},"${p.title.replace(/"/g, '""')}",${p.price},${p.category},${p.active !== false}`
        ).join("\n");

        const csv = header + rows;

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=swagod_products_export.csv'
            }
        });
    } catch (error) {
        console.error("Export failed", error);
        return new NextResponse("Export Failed", { status: 500 });
    }
}
