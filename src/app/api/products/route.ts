import { NextResponse } from 'next/server';
import { getProducts, addProduct, updateProduct, deleteProduct, getProductById, addAuditLog } from '@/lib/db';
import { apiError } from '@/lib/api-error';
import { Product } from '@/lib/types';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    let limit: number | undefined = undefined;

    if (limitParam && !isNaN(parseInt(limitParam, 10))) {
        limit = parseInt(limitParam, 10);
    }

    const products = await getProducts(limit);
    return NextResponse.json(products);
}

export async function POST(request: Request) {
    try {
        const product: Product = await request.json();

        // Simple ID generation if not provided (though Firestore can auto-gen)
        if (!product.id) {
            product.id = Math.random().toString(36).substr(2, 9);
        }

        const session = await getServerSession(authOptions);
        await addAuditLog({
            action: product.id ? "UPDATE_PRODUCT" : "ADD_PRODUCT",
            entity: "product",
            entityId: product.id || "NEW",
            adminEmail: session?.user?.email || "SYSTEM"
        });

        await addProduct(product);
        return NextResponse.json({ success: true, product });
    } catch (e) {
        return apiError(e instanceof Error ? e.message : "Failed to add product");
    }
}

export async function PUT(request: Request) {
    try {
        const updatedProduct: Product = await request.json();

        // Check existence first
        const existing = await getProductById(updatedProduct.id);
        if (!existing) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        await updateProduct(updatedProduct);
        return NextResponse.json({ success: true, product: updatedProduct });
    } catch (e) {
        return apiError(e instanceof Error ? e.message : "Failed to update product");
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return apiError("ID required", 400);

    try {
        const session = await getServerSession(authOptions);
        await addAuditLog({
            action: "DELETE_PRODUCT",
            entity: "product",
            entityId: id,
            adminEmail: session?.user?.email || "SYSTEM"
        });
        await deleteProduct(id);
        return NextResponse.json({ success: true });
    } catch (e) {
        return apiError(e instanceof Error ? e.message : "Failed to delete from inventory");
    }
}
