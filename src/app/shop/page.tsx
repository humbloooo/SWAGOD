"use client";

import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Link from "next/link";
import Image from "next/image";
import { useCachedProducts } from "@/lib/hooks/useCachedProducts";
import React, { memo, useState } from "react";
import { Product } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { useEffect } from "react";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];

export default function Shop() {
    const products = useCachedProducts();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const { currency, lastFetch } = useAppStore();
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
    const isLoading = products.length === 0 && !lastFetch;

    useEffect(() => {
        try {
            const stored = localStorage.getItem('recentlyViewed');
            if (stored) {
                setTimeout(() => setRecentlyViewed(JSON.parse(stored)), 0);
            }
        } catch (error) {
            console.error("Error reading recently viewed", error);
        }
    }, []);

    const filteredProducts = products.filter(product => {
        if (!selectedSize) return true;
        if (!product.sizes || product.sizes.length === 0) return false;
        return product.sizes.includes(selectedSize);
    });

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24">
            <Header />
            <div className="container mx-auto px-6">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8">
                    Shop // <span className="text-primary">All</span>
                </h1>

                <div className="flex flex-wrap gap-4 mb-12">
                    <button
                        onClick={() => setSelectedSize(null)}
                        className={`px-6 py-2 border font-mono text-sm uppercase transition-colors ${!selectedSize ? 'bg-primary border-primary text-white glow-primary' : 'border-white/20 text-white hover:border-primary'}`}
                    >
                        ALL
                    </button>
                    {AVAILABLE_SIZES.map(size => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-6 py-2 border font-mono text-sm uppercase transition-colors ${selectedSize === size ? 'bg-primary border-primary text-white glow-primary' : 'border-white/20 text-white hover:border-primary'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mb-24">
                    {isLoading ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse border border-white/10" />
                        ))
                    ) : (
                        <>
                            {filteredProducts.map((product) => (
                                <ShopProductCard key={product.id} product={product} currency={currency} />
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="col-span-full py-24 text-center border border-white/10 bg-white/5 backdrop-blur-sm">
                                    <span className="text-4xl block mb-4">🦇</span>
                                    <h3 className="text-xl font-black uppercase tracking-widest text-white/50">NO INVENTORY FOUND</h3>
                                    <p className="font-mono text-xs text-white/30 tracking-widest mt-2 uppercase">Try adjusting your filters.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {recentlyViewed.length > 0 && (
                    <div className="border-t border-white/10 pt-24 mb-24">
                        <h2 className="text-2xl font-black uppercase tracking-widest mb-12">
                            RECENTLY <span className="text-primary">CLASSIFIED</span>
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {recentlyViewed.map(product => (
                                <ShopProductCard key={`recent-${product.id}`} product={product} currency={currency} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Navigation />
        </main>
    );
}

const ShopProductCard = memo(function ShopProductCard({ product, currency }: { product: Product, currency: "ZAR" | "USD" }) {
    return (
        <Link href={`/product/${product.id}`} prefetch={true} className="group block">
            <div className="relative aspect-[3/4] border border-white/5 mb-4 overflow-hidden bg-surface group-hover:border-primary transition-colors">
                <Image
                    src={product.image || "/assets/placeholder.png"}
                    alt={product.title}
                    fill
                    className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                {product.images && product.images.length > 1 && (
                    <Image
                        src={product.images[1]}
                        alt={`${product.title} alternate`}
                        fill
                        className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-105"
                    />
                )}

                {product.category === 'merch' && (
                    <div className="absolute top-2 left-2 bg-primary text-black px-2 py-1 text-[8px] font-black tracking-widest uppercase">
                        MERCH
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm border border-white/10 text-white px-2 py-1 text-[8px] font-mono tracking-widest hidden group-hover:block uppercase">
                    {product.likes?.length || 0} SAVED
                </div>
            </div>
            <h3 className="font-bold uppercase text-lg group-hover:text-primary transition-colors">{product.title}</h3>
            <p className="font-mono text-sm text-gray-500">{formatPrice(product.price, currency)}</p>
        </Link>
    );
});
