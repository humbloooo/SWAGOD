import { NextResponse } from 'next/server';
import { getProducts, saveProducts } from '@/lib/db';
import { Product } from '@/lib/data';

export async function GET() {
    const products = await getProducts();
    return NextResponse.json(products);
}

export async function POST(request: Request) {
    const product: Product = await request.json();
    const products = await getProducts();

    // Simple ID generation if not provided
    if (!product.id) {
        product.id = Math.random().toString(36).substr(2, 9);
    }

    products.push(product);
    await saveProducts(products);

    return NextResponse.json({ success: true, product });
}

export async function PUT(request: Request) {
    const updatedProduct: Product = await request.json();
    const products = await getProducts();

    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
        products[index] = updatedProduct;
        await saveProducts(products);
        return NextResponse.json({ success: true, product: updatedProduct });
    }

    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const products = await getProducts();
    const filtered = products.filter(p => p.id !== id);

    if (filtered.length === products.length) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await saveProducts(filtered);
    return NextResponse.json({ success: true });
}
