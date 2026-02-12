import { NextResponse } from 'next/server';
import { getProducts, addProduct, updateProduct, deleteProduct, getProductById } from '@/lib/db';
import { Product } from '@/lib/types';

export async function GET() {
    const products = await getProducts();
    return NextResponse.json(products);
}

export async function POST(request: Request) {
    try {
        const product: Product = await request.json();

        // Simple ID generation if not provided (though Firestore can auto-gen)
        if (!product.id) {
            product.id = Math.random().toString(36).substr(2, 9);
        }

        await addProduct(product);
        return NextResponse.json({ success: true, product });
    } catch (e) {
        console.error("Failed to add product", e);
        return NextResponse.json({ success: false, error: "Failed to add product" }, { status: 500 });
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
        console.error("Failed to update product", e);
        return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    try {
        await deleteProduct(id);
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Failed to delete product", e);
        return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
    }
}
