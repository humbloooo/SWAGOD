"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Product } from "@/lib/types";
// Verified: removed static import
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductPage() {
    const params = useParams();
    const id = params?.id as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            try {
                // Fetch all products to find current and related
                const res = await fetch('/api/products');
                const products: Product[] = await res.json();

                const found = products.find((p) => p.id === id);
                if (found) {
                    setProduct(found);
                    // Filter related: same category, not current
                    const related = products
                        .filter(p => p.category === found.category && p.id !== found.id)
                        .slice(0, 3); // Take top 3
                    setRelatedProducts(related);
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchProduct();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">LOADING...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">PRODUCT NOT FOUND</div>;

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24">
            <Header />
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                    {/* Image */}
                    <div className="relative aspect-[3/4] lg:aspect-square border border-black max-h-[80vh]">
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-8">
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
                                {product.title}
                            </h1>
                            <p className="text-2xl font-mono text-primary font-bold">
                                R {product.price.toFixed(2)}
                            </p>
                        </div>

                        <div className="prose prose-lg mb-12">
                            <p className="text-gray-600 font-mono text-sm leading-relaxed uppercase border-l-2 border-black pl-4">
                                {product.description}
                            </p>
                        </div>

                        {/* Size Selector */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase mb-4">Select Size</h3>
                                <div className="flex gap-4">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-12 flex items-center justify-center border font-mono font-bold transition-all ${selectedSize === size
                                                ? "bg-black text-white border-black"
                                                : "bg-transparent text-black border-gray-300 hover:border-black"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <AddToCartButton product={product} selectedSize={selectedSize} />

                        <div className="pt-8 text-xs font-mono text-gray-400">
                            <p>FREE SHIPPING ON ORDERS OVER R 2000</p>
                            <p>30-DAY RETURN POLICY</p>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-gray-200 pt-16">
                        <h2 className="text-2xl font-bold uppercase mb-8">You Might Also Like</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedProducts.map((rp) => (
                                <Link href={`/product/${rp.id}`} key={rp.id} className="group block">
                                    <div className="relative aspect-square border border-gray-200 mb-4 overflow-hidden">
                                        <Image
                                            src={rp.image}
                                            alt={rp.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <h3 className="font-bold uppercase text-sm">{rp.title}</h3>
                                    <p className="font-mono text-xs text-gray-500">R {rp.price.toFixed(2)}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Navigation />
        </main>
    );
}
